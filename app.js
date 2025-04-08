import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { connectdb } from './database/database.js';
import City from './models/citySchema.js';

dotenv.config();
connectdb();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
    const { city } = req.query;
    const API_KEY = process.env.API_KEY;

    try {
        const response = await axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const newCity = new City({ name: city });
        await newCity.save();

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
