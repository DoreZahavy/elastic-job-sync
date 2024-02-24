import { watchMongoDBChanges } from './services/mongo.service.js';
async function main() {
    await watchMongoDBChanges();
}
main().catch(console.error);
