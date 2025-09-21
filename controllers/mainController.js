// Importing mongo client from database.js
const MongoClient = require('../models/database').MongoClient;

// Importing ObjectId to convert string id to MongoDB ObjectId
const ObjectId = require('mongodb').ObjectId;


async function homePage(req, res){
    res.send('Welcome to the Home Page')
}

// Get all activities
async function getAllActivities(req, res) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const activities = await client.db("CSE341").collection("activities").find().toArray();
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}


// Get activity by ID
async function getActivityById(req, res) {
    const activityId = new ObjectId(req.params.id);
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const activity = await client.db("CSE341").collection("activities").findOne({ _id: activityId });
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}

//Create an activity
async function createActivity(req, res) {
    const activity = {
        activity_name: req.body.activity_name,
        date: req.body.date,
        location: req.body.location,
        responsible: req.body.responsible,
        time: req.body.time,
        organization: req.body.organization,
        completed: req.body.completed
    };
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("activities").insertOne(activity);
        if (result.insertedId) {
            res.status(201).json({ _id: result.insertedId, ...activity });
        } else {
            res.status(500).json(result.error || 'Some error occurred while creating the activity.');
        }
    } finally {
        await client.close();
    }
}

//Update an activity
async function updateActivity(req, res) {
    const activityId = new ObjectId(req.params.id);
    const updatedActivity = req.body;
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("activities").findOneAndUpdate(
            { _id: activityId },
            { $set: updatedActivity },
            { returnOriginal: false }
        );
        if (result.value) {
            res.status(200).json(result.value);
        } else {
            res.status(404).json({ message: "activity not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}

//Delete an activity
async function deleteActivity(req, res) {
    const activityId = new ObjectId(req.params.id);
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("activities").deleteOne({ _id: activityId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Activity not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}


module.exports = { homePage, getAllActivities, getActivityById, createActivity, updateActivity, deleteActivity }