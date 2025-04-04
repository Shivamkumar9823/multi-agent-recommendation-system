# Use an official Python image
FROM python:3.9

# Set the working directory
WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the necessary port (e.g., 5000 for Flask/FastAPI)
EXPOSE 5000

# Run Ollama and the app using the startup script
CMD ["./ollama_start.sh", "gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
