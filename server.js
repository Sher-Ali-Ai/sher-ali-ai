const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config(); // .env فائل کو لوڈ کرنے کے لیے

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.OPENAI_API_KEY; // API کی کو .env سے حاصل کریں

app.use(express.json()); // JSON ڈیٹا کو قبول کرنے کے لیے
app.use(cors()); // CORS کو انیبل کریں

// 🌍 Default Route
app.get("/", (req, res) => {
    res.send("✅ Server is running successfully!");
});

// 🎯 AI API Response Function
async function getAIResponse(prompt) {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(url, 
            { contents: [{ parts: [{ text: prompt }] }] }, 
            { headers: { "Content-Type": "application/json" } }
        );

        return response.data.candidates[0]?.content || "⚠ No response from AI!";
    } catch (error) {
        console.error("❌ Error calling AI API:", error.response?.data || error.message);
        return "⚠ Error fetching AI response!";
    }
}

// 🧠 AI API Route
app.post("/api/ai", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required!" });
    }

    const aiResponse = await getAIResponse(prompt);
    res.json({ response: aiResponse });
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
