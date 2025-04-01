import sqlite3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time

# Database setup
def setup_database():
    conn = sqlite3.connect('trending_products.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS trending_products (
            title TEXT,
            price TEXT,
            rating TEXT
        )
    ''')
    conn.commit()
    conn.close()

def product_exists(title):
    conn = sqlite3.connect('trending_products.db')
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM trending_products WHERE title = ?", (title,))
    exists = c.fetchone()[0] > 0
    conn.close()
    return exists



# Scraping trending products with pagination
def scrape_trending_products(base_url):
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

    try:
        page = 1
        while True:
            url = f"{base_url}/catalogue/page-{page}.html"
            print(f"Scraping Page {page}...")
            driver.get(url)
            time.sleep(3)

            # Check if the page exists by finding products
            products = driver.find_elements(By.CLASS_NAME, 'product_pod')
            if not products:
                print("No more pages to scrape.")
                break

            if page > 10:
                break
            
            # Insert into database
            conn = sqlite3.connect('trending_products.db')
            c = conn.cursor()

            for product in products:
                title = product.find_element(By.TAG_NAME, 'h3').text
                price = product.find_element(By.CLASS_NAME, 'price_color').text
                rating_element = product.find_element(By.CLASS_NAME, 'star-rating')
                rating = rating_element.get_attribute('class').split()[-1]

                c.execute("INSERT INTO trending_products (title, price, rating) VALUES (?, ?, ?)",
                          (title, price, rating))

                print(f"Added: {title}, {price}, {rating}")

            conn.commit()
            conn.close()
            page += 1

    finally:
        driver.quit()
        print("Scraping and data storage completed.")

# Run the functions
#setup_database()
#scrape_trending_products('http://books.toscrape.com')
