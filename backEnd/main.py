# backend/main.py
import io
import sys
import asyncio
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from playwright.sync_api import sync_playwright
from openai import OpenAI

from routers.editor import router as editor_router
from routers.tools import router as tools_router
from routers import resume

app = FastAPI(
    title="RemoPDF Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global holder for the AI client to prevent crashing on server startup
openai_client = None

class ResumePayload(BaseModel):
    html_content: str

class SummaryRequest(BaseModel):
    current_text: str
    job_title: str

@app.post("/api/suggest-summary")
async def suggest_summary(data: SummaryRequest):
    global openai_client
    
    if not data.job_title:
        raise HTTPException(status_code=400, detail="Job title is required for better context.")

    # Lazy initialization: Only look for the key when this endpoint is hit!
    if openai_client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500, 
                detail="AI Engine configuration error: OPENAI_API_KEY environment variable is not set on the server."
            )
        openai_client = OpenAI(api_key=api_key)

    prompt = f"""
    You are an expert resume writer. The user is writing a professional summary for the role of '{data.job_title}'.
    They have typed the following so far: "{data.current_text}"
    
    Task: Complete or refine this professional summary. Keep it impactful, action-oriented, under 500 characters, and written in the third person or strong first person. Do not include introductory text, just return the polished summary snippet.
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional resume co-writer."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        suggestion = response.choices[0].message.content.strip()
        return {"suggestion": suggestion}
        
    except Exception as e:
        print(f"\n🔥 AI ENGINE ERROR: {str(e)}\n")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/resume/download")
def generate_pdf(payload: ResumePayload):
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            
            # FIX: Use "domcontentloaded" instead of waiting for full network assets.
            # This stops external fonts or heavy styles from triggering the 30000ms timeout.
            page.set_content(payload.html_content, wait_until="domcontentloaded")
            
            page.add_style_tag(content="""
                @page { margin: 0 !important; size: A4 !important; }
                html, body { margin: 0 !important; padding: 0 !important; box-sizing: border-box !important; }
                body > * { margin-top: 0 !important; }
            """)
            
            # Give your Tailwind compilation exactly 2 seconds to settle down layout-wise
            page.wait_for_timeout(2000)
            
            pdf_bytes = page.pdf(
                format="A4",
                print_background=True,
                margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
                prefer_css_page_size=True
            )
            
            browser.close()
        
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"}
        )

    except Exception as e:
        print(f"\n🔥 FATAL PDF ENGINE ERROR: {str(e)}\n")
        raise HTTPException(status_code=500, detail=f"Engine Error: {str(e)}")

@app.get("/")
def root():
    return {"status": "online"}

app.include_router(editor_router)
app.include_router(tools_router)
app.include_router(resume.router) 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)