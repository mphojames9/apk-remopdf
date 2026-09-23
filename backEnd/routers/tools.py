import io
import zipfile
from typing import List
import fitz
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from PIL import Image
import tempfile
import os
from pdf2docx import Converter
import pdfplumber
import pandas as pd
from adobe.pdfservices.operation.auth.service_principal_credentials import ServicePrincipalCredentials
from adobe.pdfservices.operation.exception.exceptions import ServiceApiException, ServiceUsageException, SdkException
from adobe.pdfservices.operation.io.cloud_asset import CloudAsset
from adobe.pdfservices.operation.io.stream_asset import StreamAsset
from adobe.pdfservices.operation.pdf_services import PDFServices
from adobe.pdfservices.operation.pdf_services_media_type import PDFServicesMediaType
from adobe.pdfservices.operation.pdfjobs.jobs.export_pdf_job import ExportPDFJob
from adobe.pdfservices.operation.pdfjobs.jobs.create_pdf_job import CreatePDFJob
from adobe.pdfservices.operation.pdfjobs.params.export_pdf.export_pdf_params import ExportPDFParams
from adobe.pdfservices.operation.pdfjobs.params.export_pdf.export_pdf_target_format import ExportPDFTargetFormat
from adobe.pdfservices.operation.pdfjobs.result.export_pdf_result import ExportPDFResult
from adobe.pdfservices.operation.pdfjobs.result.create_pdf_result import CreatePDFResult
from dotenv import load_dotenv

import cv2
import numpy as np
load_dotenv()
from pyzbar.pyzbar import decode
from fastapi import APIRouter, UploadFile, File, HTTPException
from pyzbar.pyzbar import decode

router = APIRouter(
    prefix="/api/tools",
    tags=["PDF Tools"]
)

@router.post("/merge")
async def merge_pdfs(files: List[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least two PDFs are required to merge.")

    try:
        loaded_docs = []
        
        # STEP 1: Pre-check all documents for passwords
        for file in files:
            file_bytes = await file.read()
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            
            # Check for password protection immediately
            if doc.is_encrypted and not doc.authenticate(""):
                # Clean up the current doc
                doc.close()
                # Clean up any previously opened docs to prevent memory leaks
                for previously_opened_doc in loaded_docs:
                    previously_opened_doc.close()
                
                # Abort right here and tell the frontend which file is locked
                raise HTTPException(status_code=403, detail=f"ENCRYPTED:{file.filename}")
            
            # If safe, store the opened document in our temporary list
            loaded_docs.append(doc)

        # STEP 2: If we reach this line, NO files are encrypted. Proceed to merge.
        merged_pdf = fitz.open()
        for doc in loaded_docs:
            merged_pdf.insert_pdf(doc)
            doc.close() # Free up memory as we merge

        output = io.BytesIO()
        merged_pdf.save(output, garbage=4, deflate=True)
        merged_pdf.close()
        output.seek(0)

        # Return the successful response stream
        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Merged.pdf"}
        )
        
    except HTTPException:
        raise  # Re-raise our custom 403 or 400 safely
    except Exception as e:
        print(f"Merge Error: {str(e)}") # Log to terminal for debugging
        raise HTTPException(status_code=500, detail=f"Internal Processing Error: {str(e)}")

@router.post("/split")
async def split_pdf(file: UploadFile = File(...)):
    try:
        pdf_bytes = await file.read()
        src_doc = fitz.open(stream=pdf_bytes, filetype="pdf")
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for page_idx in range(len(src_doc)):
                single_page_doc = fitz.open()
                single_page_doc.insert_pdf(src_doc, from_page=page_idx, to_page=page_idx)
                
                page_buffer = io.BytesIO()
                single_page_doc.save(page_buffer)
                single_page_doc.close()
                page_buffer.seek(0)
                
                filename = f"page_{page_idx + 1}.pdf"
                zip_file.writestr(filename, page_buffer.getvalue())
                
        src_doc.close()
        zip_buffer.seek(0)
        
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename=split_{file.filename}.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to split PDF: {str(e)}")


@router.post("/compress")
async def compress_pdf(file: UploadFile = File(...), quality: int = Form(...)):
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")

        for page in doc:
            images = page.get_images()
            for img in images:
                xref = img[0]
                try:
                    pix = fitz.Pixmap(doc, xref)
                    
                    if pix.alpha:
                        pix = None
                        continue
                        
                    if pix.n >= 4: 
                        pix = fitz.Pixmap(fitz.csRGB, pix)
                    
                    img_data = pix.tobytes("jpeg", quality=quality)
                    doc.update_stream(xref, img_data)
                    doc.xref_set_key(xref, "Filter", "/DCTDecode")
                    doc.xref_set_key(xref, "ColorSpace", "/DeviceRGB" if pix.n == 3 else "/DeviceGray")
                    pix = None 
                except Exception:
                    continue

        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True)
        doc.close()
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=compressed_{file.filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Compression failed: {str(e)}")

@router.post("/image-to-pdf")
async def image_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="At least one image file is required.")

    try:
        pdf_doc = fitz.open()
        for file in files:
            image_bytes = await file.read()
            
            # Open the image stream (handles png, jpg, webp, etc.)
            img_doc = fitz.open(stream=image_bytes, filetype="img")
            pdf_bytes = img_doc.convert_to_pdf()
            img_doc.close()
            
            # Open generated page as pdf and append to main doc
            img_pdf = fitz.open("pdf", pdf_bytes)
            pdf_doc.insert_pdf(img_pdf)
            img_pdf.close()

        output = io.BytesIO()
        pdf_doc.save(output, garbage=4, deflate=True)
        pdf_doc.close()
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Images.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image to PDF conversion failed: {str(e)}")

