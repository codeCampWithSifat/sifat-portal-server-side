const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;



// use the middleware
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri)

async function run () {
    try {
        // console.log('database connected successfully');
        const database = client.db("sifat_doctor_portal");
        const appoinmentsCollection = database.collection("user_appoinments");
        const userCollections = database.collection('unique_user');

        // appoinments api
        app.post('/appoinments', async(req,res) => {
            const appoinment = req.body ;
            const result = await appoinmentsCollection.insertOne(appoinment);
            res.json(result);
        });

        // get user information appoinmensts 
        app.get("/appoinments", async(req,res) => {
            const email = req.query.email ;
            const date = new Date(req.query.date).toLocaleDateString();
            const query = {email : email, date: date};
            // console.log(query)
            const cursor = appoinmentsCollection.find(query);
            const appoinments = await cursor.toArray();
            res.send(appoinments);
        });

        // get a single unique user information
        app.post('/users', async(req,res) => {
            const user = req.body ;
            const result = await userCollections.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // not to update for google authentication
        app.put('/users', async(req,res) => {
            const user = req.body ;
            const filter = {email : user.email};
            const options = { upsert: true };
            const updateDoc = {$set : user};
            const result = await userCollections.updateOne(filter, updateDoc, options);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
};

run().catch(console.dir)



app.get('/' ,(req,res) => {
    res.send('Hello Server side')
    console.log(`server side ok`)
})


app.listen(port ,() => {
    console.log(`Listening to the port ${port} successfully`)
})