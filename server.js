import express from 'express';
import connectDB from './src/DB/index.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import OpenAI from "openai";

const app = express();
const Port = process.env.Port || 5000

import authRouter from './src/Routes/authRouter.js'

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin:[ 'http://localhost:5173', "https://lustrous-donut-e71291.netlify.app/dashboard"],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS' , 'PATCH'] ,
 allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

app.use("/auth" , authRouter)
const client = new OpenAI({
  apiKey: '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',
  baseURL: "https://openrouter.ai/api/v1", // 🔥 important
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-chat", // 🔥 DeepSeek via OpenRouter
      messages: [
        {
          role: "system",
          content: "You are EcoBot 🌱. Always share facts about the environment in replies.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});


connectDB().then(()=>
app.listen(Port , ()=>{
    console.log(`server is running ${Port} `)
})).catch((err)=>{
    console.log("server connection error",err)
})