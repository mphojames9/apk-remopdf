# Use the official Playwright Python image which contains all system dependencies
FROM mcr.microsoft.com/playwright/python:v1.45.0-jammy

WORKDIR /app

# Copy your requirements file and install Python packages
# (Adjust the path if your requirements file is named or located differently)
COPY backEnd/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code into the container
COPY . .

# Expose the default Render port
EXPOSE 10000

# Run your application
# (Note: If your current start command is 'uvicorn main:app', make sure your 
# working directory or PYTHONPATH is configured properly. If main.py is in backEnd,
# you might need "uvicorn backEnd.main:app")
CMD ["uvicorn", "backEnd.main:app", "--host", "0.0.0.0", "--port", "10000"]