import string
import sys
import json
from pymongo import MongoClient


class Mongodb(object):

    def __init__(self, dbName, collectionName):
        self.client = MongoClient("mongodb://root:password@mongodb")
        self.db = self.client[dbName]
        self.collection = self.db.get_collection(collectionName)

    def find_dp(self, data_provider):
        return self.collection.find_one(filter = { "dp": data_provider })

    def insert(self, log):
        if type(log) is not list:
            print("Error in Mongo.insert(): An invalid argument was given.", file=sys.stderr)
        return self.collection.insert_many(log)

# def connect_mongo():
#     with MongoClient("mongodb", 27017) as mongo_client:
#         mongo_client["admin"].authenticate("root","password")
#         return mongo_client

# def connect_mongo():
#     with MongoClient("mongodb://root:password@mongodb") as mongo_client:
#         return mongo_client


""" jsonファイルからデータを取り出してリストに格納 """
def get_from_jsonfile(path: string):
    data = []
    with open(path, "r") as f:
        data_dict = json.load(f)
        for _ in range(len(data_dict)):
            log_name, log_content = data_dict.popitem()
            data.append(log_content)
    return data

""" フィールド名の統一化
    変更するフィールドのみ、削除してフィールド名を変更したものを追加しているので、ドキュメント内で順番が変わってしまう

    データベースに保存するためにはオプションに "-o" をつけて下のコードを有効に
"""
def __unification(service_provider: string, source_data: list):
    # mongodbの dp_to_pds に接続し、どのように統一化するかを取得
    mongo_connector = Mongodb("dp_to_pds", "connector")
    connector = mongo_connector.find_dp(service_provider)
    field_names = connector["field_names"]

    # フィールド名の置き換え
    for i in range(len(source_data)):
        while len(field_names) > 0:
            original_field_name, new_field_name = field_names.popitem()
            if original_field_name in source_data[i]:
                source_data[i][new_field_name] = source_data[i].pop(original_field_name)
        source_data[i]["dp"] = connector["dp"]

    # 置き換えたものをmongodbの personal_data に保存
    if __debug__:
        print(source_data) # 確認用
    else:
        mongo_personaldata = Mongodb("personal_data", "personal_data")
        result = mongo_personaldata.insert(source_data)

""" フィールド名の統一化
    「ドキュメント内で順番が変わってしまう」を改善（処理が多くなってしまう）

    データベースに保存するためにはオプションに "-o" をつけて下のコードを有効に
"""
def unification(service_provider: string, source_data: list):
    # mongodbの dp_to_pds に接続し、どのように統一化するかを取得
    mongo_connector = Mongodb("dp_to_pds", "connector")
    connector = mongo_connector.find_dp(service_provider)
    field_names = connector["field_names"]

    # フィールド名の置き換え
    len_of_source_data = len(source_data)
    unified_data = [{} for _ in range(len_of_source_data)]
    for i in range(len_of_source_data):
        unified_data[i]["dp"] = connector["dp"]
        for key, value in source_data[i].items():
            if key in field_names:
                unified_data[i][field_names[key]] = value
            else:
                unified_data[i][key] = value

    # 置き換えたものをmongodbの personal_data に保存
    if __debug__:
        print(unified_data) # 確認用
    else:
        mongo_personaldata = Mongodb("personal_data", "personal_data")
        result = mongo_personaldata.insert(unified_data)


# sp_name = "webclass_log"
sp_name = "ocu_network_log"

log_data = get_from_jsonfile("./testdata/" + sp_name + ".json")
unification(sp_name, log_data)