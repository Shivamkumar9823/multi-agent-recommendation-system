import ollama

class OllamaService:
    def __init__(self, model='mistral'):
        self.model = model

    def generate_response(self, prompt):
        try:
            response = ollama.chat(model=self.model, messages=[{"role": "user", "content": prompt}])
            return response['message']['content']
        except Exception as e:
            print(f"Error in Ollama response: {e}")
            return "Sorry, I couldn't generate a response."
