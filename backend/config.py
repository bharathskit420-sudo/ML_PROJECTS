from pymongo import MongoClient
from urllib.parse import quote_plus

username = "bharathskit420_db_user"
password = quote_plus("bharath@2005")  # automatically encodes @

MONGO_URI = f"mongodb+srv://{username}:{password}@cluster0.q4wocvr.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)
db = client["student_performance_db"]