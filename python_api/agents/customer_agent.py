import pandas as pd

class CustomerAgent:
    def __init__(self, data_source):
        self.data_source = data_source
        self.data = self.load_data()

    # Load data from CSV
    def load_data(self):
        try:
            data = pd.read_csv(self.data_source)
            print("Data Loaded Successfully!")
            return data
        except Exception as e:
            print(f"Error loading data: {e}")
            return None


    def recommend_popular_products(self):
        if self.data is None:
            print("No data available for recommendations.")
            return []

        # Calculate most popular products based on purchase history.
        all_purchases = self.data['Purchase_History'].dropna().apply(eval).sum()
        product_counts = pd.Series(all_purchases).value_counts()
        top_products = product_counts.head(5).index.tolist()

        print("Recommended Popular Products:", top_products)
        print("Special Discounts: 20% off on Bestsellers!")
        return top_products

    # Simulate user behavior or recommend products if user not found
    def simulate_user_behavior(self, customer_id):
        if self.data is None:
            print("No data available.")
            return None

        user_data = self.data[self.data['Customer_ID'] == customer_id]

        if user_data.empty:
            print(f"No data found for Customer ID: {customer_id}")
            print("Recommending Popular Products and Discounts...")
            return self.recommend_popular_products()

        # Extract relevant customer information
        simulated_data = {
            "Customer_ID": user_data['Customer_ID'].values[0],
            "Age": int(user_data['Age'].values[0]),
            "Gender": user_data['Gender'].values[0],
            "Location": user_data['Location'].values[0],
            "Browsing_History": eval(user_data['Browsing_History'].values[0]),
            "Purchase_History": eval(user_data['Purchase_History'].values[0]),
            "Customer_Segment": user_data['Customer_Segment'].values[0],
            "Avg_Order_Value": float(user_data['Avg_Order_Value'].values[0]),
            "Holiday": user_data['Holiday'].values[0],
            "Season": user_data['Season'].values[0]
        }

        print("Simulated Data for Analysis:", simulated_data)
        return simulated_data
