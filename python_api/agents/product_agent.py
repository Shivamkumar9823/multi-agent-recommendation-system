import pandas as pd
from ollama_service import OllamaService

class ProductAgent:
    def __init__(self, product_data_path,feedback_data_path):
        self.product_data = pd.read_csv(product_data_path)
        self.feedback_data = pd.read_csv(feedback_data_path)
        self.ollama_service = OllamaService()



    def analyze_feedback(self):
        feedback_summary = self.feedback_data.groupby('Product_ID')['Category'].value_counts().unstack(fill_value=0)

        feedback_summary['Net_Score'] = feedback_summary.get('like', 0) - feedback_summary.get('dislike', 0)
        
        self.product_data = self.product_data.merge(feedback_summary[['Net_Score']], on='Product_ID', 
         how='left').fillna({'Net_Score': 0})
        
    

    def recommend_products(self, customer_data):
        self.analyze_feedback()
        if customer_data is None:
           print("No user data available. Recommending popular products.")
           return self.recommend_popular_products()
        
        prompt = f"""
        Based on the following user data and feedback analysis, recommend 5 personalized products from {self.product_data}:
        Age: {customer_data['Age']}
        Gender: {customer_data['Gender']}
        Location: {customer_data['Location']}
        Browsing History: {customer_data['Browsing_History']}
        Purchase History: {customer_data['Purchase_History']}
        Customer Segment: {customer_data['Customer_Segment']}
        Avg Order Value: {customer_data['Avg_Order_Value']}
        Holiday: {customer_data['Holiday']}
        Season: {customer_data['Season']}
        """
        
        return self.ollama_service.generate_response(prompt)
    

    def recommend_popular_products(self):
        # Sort by Probability_of_Recommendation to get the most popular products
        popular_products = self.product_data.sort_values(by='Probability_of_Recommendation', ascending=False).head(5)
        print("Top 5 Popular Products:")
        return popular_products[['Product_ID', 'Category', 'Subcategory', 'Probability_of_Recommendation']]

   