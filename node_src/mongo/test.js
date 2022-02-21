const MongoClient = require('mongodb').MongoClient;

db_uri = "mongodb://root:password@mongodb:27017";

MongoClient.connect(mongodb_db.url, (err, client) => {
  if( err != null || client == null ){
    console.log(" !! failed to connect mongo db server !! ");
    console.log(err);
  }else{
    console.log(" @@ Connected successfully to server @@ ");
    const db = client.db(mongodb_db.db_name);
    const collection = db.collection(mongodb_db.collection_name);

    collection.find({"dp": "webclass_log"}).toArray((err, result) => {
      console.log(result); // 確認用でコンソールに表示
      console.log("timestamp: ", result[0].timestamp); // 確認用でコンソールに表示
      res.send("test")
    })
  }
});