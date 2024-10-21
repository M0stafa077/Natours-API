import os
import sys
from dotenv import load_dotenv
import pymongo
from pymongo import MongoClient
import json

with open('tours-simple.json', 'r') as file:
    oldData = json.load(file)

load_dotenv(os.path.join(os.path.dirname(__file__), "../../.env"))
connection_string = os.getenv("DATABASE")
connection_string = connection_string.replace("<PASSWORD>", os.getenv("DATABASE_PASSWORD"))

client = MongoClient(connection_string)

db = client['natours']
collection = db['tours']

def getAll():
    data = collection.find({})
    print("-------------------------------")
    for document in data:
        print(document)
    print("-------------------------------")

def deleteAll():
    deleted = collection.delete_many({})
    print("-------------------------------")
    print(deleted)
    print("-------------------------------")

def migrate():
    response = collection.insert_many(oldData)
    print("-------------------------------")
    print(response)
    print("-------------------------------")

if sys.argv[-1] == "get":
    getAll()
elif sys.argv[-1] == "delete":
    deleteAll()
elif sys.argv[-1] == "migrate":
    migrate()
