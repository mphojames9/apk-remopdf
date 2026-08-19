import os
from weasyprint import HTML, CSS

def create_resume_pdf(html_content: str) -> str:
    output_path = "temp_resume_export.pdf"
    
    # WeasyPrint needs a base CSS to enforce A4 sizing and remove margins
    page_css = CSS(string='''
        @page {
            size: A4;
            margin: 0;
        }
        body {
            margin: 0;
            padding: 0;
        }
    ''')

    # Convert the React-generated HTML directly to a styled PDF
    try:
        HTML(string=html_content).write_pdf(
            output_path,
            stylesheets=[page_css]
        )
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise e
    
    return output_path