@router.post("/pdf-to-images")
async def pdf_to_images(
    files: List[UploadFile] = File(...), 
    image_type: str = Form("png")
):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided.")
    
    # Normalize image type string format
    fmt = image_type.lower()
    if fmt not in ["png", "jpeg", "jpg"]:
        raise HTTPException(status_code=400, detail="Unsupported image format. Choose PNG or JPEG.")
    if fmt == "jpg":
        fmt = "jpeg"

    try:
        zip_buffer = io.BytesIO()
        
        # Open a ZIP archive stream to hold all page images across files
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                file_bytes = await file.read()
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                
                # Get clean base name of the file for naming output files inside the zip
                base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    # Render page to an image matrix (150 DPI for crisp visual balance)
                    pix = page.get_pixmap(dpi=150)
                    img_bytes = pix.tobytes(fmt)
                    
                    # Generate organized image filename inside the ZIP
                    img_filename = f"{base_name}_page_{page_num + 1}.{image_type.lower()}"
                    zip_file.writestr(img_filename, img_bytes)
                    
                doc.close()

        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Images.zip"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to Image conversion failed: {str(e)}")
        

@router.post("/get-previews")
async def get_previews(files: List[UploadFile] = File(...)):
    import base64
    try:
        result = []
        for file in files:
            file_bytes = await file.read()
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            pages_data = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                # Render to a compact 65 DPI map for fast web loading performance
                pix = page.get_pixmap(dpi=65)
                img_bytes = pix.tobytes("jpeg")
                base64_img = base64.b64encode(img_bytes).decode("utf-8")
                
                pages_data.append({
                    "page_index": page_num,
                    "thumbnail": f"data:image/jpeg;base64,{base64_img}"
                })
                
            result.append({
                "filename": file.filename,
                "pages": pages_data
            })
            doc.close()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate previews: {str(e)}")


