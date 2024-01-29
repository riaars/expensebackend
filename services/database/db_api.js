const MongoClient = require('mongodb').MongoClient
const database = require('../../config/database.json')

async function getAllEntries(collectionName) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(
      database.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        const db = client.db(database.database_name)
        const collection = db.collection(collectionName)

        collection
          .find()
          .toArray()
          .then((doc) => {
            if (client) {
              client.close()
            }
            resolve(doc)
          })
          .catch((error) => {
            if (client) {
              client.close()
            }
            reject(error)
          })
      },
    )
  })
}

async function getEntriesByQuery(collectionName, query) {
  return await new Promise((resolve, reject) => {
    MongoClient.connect(
      database.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        if (err !== null) {
          reject(err)
        } else {
          const db = client.db(database.database_name)
          const collection = db.collection(collectionName)

          collection
            .find(query)
            .toArray()
            .then((doc) => {
              if (client) {
                client.close()
              }
              resolve(doc)
            })
            .catch((error) => {
              if (client) {
                client.close()
              }
              reject(error)
            })
        }
      },
    )
  })
}

async function addNewEntry(collectionName, query) {
  return await new Promise((resolve, reject) => {
    MongoClient.connect(
      database.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        console.log('masuk sini')
        if (err !== null) {
          console.log(err)
          reject(err)
        } else {
          const db = client.db(database.database_name)
          const collection = db.collection(collectionName)
          console.log(db)
          console.log(collection)
          collection
            .insertOne(query)
            .then((doc) => {
              if (client) {
                client.close()
              }
              resolve(doc)
            })
            .catch((error) => {
              if (client) {
                client.close()
              }
              reject(error)
            })
        }
      },
    )
  })
}

async function updateEntry(collectionName, filter, data) {
  return await new Promise((resolve, reject) => {
    MongoClient.connect(
      database.url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, client) {
        if (err !== null) {
          reject(err)
        } else {
          const db = client.db(database.database_name)
          const collection = db.collection(collectionName)

          collection
            .updateOne(filter, { $set: data })
            .then((res) => {
              if (client) {
                client.close()
              }
              resolve(res.result)
            })
            .catch((error) => {
              if (client) {
                client.close()
              }
              reject(error)
            })
        }
      },
    )
  })
}

module.exports = {
  getAllEntries: getAllEntries,
  getEntriesByQuery: getEntriesByQuery,
  addNewEntry: addNewEntry,
  updateEntry: updateEntry,
}
