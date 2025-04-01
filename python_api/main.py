from agents.customer_agent import CustomerAgent
from agents.product_agent import ProductAgent
# from agents.product_agent import personalized_recommendations
from agents.feedback_agent import FeedbackAgent
# from agents.database_agent import create_tables
# from agents.monitoring_agent import log_event
from agents.trendingProduct_agent import setup_database,scrape_trending_products
from agents.trendingRecommendation_agent import TrendingRecommendationAgent


def run_system(user_id):
   # setup_database()
   # scrape_trending_products('http://books.toscrape.com')  #scrape trending product in trending_product.db;


    
    Feedback_agent = FeedbackAgent()
    collect_feedback = Feedback_agent.collect_feedback('C1009','P2141','not like it')  #feedback is submitted in feedback.csv
    
    customer_agent = CustomerAgent('customer_data_collection.csv')
    user_data = customer_agent.simulate_user_behavior(user_id)   # extract user data 
    
    
    product_agent = ProductAgent('product_recommendation_data.csv','feedback.csv')
    recommendations = product_agent.recommend_products(user_data)
    print(recommendations)


    trending_recommend_agent = TrendingRecommendationAgent('trending_products.db','product_recommendation_data.csv')
    trending_recommendation = trending_recommend_agent.generate_recommendations(user_data)
    print("\nTrending Product Recommendations:")
    print(trending_recommendation)

    


if __name__ == "__main__":
    run_system('C1009')