@router.post("/remove-pages")
async def remove_pages(
    files: List[UploadFile] = File(...),
    config: str = Form(...), 
    mode: str = Form("single")
):
    import json
    try:
        parsed_config = json.loads(config)
        processed_docs = []
        
        for idx, file in enumerate(files):
            file_bytes = await file.read()
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            
            new_doc = fitz.open()
            # Fallback to keeping all pages if file config index list mismatch occurs
            kept_indices = parsed_config[idx] if idx < len(parsed_config) else list(range(len(doc)))
            
            for p_idx in kept_indices:
                if 0 <= p_idx < len(doc):
                    new_doc.insert_pdf(doc, from_page=p_idx, to_page=p_idx)
            
            doc.close()
            processed_docs.append((file.filename, new_doc))
            
        if mode == "single":
            final_doc = fitz.open()
            for _, doc in processed_docs:
                final_doc.insert_pdf(doc)
                doc.close()
                
            output = io.BytesIO()
            final_doc.save(output, garbage=4, deflate=True)
            final_doc.close()
            output.seek(0)
            
            return StreamingResponse(
                output,
                media_type="application/pdf",
                headers={"Content-Disposition": "attachment; filename=RemoPDF_Pro_Merged.pdf"}
            )
        else:
            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                for filename, doc in processed_docs:
                    base_name = filename.rsplit('.', 1)[0] if '.' in filename else filename
                    pdf_buffer = io.BytesIO()
                    doc.save(pdf_buffer, garbage=4, deflate=True)
                    doc.close()
                    zip_file.writestr(f"{base_name}_pro.pdf", pdf_buffer.getvalue())
                    
            zip_buffer.seek(0)
            return StreamingResponse(
                zip_buffer,
                media_type="application/zip",
                headers={"Content-Disposition": "attachment; filename=RemoPDF_Pro_Package.zip"}
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Page manipulation failed: {str(e)}")

@router.post("/compress-images")
async def compress_images(
    files: List[UploadFile] = File(...),
    quality: int = Form(...)
):
    if not files:
        raise HTTPException(status_code=400, detail="No image files provided.")
    
    try:
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                file_bytes = await file.read()
                
                # Natively open the raw memory stream using PIL (Pillow)
                img = Image.open(io.BytesIO(file_bytes))
                
                # CRITICAL FIX: Handle PNG/WEBP transparency safely
                # JPEGs can't have transparency. We place transparent images on a solid white background.
                if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                    bg = Image.new("RGB", img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    # Use alpha channel as mask to blend cleanly
                    bg.paste(img, mask=img.split()[3])
                    img = bg
                elif img.mode != 'RGB':
                    # Catch-all for other formats
                    img = img.convert('RGB')
                
                # Compress the image natively via PIL
                img_buffer = io.BytesIO()
                img.save(img_buffer, format="JPEG", quality=quality, optimize=True)
                compressed_bytes = img_buffer.getvalue()
                
                # Format the filename cleanly
                base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                img_filename = f"{base_name}_optimized.jpg"
                
                # Append to the ZIP package
                zip_file.writestr(img_filename, compressed_bytes)
                
        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Premium_Compressed_Images.zip"}
        )
    except Exception as e:
        # If it fails now, it will print the exact string to your Python terminal
        print(f"CRITICAL COMPRESSION ERROR: {str(e)}") 
        raise HTTPException(status_code=500, detail=f"Image compression failed: {str(e)}")

@router.post("/pdf-to-word")
async def convert_pdf_to_word(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided.")
    
    try:
        # Initialize Adobe Credentials correctly using your .env variable names
        credentials = ServicePrincipalCredentials(
            client_id=os.getenv('PDF_SERVICES_CLIENT_ID'),
            client_secret=os.getenv('PDF_SERVICES_CLIENT_SECRET')
        )
        pdf_services = PDFServices(credentials=credentials)
        
        zip_buffer = io.BytesIO()
        
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                file_bytes = await file.read()
                
                # --- The "Just Like All Others" Temp File Fix ---
                # We create a secure temporary physical file for Adobe to write to, 
                # exactly how you structured the pdf-to-excel route.
                fd_docx, temp_docx_path = tempfile.mkstemp(suffix=".docx")
                os.close(fd_docx)
                
                try:
                    # Upload the raw bytes to Adobe
                    input_asset = pdf_services.upload(input_stream=file_bytes, mime_type=PDFServicesMediaType.PDF)
                    
                    # Generate the DOCX
                    export_pdf_params = ExportPDFParams(target_format=ExportPDFTargetFormat.DOCX)
                    export_pdf_job = ExportPDFJob(input_asset=input_asset, export_pdf_params=export_pdf_params)
                    location = pdf_services.submit(export_pdf_job)
                    pdf_services_response = pdf_services.get_job_result(location, ExportPDFResult)
                    
                    # Retrieve the Adobe Stream
                    result_asset: CloudAsset = pdf_services_response.get_result().get_asset()
                    stream_asset: StreamAsset = pdf_services.get_content(result_asset)
                    
                    # 1. Safely write Adobe's output stream to the physical temp file
                    with open(temp_docx_path, "wb") as f:
                        f.write(stream_asset.get_input_stream())
                        
                    # 2. Read the physical file back into pure bytes for the ZIP archive
                    with open(temp_docx_path, "rb") as f:
                        docx_bytes = f.read()
                        
                    # Format filename cleanly for the ZIP archive
                    base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                    docx_filename = f"{base_name}.docx"
                    
                    zip_file.writestr(docx_filename, docx_bytes)
                    
                except Exception as adobe_error:
                    print(f"Adobe Engine Error on {file.filename}: {adobe_error}")
                    raise HTTPException(status_code=500, detail=f"Adobe failed to process {file.filename}.")
                finally:
                    # Always clean up physical files to protect Render's storage
                    if os.path.exists(temp_docx_path):
                        os.remove(temp_docx_path)
                        
        zip_buffer.seek(0)
        
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Word_Files.zip"}
        )
        
    except Exception as e:
        print(f"Word Conversion System Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF to Word conversion failed: {str(e)}")

@router.post("/pdf-to-excel")
async def convert_pdf_to_excel(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided.")

    try:
        # Initialize Adobe Credentials — same pattern as pdf-to-word
        credentials = ServicePrincipalCredentials(
            client_id=os.getenv('PDF_SERVICES_CLIENT_ID'),
            client_secret=os.getenv('PDF_SERVICES_CLIENT_SECRET')
        )
        pdf_services = PDFServices(credentials=credentials)

        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                file_bytes = await file.read()

                fd_xlsx, temp_xlsx_path = tempfile.mkstemp(suffix=".xlsx")
                os.close(fd_xlsx)

                try:
                    # Upload the raw bytes to Adobe
                    input_asset = pdf_services.upload(input_stream=file_bytes, mime_type=PDFServicesMediaType.PDF)

                    # Generate the XLSX — Adobe's actual table/layout-aware engine,
                    # instead of the old pdfplumber+pandas text dump
                    export_pdf_params = ExportPDFParams(target_format=ExportPDFTargetFormat.XLSX)
                    export_pdf_job = ExportPDFJob(input_asset=input_asset, export_pdf_params=export_pdf_params)
                    location = pdf_services.submit(export_pdf_job)
                    pdf_services_response = pdf_services.get_job_result(location, ExportPDFResult)

                    # Retrieve the Adobe Stream
                    result_asset: CloudAsset = pdf_services_response.get_result().get_asset()
                    stream_asset: StreamAsset = pdf_services.get_content(result_asset)

                    with open(temp_xlsx_path, "wb") as f:
                        f.write(stream_asset.get_input_stream())

                    with open(temp_xlsx_path, "rb") as f:
                        xlsx_bytes = f.read()

                    base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                    xlsx_filename = f"{base_name}.xlsx"

                    zip_file.writestr(xlsx_filename, xlsx_bytes)

                except Exception as adobe_error:
                    status_code = getattr(adobe_error, "status_code", None)
                    error_code = getattr(adobe_error, "error_code", None) or getattr(adobe_error, "code", None)
                    print(f"Adobe Engine Error on {file.filename}: status={status_code} code={error_code} detail={adobe_error}")
                    raise HTTPException(status_code=500, detail=f"Adobe failed to process {file.filename}: {adobe_error}")
                finally:
                    if os.path.exists(temp_xlsx_path):
                        os.remove(temp_xlsx_path)

        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Excel_Files.zip"}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Excel Conversion Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF to Excel conversion failed: {str(e)}")

@router.post("/word-to-pdf")
async def convert_word_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No Word files provided.")

    for file in files:
        if not file.filename.lower().endswith((".doc", ".docx")):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a Word document (.doc/.docx).")

    try:
        credentials = ServicePrincipalCredentials(
            client_id=os.getenv('PDF_SERVICES_CLIENT_ID'),
            client_secret=os.getenv('PDF_SERVICES_CLIENT_SECRET')
        )
        pdf_services = PDFServices(credentials=credentials)

        converted_files = []  # list of (filename, pdf_bytes)

        for file in files:
            file_bytes = await file.read()

            fd_pdf, temp_pdf_path = tempfile.mkstemp(suffix=".pdf")
            os.close(fd_pdf)

            try:
                # Legacy .doc (binary/OLE2) and modern .docx (OOXML/zip) are
                # different file formats. Adobe validates the upload's bytes
                # against the mime_type you declare, so a .doc file uploaded
                # as DOCX gets rejected as invalid/corrupt. Pick the type that
                # actually matches the extension.
                is_legacy_doc = file.filename.lower().endswith(".doc") and not file.filename.lower().endswith(".docx")
                media_type = PDFServicesMediaType.DOC if is_legacy_doc else PDFServicesMediaType.DOCX

                # Upload the raw Word bytes to Adobe
                input_asset = pdf_services.upload(input_stream=file_bytes, mime_type=media_type)

                # Convert to PDF
                create_pdf_job = CreatePDFJob(input_asset=input_asset)
                location = pdf_services.submit(create_pdf_job)
                pdf_services_response = pdf_services.get_job_result(location, CreatePDFResult)

                # Retrieve the Adobe Stream
                result_asset: CloudAsset = pdf_services_response.get_result().get_asset()
                stream_asset: StreamAsset = pdf_services.get_content(result_asset)

                with open(temp_pdf_path, "wb") as f:
                    f.write(stream_asset.get_input_stream())

                with open(temp_pdf_path, "rb") as f:
                    pdf_bytes = f.read()

                base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                converted_files.append((f"{base_name}.pdf", pdf_bytes))

            except Exception as adobe_error:
                # CRITICAL FIX: adobe_error.message / str(adobe_error) is often just
                # the exception class with no detail for ServiceApiException. Pull the
                # actual status/error code out so the terminal tells you what really
                # went wrong (bad auth, quota exhausted, invalid file, etc.) instead of
                # every failure looking identical.
                status_code = getattr(adobe_error, "status_code", None)
                error_code = getattr(adobe_error, "error_code", None) or getattr(adobe_error, "code", None)
                print(f"Adobe Engine Error on {file.filename}: status={status_code} code={error_code} detail={adobe_error}")
                raise HTTPException(status_code=500, detail=f"Adobe failed to process {file.filename}: {adobe_error}")
            finally:
                if os.path.exists(temp_pdf_path):
                    os.remove(temp_pdf_path)

        # Single file: hand back the PDF directly instead of a zip
        if len(converted_files) == 1:
            filename, pdf_bytes = converted_files[0]
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )

        # Multiple files: zip them together
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for filename, pdf_bytes in converted_files:
                zip_file.writestr(filename, pdf_bytes)
        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Word_to_PDF.zip"}
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Word to PDF System Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Word to PDF conversion failed: {str(e)}")

