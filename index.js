const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config()
const fs = require('fs-extra');
const app = express()
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('doctors'))
app.use(fileUpload())

const port = 4000




const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xjikz.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
    const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
    const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews"); 
    const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admins");
   
    //add services info
    app.post('/addServices', (req, res) => {

        const file = req.files.file;
        const title = req.body.serviceName;
        const description = req.body.description;
        const newImg = file.data;
        const encImg = newImg.toString('base64');
        console.log(title, description, file)

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        serviceCollection.insertOne({ title, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })

       
    })

    // get services
    app.get('/getServices', (req, res) => {
        serviceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //add Order info
    app.post('/addOrder', (req, res) => {

        const file = req.files.file;
        const name = req.body.name;
        const email = req.body.email;
        const serviceName = req.body.serviceName;
        const projectDetails = req.body.projectDetails;
        const price = req.body.price;


        const newImg = file.data;
        const encImg = newImg.toString('base64');
        console.log(name, email, serviceName, projectDetails, price, file)

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        orderCollection.insertOne({ name, email, serviceName, projectDetails, price, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })


    })

    // get order
    app.get('/getOrder', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //add reviews addReview
    app.post('/addReview', (req, res) => {
        const data = req.body;
        console.log(data)
        reviewCollection.insertOne(data)
        .then(result => {
            if (result){
                res.send(result)
            }
        })
      
    })

    // get review
    app.get('/getReview', (req, res) => {
        reviewCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    }); 

    // get getAllServiceStatus
    app.get('/getAllServiceStatus', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    //make admin
    app.post('/makeAdmin', (req, res) => {
        const adminData = req.body;
        console.log(adminData)
        adminCollection.insertOne(adminData)
            .then(result => {
                if (result) {
                    res.send(result)
                }
            })
    })
    //isAdmin
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        console.log(email)
        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0 );
            })
    })


    console.log("Database Connected Succefully.")
    // client.close();
});


app.get('/', (req, res) => {
    res.send('Server is working...')
})

app.listen(process.env.PORT || port)