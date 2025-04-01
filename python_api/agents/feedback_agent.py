import pandas as pd
import os
import ollama

class FeedbackAgent:
    def __init__(self, feedback_file_path="feedback.csv"):
        self.feedback_file_path = feedback_file_path
        
        # Create the feedback file if it doesn't exist
        if not os.path.exists(self.feedback_file_path):
            df = pd.DataFrame(columns=["User_ID", "Product_ID", "Feedback", "Timestamp","Category"])
            df.to_csv(self.feedback_file_path, index=False)

    def collect_feedback(self, user_id, product_id, feedback):
        """
        Collects and stores user feedback (like, dislike, or rating).
        feedback: Can be 'like', 'dislike', or a numerical rating (e.g., 1-5).
        """
        category = self.categorize_feedback(feedback)

        new_data = pd.DataFrame([{
            "User_ID": user_id,
            "Product_ID": product_id,
            "Feedback": feedback,
            "Timestamp": pd.Timestamp.now(),
            "Category": category
        }])

        # Append the feedback data
        new_data.to_csv(self.feedback_file_path, mode='a', header=not os.path.exists(self.feedback_file_path), index=False)
        print(f"Feedback recorded for User {user_id} on Product {product_id}.")

    def view_feedback(self):
        """
        View the feedback stored so far.
        """
        feedback_data = pd.read_csv(self.feedback_file_path)
        return feedback_data
    
    def categorize_feedback(self, feedback):
        """
        Uses Ollama to categorize the feedback as 'like', 'dislike', or 'neutral'.
        """
        prompt = f"Categorize the following feedback as like, dislike, or neutral: '{feedback}'"
        response = ollama.chat(model='mistral', messages=[{"role": "user", "content": prompt}])
        category = response['message']['content'].strip().lower()
        
        # Ensure proper categorization
        if category not in ['like', 'dislike', 'neutral']:
            category = 'neutral'
        
        return category