@router.post("/excel-to-pdf")
async def convert_excel_to_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No Excel files provided.")

    for file in files:
        if not file.filename.lower().endswith((".xls", ".xlsx")):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not an Excel spreadsheet (.xls/.xlsx).")

    try:
        credentials = ServicePrincipalCredentials(
            client_id=os.getenv('PDF_SERVICES_CLIENT_ID'),
            client_secret=os.getenv('PDF_SERVICES_CLIENT_SECRET')
        )
        pdf_services = PDFServices(credentials=credentials)

        converted_files = []  # list of (filename, pdf_bytes)

        for file in files:
            file_bytes = await file.read()

            fd_pdf, temp_pdf_path = tempfile.mkstemp(suffix=".pdf")
            os.close(fd_pdf)

            try:
                # Legacy .xls (binary BIFF) and modern .xlsx (OOXML/zip) are
                # different file formats. Adobe validates the upload's bytes
                # against the mime_type you declare, so an .xls file uploaded
                # as XLSX gets rejected as invalid/corrupt. Pick the type that
                # actually matches the extension.
                is_legacy_xls = file.filename.lower().endswith(".xls") and not file.filename.lower().endswith(".xlsx")
                media_type = PDFServicesMediaType.XLS if is_legacy_xls else PDFServicesMediaType.XLSX

                # Upload the raw Excel bytes to Adobe
                input_asset = pdf_services.upload(input_stream=file_bytes, mime_type=media_type)

                # Convert to PDF
                create_pdf_job = CreatePDFJob(input_asset=input_asset)
                location = pdf_services.submit(create_pdf_job)
                pdf_services_response = pdf_services.get_job_result(location, CreatePDFResult)

                # Retrieve the Adobe Stream
                result_asset: CloudAsset = pdf_services_response.get_result().get_asset()
                stream_asset: StreamAsset = pdf_services.get_content(result_asset)

                with open(temp_pdf_path, "wb") as f:
                    f.write(stream_asset.get_input_stream())

                with open(temp_pdf_path, "rb") as f:
                    pdf_bytes = f.read()

                base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                converted_files.append((f"{base_name}.pdf", pdf_bytes))

            except Exception as adobe_error:
                # Pull the actual status/error code out so the terminal tells you
                # what really went wrong instead of every failure looking identical.
                status_code = getattr(adobe_error, "status_code", None)
                error_code = getattr(adobe_error, "error_code", None) or getattr(adobe_error, "code", None)
                print(f"Adobe Engine Error on {file.filename}: status={status_code} code={error_code} detail={adobe_error}")
                raise HTTPException(status_code=500, detail=f"Adobe failed to process {file.filename}: {adobe_error}")
            finally:
                if os.path.exists(temp_pdf_path):
                    os.remove(temp_pdf_path)

        # Single file: hand back the PDF directly instead of a zip
        if len(converted_files) == 1:
            filename, pdf_bytes = converted_files[0]
            return StreamingResponse(
                io.BytesIO(pdf_bytes),
                media_type="application/pdf",
                headers={"Content-Disposition": f"attachment; filename={filename}"}
            )

        # Multiple files: zip them together
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for filename, pdf_bytes in converted_files:
                zip_file.writestr(filename, pdf_bytes)
        zip_buffer.seek(0)

        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_Excel_to_PDF.zip"}
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Excel to PDF System Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Excel to PDF conversion failed: {str(e)}")

