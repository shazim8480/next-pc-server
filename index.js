// api/products.js
require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://crudUser:shazim8480@cluster0.raiw9.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(req, res) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    console.log("connection established!");

    const db = client.db("pcBuilder");
    const pcCollection = db.collection("pcProducts");

    // get all products
    app.get("/api/products", async (req, res) => {
      try {
        const cursor = pcCollection.find({});
        const products = await cursor.toArray();

        res.json({ status: true, data: products });
      } catch (error) {
        console.error("Error fetching products:", error.message);
        res
          .status(500)
          .json({ status: false, error: "Failed to fetch products" });
      }
    });

    // get book by id
    app.get("/api/products/:id", async (req, res) => {
      const id = req.params.id;
      const objectId = new ObjectId(id);

      const result = await pcCollection.findOne({ _id: objectId });

      console.log(result);
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to next pc builder!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
