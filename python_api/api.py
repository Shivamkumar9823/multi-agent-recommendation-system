from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.customer_agent import CustomerAgent
from agents.product_agent import ProductAgent
from agents.feedback_agent import FeedbackAgent
from agents.trendingRecommendation_agent import TrendingRecommendationAgent
import sqlite3
import json
import re

app = Flask(__name__)
CORS(app)

DATABASE = 'recommendations.db'


def create_table():
    """Create the recommendations table if it doesn't exist."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS recommendations (
            user_hash TEXT PRIMARY KEY,
            user_data TEXT,
            product_ids TEXT
        )
    ''')
    conn.commit()
    conn.close()

def get_recommendation_from_db(user_hash):
    """Retrieve recommendations for a given user hash."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT product_ids FROM recommendations WHERE user_hash = ?", (user_hash,))
    result = cursor.fetchone()
    conn.close()
    if result:
        return json.loads(result[0])  # Convert string back to list
    return None

def save_recommendation_to_db(user_hash, user_data, recommendations):
    """Save recommendations to the database."""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT OR REPLACE INTO recommendations (user_hash, user_data, product_ids) VALUES (?, ?, ?)",
        (user_hash, json.dumps(user_data), json.dumps(recommendations))
    )
    conn.commit()
    conn.close()


def extract_product_ids(response_text):
    """Extract product IDs (e.g., P2007, P2008) from the response text."""
    return re.findall(r'P\d{4}', response_text)




# Initialize Agents
customer_agent = CustomerAgent('customer_data_collection.csv')
product_agent = ProductAgent('product_recommendation_data.csv', 'feedback.csv')
feedback_agent = FeedbackAgent()
trending_recommend_agent = TrendingRecommendationAgent('trending_products.db', 'product_recommendation_data.csv')


# @app.route('/simulate_user', methods=['POST'])
# def simulate_user():
#     data = request.get_json()
#     print("Received user Data:", data)
#     user_data = data.get('userdata')
@app.route('/recommend-products', methods=['POST'])
def recommend_products():
    data = request.get_json()
    print("Received Data:", data)

    user_data = data.get('userdata')
    user_hash = str(user_data['_id'])  # Using _id as a unique identifier

    # Check if user data exists in the database
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("SELECT user_data FROM recommendations WHERE user_hash = ?", (user_hash,))
    result = cursor.fetchone()
    conn.close()

    if result:
        stored_user_data = json.loads(result[0])  # Convert stored user_data string back to dict

        if stored_user_data == user_data:
            print("Returning cached recommendations as user data is unchanged.")
            
            # Fetch product_ids since user data is the same
            conn = sqlite3.connect(DATABASE)
            cursor = conn.cursor()
            cursor.execute("SELECT product_ids FROM recommendations WHERE user_hash = ?", (user_hash,))
            product_result = cursor.fetchone()
            conn.close()
            
            if product_result:
                stored_recommendations = json.loads(product_result[0])  # Convert stored product_ids back to list
                return jsonify({"Extracted Product IDs": stored_recommendations})

    # Generate new recommendations if user data has changed or not found
    recommendations = product_agent.recommend_products(user_data)
    product_ids = extract_product_ids(recommendations)

    # Save the updated recommendation
    save_recommendation_to_db(user_hash, user_data, product_ids)

    return jsonify({"Extracted Product IDs": product_ids})




# @app.route('/feedback', methods=['POST'])
# def feedback():
#     data = request.get_json()
#     customer_id = data.get('customerId')
#     product_id = data.get('productId')
#     feedback_text = data.get('feedback')
#     feedback_agent.collect_feedback(customer_id, product_id, feedback_text)
#     return jsonify({'message': 'Feedback submitted successfully'})

# @app.route('/trending-recommendations', methods=['POST'])
# def trending_recommendations():
#     data = request.get_json()
#     user_id = data.get('userId')
#     user_data = customer_agent.simulate_user_behavior(user_id)
#     trending_recommendation = trending_recommend_agent.generate_recommendations(user_data)
#     return jsonify(trending_recommendation)

if __name__ == '__main__':
    create_table()
    app.run(port=5001)
