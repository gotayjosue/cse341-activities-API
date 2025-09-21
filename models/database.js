const env = require("dotenv").config();
const { MongoClient } = require('mongodb');


//database connection
async function main() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

module.exports = { MongoClient };