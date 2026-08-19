import base64
import io
import json
from typing import List, Dict, Optional

import fitz
from PIL import Image
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

router = APIRouter(
    prefix="/api",
    tags=["PDF Editor"]
)

class TextBoxModification(BaseModel):
    text: str
    x: float
    y: float
    fontSize: float = 14.0
    color: str = "#000000"

class ImageModification(BaseModel):
    base64Data: str
    x: float
    y: float
    width: float
    height: float
    rotation: float = 0.0

class PageEdits(BaseModel):
    pageNumber: int
    rotation: Optional[int] = 0
    drawingsBase64: Optional[str] = None
    texts: List[TextBoxModification] = []
    images: List[ImageModification] = []

@router.post("/process-pdf")
async def process_pdf(file: UploadFile = File(...), edits_json: str = Form(...)):
    try:
        raw_edits = json.loads(edits_json)
        deleted_pages: List[int] = raw_edits.get("deletedPages", [])
        pages_modifications: Dict[str, dict] = raw_edits.get("pages", {})

        pdf_bytes = await file.read()
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        target_w = 611.0
        target_h = 791.0

        for page_idx in range(len(doc)):
            page_num_1indexed = page_idx + 1
            page_key = str(page_num_1indexed)

            if page_num_1indexed in deleted_pages:
                continue

            page = doc[page_idx]
            rect = page.rect
            real_w = rect.width
            real_h = rect.height

            scale_x = real_w / target_w
            scale_y = real_h / target_h

            if page_key in pages_modifications:
                page_data = pages_modifications[page_key]

                if page_data.get("rotation", 0):
                    current_rotation = page.rotation
                    page.set_rotation((current_rotation + page_data["rotation"]) % 360)

                if page_data.get("drawingsBase64"):
                    b64_str = page_data["drawingsBase64"]
                    if "," in b64_str:
                        b64_str = b64_str.split(",")[1]
                    img_data = base64.b64decode(b64_str)
                    page.insert_image(rect, stream=img_data)

                for text_item in page_data.get("texts", []):
                    txt = text_item.get("text", "")
                    real_x = text_item.get("x", 0) * scale_x
                    real_y = text_item.get("y", 0) * scale_y
                    f_size = text_item.get("fontSize", 14) * ((scale_x + scale_y) / 2)
                    hex_color = text_item.get("color", "#000000").lstrip("#")
                    rgb = tuple(int(hex_color[i:i + 2], 16) / 255.0 for i in (0, 2, 4))

                    page.insert_text(
                        fitz.Point(real_x, real_y), txt, fontsize=f_size, color=rgb, fontname="helv"
                    )

                for image_item in page_data.get("images", []):
                    img_b64 = image_item.get("base64Data", "")
                    if "," in img_b64:
                        img_b64 = img_b64.split(",")[1]
                    raw_img = base64.b64decode(img_b64)

                    x = image_item.get("x", 0) * scale_x
                    y = image_item.get("y", 0) * scale_y
                    w = image_item.get("width", 100) * scale_x
                    h = image_item.get("height", 100) * scale_y
                    rotation = image_item.get("rotation", 0)

                    rect_img = fitz.Rect(x, y, x + w, y + h)

                    if rotation != 0:
                        pil_img = Image.open(io.BytesIO(raw_img))
                        rotated = pil_img.rotate(-rotation, expand=True)
                        buffer = io.BytesIO()
                        rotated.save(buffer, format="PNG")
                        raw_img = buffer.getvalue()

                    page.insert_image(rect_img, stream=raw_img)

        if deleted_pages:
            for page_num in sorted([p - 1 for p in deleted_pages], reverse=True):
                if 0 <= page_num < len(doc):
                    doc.delete_page(page_num)

        output = io.BytesIO()
        doc.save(output, garbage=4, deflate=True)
        doc.close()
        output.seek(0)

        return StreamingResponse(
            output,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=edited_{file.filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Processing Error: {str(e)}")