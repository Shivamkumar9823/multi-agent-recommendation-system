# Use a base image with Python and Ollama installed
FROM python:3.10

# Install curl to download Ollama
RUN apt-get update && apt-get install -y curl

# Download and install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose Ollama's default port (11434) and Flask's default port (5000)
EXPOSE 11434 5000

# Start Ollama and then run the backend
CMD ollama serve & python app.py
