# Use an Ubuntu base image with Python
FROM ubuntu:20.04

# Install dependencies
RUN apt update && apt install -y \
    curl python3 python3-pip python3-venv

# Install Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

# Set working directory
WORKDIR /app

# Copy your backend code
COPY . /app

# Set up virtual environment
RUN python3 -m venv venv
RUN . venv/bin/activate && pip install -r requirements.txt

# Expose port (change based on your backend)
EXPOSE 5000

# Run the backend
CMD ["bash", "-c", "ollama serve & sleep 5 && source venv/bin/activate && python api.py"]
