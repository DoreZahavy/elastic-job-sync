


import { watchMongoDBChanges } from './services/mongo.service.js';

async function main() {
  // Initialize any configurations (e.g., connect to Elasticsearch)
  
  // Start listening for MongoDB changes
  await watchMongoDBChanges();

}

main().catch(console.error);

