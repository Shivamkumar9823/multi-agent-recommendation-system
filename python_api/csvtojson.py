import csv
import json

def csv_to_json(csv_file, json_file):
    data = []
    
    with open(csv_file, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    
    with open(json_file, mode='w', encoding='utf-8') as file:
        json.dump(data, file, indent=4)

# Example usage
csv_file_path = 'product_recommendation_data.csv'  # Replace with your CSV file path
json_file_path = 'data.json'  # Output JSON file path
csv_to_json(csv_file_path, json_file_path)

print(f'CSV data from "{csv_file_path}" has been converted to JSON and saved in "{json_file_path}".')