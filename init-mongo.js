db = db.getSiblingDB('oir');

db.createCollection('startup_log');
db.startup_log.insertOne({
  message: 'The secure oir database was successfully created!',
  createdAt: new Date()
});