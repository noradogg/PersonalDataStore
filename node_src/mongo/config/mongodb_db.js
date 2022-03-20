mongodb_db = {
    url: "mongodb://mongodb:27017",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {
        username: "root",
        password: "password"
      }
    },
    db_name: "personal_data",
    collection_name: "personal_data_2"
  };

module.exports = mongodb_db;