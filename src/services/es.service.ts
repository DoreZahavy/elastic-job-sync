import { Client } from '@elastic/elasticsearch';
import mongoDB from 'mongodb'
import { config } from '../config/index.js'

const { esCloud = '', esPassword = '', esUsername = '' } = config

const elasticClient = new Client({
    cloud: {
        id: esCloud
    },
    auth: {
        username: esUsername,
        password: esPassword
    }
});

export const esService = {
    addDoc,
    updateDoc,
    removeDoc,
}

async function addDoc(collectionName: string, document: mongoDB.BSON.Document) {
    try {
        const strId = document._id.toHexString();
        delete document._id
        document.id = strId
        await elasticClient.index({
            index: `search-${collectionName}`,
            body: document,
            id: strId
        });
        console.log('Document indexed in Elasticsearch:', document);
    } catch (error) {
        console.error('Error indexing document in Elasticsearch:', error);
    }

}
async function updateDoc(collectionName: string, id: string, updatedFields: Partial<mongoDB.BSON.Document> | undefined) {

    //   const stringId = id.toHexString();
    try {
        await elasticClient.update({
            index: `search-${collectionName}`,
            id: id,
            body: { doc: updatedFields }
        });
        console.log('Document updated in Elasticsearch:', id);
    } catch (error) {
        console.error('Error updating document in Elasticsearch:', error);
    }
}
async function removeDoc(collectionName: string, id: string) {

    try {
        await elasticClient.delete({
            index: `search-${collectionName}`,
            id: id
        });
        console.log('Document removed from Elasticsearch:', id);
    } catch (error) {
        console.error('Error removing document from Elasticsearch:', error);
    }
}