#!/bin/bash

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama as a background process
ollama serve &

# Give it time to start
sleep 5

# Pull the Mistral model before starting the app
ollama pull mistral

# Start the Python backend
exec "$@"