@router.post("/add-password")
async def add_password_to_pdf(file: UploadFile = File(...), password: str = Form(...)):
    if not password:
        raise HTTPException(status_code=400, detail="Password string cannot be empty.")
        
    try:
        # Read the single uploaded PDF file into memory
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        
        output = io.BytesIO()
        
        # CRITICAL FIX: PyMuPDF explicitly requires 'user_pw' and 'owner_pw' parameters.
        doc.save(
            output, 
            encryption=fitz.PDF_ENCRYPT_AES_256, 
            user_pw=password, 
            owner_pw=password,
            garbage=4, 
            deflate=True
        )
        doc.close()
        output.seek(0)
        
        # Deduce a secure file name
        base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
        protected_filename = f"{base_name}_protected.pdf"
        
        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={protected_filename}"}
        )
    except Exception as e:
        print(f"Password Encryption Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF protection failed: {str(e)}")

@router.post("/verify-password")
async def verify_password(file: UploadFile = File(...), password: str = Form(...)):
    import base64
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")

        if not doc.is_encrypted:
            doc.close()
            return {"is_encrypted": False, "message": "Document is not encrypted."}

        # Attempt to decrypt
        auth_success = doc.authenticate(password)
        if not auth_success:
            doc.close()
            raise HTTPException(status_code=401, detail="Incorrect password.")

        # Generate a small visual proof (thumbnail of page 1)
        page = doc[0]
        pix = page.get_pixmap(dpi=65)
        img_bytes = pix.tobytes("jpeg")
        base64_img = base64.b64encode(img_bytes).decode("utf-8")
        doc.close()

        return {"success": True, "thumbnail": f"data:image/jpeg;base64,{base64_img}"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to verify PDF: {str(e)}")

@router.post("/remove-password")
async def remove_password_from_pdf(file: UploadFile = File(...), password: str = Form(...)):
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")

        if doc.is_encrypted:
            auth_success = doc.authenticate(password)
            if not auth_success:
                raise HTTPException(status_code=401, detail="Incorrect password.")

        output = io.BytesIO()
        # Saving without encryption parameters strips the password entirely
        doc.save(output, garbage=4, deflate=True)
        doc.close()
        output.seek(0)

        base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
        unlocked_filename = f"{base_name}_unlocked.pdf"

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={unlocked_filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Decryption Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF decryption failed: {str(e)}")

@router.post("/change-password")
async def change_password_of_pdf(
    file: UploadFile = File(...), 
    old_password: str = Form(...),
    new_password: str = Form(...)
):
    if not new_password:
        raise HTTPException(status_code=400, detail="New password cannot be empty.")
        
    try:
        file_bytes = await file.read()
        doc = fitz.open(stream=file_bytes, filetype="pdf")

        # Authenticate the old password if the file is currently encrypted
        if doc.is_encrypted:
            auth_success = doc.authenticate(old_password)
            if not auth_success:
                raise HTTPException(status_code=401, detail="Incorrect current password.")

        output = io.BytesIO()
        
        # Save the file with the brand new password using AES-256
        doc.save(
            output, 
            encryption=fitz.PDF_ENCRYPT_AES_256, 
            user_pw=new_password, 
            owner_pw=new_password,
            garbage=4, 
            deflate=True
        )
        doc.close()
        output.seek(0)

        base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
        changed_filename = f"{base_name}_updated.pdf"

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={changed_filename}"}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Password Change Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF password change failed: {str(e)}")

@router.post("/pdf-to-ppt")
async def convert_pdf_to_ppt(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No PDF files provided.")

    try:
        credentials = ServicePrincipalCredentials(
            client_id=os.getenv('PDF_SERVICES_CLIENT_ID'),
            client_secret=os.getenv('PDF_SERVICES_CLIENT_SECRET')
        )
        pdf_services = PDFServices(credentials=credentials)

        zip_buffer = io.BytesIO()

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for file in files:
                file_bytes = await file.read()

                # Check for password protection immediately — kept exactly as before,
                # the frontend's pptProtectedError flow relies on this precise
                # "ENCRYPTED:<filename>" detail string to prompt for a password.
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                if doc.is_encrypted and not doc.authenticate(""):
                    doc.close()
                    raise HTTPException(status_code=403, detail=f"ENCRYPTED:{file.filename}")
                doc.close()

                fd_pptx, temp_pptx_path = tempfile.mkstemp(suffix=".pptx")
                os.close(fd_pptx)

                try:
                    # Upload the raw PDF bytes to Adobe
                    input_asset = pdf_services.upload(input_stream=file_bytes, mime_type=PDFServicesMediaType.PDF)

                    # Generate the PPTX — Adobe's real conversion engine (actual text/
                    # shape slides), instead of rasterizing each page into one big image
                    export_pdf_params = ExportPDFParams(target_format=ExportPDFTargetFormat.PPTX)
                    export_pdf_job = ExportPDFJob(input_asset=input_asset, export_pdf_params=export_pdf_params)
                    location = pdf_services.submit(export_pdf_job)
                    pdf_services_response = pdf_services.get_job_result(location, ExportPDFResult)

                    # Retrieve the Adobe Stream
                    result_asset: CloudAsset = pdf_services_response.get_result().get_asset()
                    stream_asset: StreamAsset = pdf_services.get_content(result_asset)

                    with open(temp_pptx_path, "wb") as f:
                        f.write(stream_asset.get_input_stream())

                    with open(temp_pptx_path, "rb") as f:
                        ppt_bytes = f.read()

                    base_name = file.filename.rsplit('.', 1)[0] if '.' in file.filename else file.filename
                    ppt_filename = f"{base_name}_Presentation.pptx"

                    zip_file.writestr(ppt_filename, ppt_bytes)

                except HTTPException:
                    raise
                except Exception as adobe_error:
                    status_code = getattr(adobe_error, "status_code", None)
                    error_code = getattr(adobe_error, "error_code", None) or getattr(adobe_error, "code", None)
                    print(f"Adobe Engine Error on {file.filename}: status={status_code} code={error_code} detail={adobe_error}")
                    raise HTTPException(status_code=500, detail=f"Adobe failed to process {file.filename}: {adobe_error}")
                finally:
                    if os.path.exists(temp_pptx_path):
                        os.remove(temp_pptx_path)

        zip_buffer.seek(0)
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={"Content-Disposition": "attachment; filename=RemoPDF_PowerPoint_Files.zip"}
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"PPT Conversion Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF to PPT conversion failed: {str(e)}")

@router.post("/scan-qr")
async def scan_qr_code(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()

        # Convert image bytes into OpenCV format
        np_arr = np.frombuffer(file_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid or unsupported image file.")

        # 1. Attempt detection with pyzbar (high accuracy)
        decoded_objects = decode(img)
        if decoded_objects:
            qr_data = decoded_objects[0].data.decode("utf-8")
            return {"success": True, "result": qr_data}

        # 2. Fallback to OpenCV QRCodeDetector
        detector = cv2.QRCodeDetector()
        data, _, _ = detector.detectAndDecode(img)
        if data:
            return {"success": True, "result": data}

        raise HTTPException(status_code=400, detail="No QR code could be detected in the provided image.")

    except HTTPException:
        raise
    except Exception as e:
        print(f"QR Scan Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to process QR code: {str(e)}")