import sqlite3
from ollama_service import OllamaService
import csv

class TrendingRecommendationAgent:
    def __init__(self, db_path, csv_path):
        self.db_path = db_path
        self.csv_path = csv_path
        self.ollama_service = OllamaService()

    def fetch_trending_products(self):
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            c.execute("SELECT title, price, rating FROM trending_products")
            products = c.fetchall()
            conn.close()
            return products
        except Exception as e:
            print(f"Error fetching trending products: {e}")
            return []

    def load_own_products(self):
        try:
            with open(self.csv_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                next(reader)  # Skip header
                return [row for row in reader]
        except Exception as e:
            print(f"Error loading own products: {e}")
            return []

    def generate_recommendations(self, user_data):
        trending_products = self.fetch_trending_products()
        own_products = self.load_own_products()
        
        if not trending_products or not own_products:
            return "No data available for recommendations."

        input_prompt = (f"User Data: {user_data}\n"
                 f"Trending Products:\n" + '\n'.join([f"Title: {t[0]}, Price: {t[1]}, Rating: {t[2]}" for t in trending_products]) +
                 f"\nOwn inventory: {own_products}\n"
                 "Based on user data and trending product patterns, recommend similar products from our own inventory.")

        try:
            return self.ollama_service.generate_response(input_prompt)
        
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return "Could not generate recommendations."

# Example usage
# if __name__ == '__main__':
#     agent = TrendingRecommendationAgent()
#     user_data = "User prefers affordable fiction books with high ratings."
#     recommendations = agent.generate_recommendations(user_data)
#     print("\nTrending Product Recommendations:")
#     print(recommendations)
