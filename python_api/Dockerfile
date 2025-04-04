# Use a base image with Python
FROM python:3.10

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set the working directory inside the container
WORKDIR /app

# Copy project files
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose necessary ports
EXPOSE 11434 5000

# Start Ollama and run the backend
CMD ollama serve & python app.py
