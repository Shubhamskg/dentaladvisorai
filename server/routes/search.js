import { Router } from "express";
import dotnet from 'dotenv'

dotnet.config()
let router = Router()

import axios from 'axios'

const API_KEY = 'YOUR_GOOGLE_CSE_API_KEY';
const SEARCH_ENGINE_ID = '70e0cf3be414142b4';

router.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        const response = await axios.get(`https://www.googleapis.com/customsearch/v1?key=<span class="math-inline">\{API\_KEY\}&cx\=</span>{SEARCH_ENGINE_ID}&q=${query}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Error fetching search results' });
    }
});

module.exports = router;
