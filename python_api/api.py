from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.customer_agent import CustomerAgent
from agents.product_agent import ProductAgent
from agents.feedback_agent import FeedbackAgent
from agents.trendingRecommendation_agent import TrendingRecommendationAgent

app = Flask(__name__)
CORS(app)

# Initialize Agents
customer_agent = CustomerAgent('customer_data_collection.csv')
product_agent = ProductAgent('product_recommendation_data.csv', 'feedback.csv')
feedback_agent = FeedbackAgent()
trending_recommend_agent = TrendingRecommendationAgent('trending_products.db', 'product_recommendation_data.csv')


@app.route('/recommend-products', methods=['POST'])
def recommend_products():
    data = request.get_json()
    print("Received Data:", data)
    user_data = data.get('userdata')
    recommendations = product_agent.recommend_products(user_data)
    return jsonify(recommendations)

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    customer_id = data.get('customerId')
    product_id = data.get('productId')
    feedback_text = data.get('feedback')
    feedback_agent.collect_feedback(customer_id, product_id, feedback_text)
    return jsonify({'message': 'Feedback submitted successfully'})

@app.route('/trending-recommendations', methods=['POST'])
def trending_recommendations():
    data = request.get_json()
    user_id = data.get('userId')
    user_data = customer_agent.simulate_user_behavior(user_id)
    trending_recommendation = trending_recommend_agent.generate_recommendations(user_data)
    return jsonify(trending_recommendation)

if __name__ == '__main__':
    app.run(port=5001)
