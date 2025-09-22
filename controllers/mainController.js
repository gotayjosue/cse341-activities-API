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

// Get all users
async function getAllUsers(req, res) {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const user = await client.db("CSE341").collection("users").find().toArray();
        res.status(200).json(user);
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

// Get user by ID
async function getUserById(req, res) {
    const userId = new ObjectId(req.params.id);
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const user = await client.db("CSE341").collection("users").findOne({ _id: userId });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
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

//Create an user
async function createUser(req, res) {
    const user = {
        user_name: req.body.user_name,
        user_email: req.body.user_email,
        user_password: req.body.user_password
    };
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("users").insertOne(user);
        if (result.insertedId) {
            res.status(201).json({ _id: result.insertedId, ...user });
        } else {
            res.status(500).json(result.error || 'Some error occurred while creating the user.');
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

//Update an user
async function updateUser(req, res) {
    const userId = new ObjectId(req.params.id);
    const updatedUser = req.body;
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("users").findOneAndUpdate(
            { _id: userId },
            { $set: updatedUser },
            { returnOriginal: false }
        );
        if (result.value) {
            res.status(200).json(result.value);
        } else {
            res.status(404).json({ message: "User not found" });
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

//Delete an user
async function deleteUser(req, res) {
    const userId = new ObjectId(req.params.id);
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const result = await client.db("CSE341").collection("users").deleteOne({ _id: userId });
        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        await client.close();
    }
}


module.exports = { homePage, 
    getAllActivities, 
    getAllUsers,
    getActivityById, 
    getUserById,
    createActivity, 
    createUser, 
    updateActivity, 
    updateUser, 
    deleteActivity, 
    deleteUser }