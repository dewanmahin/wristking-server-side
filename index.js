const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cxwlf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run () {
    try{
        await client.connect();
        const database = client.db('wristKing');
        const productsCollection = database.collection("products");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");
        const usersCollection = database.collection("users");

        // // POST PACKAGE API
        app.post('/addProduct', async (req, res) => {
            addProduct = req.body;
            const result = await productsCollection.insertOne(addProduct);
            res.json(result);
        })

        // // GET PRODUCTS API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        // // POST ORDER API
        app.post('/orders', async (req, res) => {
            orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result)
        })

        // // GET ALL ORDER API
        app.get('/allOrders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })

        // // GET MY ORDER API
        app.get('/allOrders/:userEmail', async(req, res) => {
            const email = req.params.userEmail;
            const query = {userEmail:email}
            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray();
            res.json(result);
        })

        // // DELETE ORDER API 
        app.delete('/allOrders/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

        // // DELETE ORDER API 
        app.delete('/products/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        })

        // // POST REVIEW API
        app.post('/reviews', async (req, res) => {
            review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        })

        // // GET REVIEW API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const allReviews = await cursor.toArray();
            res.send(allReviews);
        })

        // // POST USER API
        app.post('/users', async(req, res) => {
            user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // PUT USER ADMIN API
        app.put('/users/admin', async(req, res) => {
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })

        // // GET USER API
        app.get('/users/:email', async(req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role == 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin});
        })


    }finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("wristKing server is running")
})

app.listen(port, () => {
    console.log('Server running at port', port);
})