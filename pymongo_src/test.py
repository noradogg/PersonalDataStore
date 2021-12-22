from pymongo import MongoClient

def insert_one_print(collection, post_data):
    post_id = collection.insert_one(post_data).inserted_id
    # insertを確認するため、_idを表示
    print(post_id)

def insert_one(collection, post_data):
    collection.insert_one(post_data)

def find_print(collection):
    # collection内のデータを表示
    for data in collection.find():
        print(data)




client = MongoClient('mongodb://root:password@mongodb')
db = client.test_database
collection = db.test_collection