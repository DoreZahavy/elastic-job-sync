import mongoDB from 'mongodb';
const { MongoClient } = mongoDB;
import { config } from '../config/index.js';
import { logger } from './logger.service.js';
import { esService } from './es.service.js';
var dbConn = null;
// Watch for changes in MongoDB
export async function watchMongoDBChanges() {
    const db = await _connect();
    const changeStreams = [];
    const collectionNames = ['job', 'user'];
    collectionNames.forEach(collectionName => {
        const collection = db.collection(collectionName);
        const changeStream = collection.watch();
        changeStream.on('change', async (change) => {
            console.log('Change detected in MongoDB:', change);
            if (change.operationType === 'insert') {
                await esService.addDoc(collectionName, change.fullDocument);
            }
            else if (change.operationType === 'update') {
                await esService.updateDoc(collectionName, change.documentKey._id.toHexString(), change.updateDescription.updatedFields);
            }
            else if (change.operationType === 'delete') {
                await esService.removeDoc(collectionName, change.documentKey._id.toHexString());
            }
        });
        changeStreams.push(changeStream);
    });
}
async function _connect() {
    if (dbConn)
        return dbConn;
    try {
        const client = await MongoClient.connect(config.dbURL || '');
        const db = client.db(config.dbName);
        dbConn = db;
        process.on('SIGINT', async () => {
            console.log('Closing MongoDB connection');
            await client.close();
            process.exit(0);
        });
        return db;
    }
    catch (err) {
        logger.error('Cannot Connect to DB', err);
        throw err;
    }
}
