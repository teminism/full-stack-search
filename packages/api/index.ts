import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import { MongoClient } from "mongodb";

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
  await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors())
app.use(express.json());

const connectToDb = async () => {
  const mongoClient = new MongoClient(DATABASE_URL);
  await mongoClient.connect();
  return mongoClient;
};

app.get('/hotels', async (req, res) => {
  const { query } = req.query;
  const mongoClient = await connectToDb();
  try {
    const db = mongoClient.db();
    const collection = db.collection('hotels');
    const hotels = await collection.find({
      $or: [
        { chain_name: { $regex: query, $options: 'i' } },
        { hotel_name: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } }
      ]
    }).toArray();
    res.send(hotels);
  } finally {
    await mongoClient.close();
  }
});

app.get('/cities', async (req, res) => {
  const { query } = req.query;
  const mongoClient = await connectToDb();
  try {
    const db = mongoClient.db();
    const collection = db.collection('cities');
    const cities = await collection.find({ name: { $regex: query, $options: 'i' } }).toArray();
    res.send(cities);
  } finally {
    await mongoClient.close();
  }
});

app.get('/countries', async (req, res) => {
  const { query } = req.query;
  const mongoClient = await connectToDb();
  try {
    const db = mongoClient.db();
    const collection = db.collection('countries');
    const countries = await collection.find({ country: { $regex: query, $options: 'i' } }).toArray();
    res.send(countries);
  } finally {
    await mongoClient.close();
  }
});

app.listen(PORT, () => {
  console.log(`API Server Started at ${PORT}`)
});