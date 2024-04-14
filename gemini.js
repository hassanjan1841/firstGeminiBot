import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import express from "express";
import cors from "cors"; // Import the cors middleware
import MarkdownIt from "markdown-it"; // Import markdown-it package

const app = express();
const port = 3000;
dotenv.config();

const gemini_api_key = process.env.GEN_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

const markdown = new MarkdownIt(); // Initialize markdown-it

const generateContent = async (prompt) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return markdown.render(response.text()); // Convert response to Markdown
  } catch (error) {
    console.log("response error", error);
    return "Error generating content";
  }
};

// Use the cors middleware to allow cross-origin requests
app.use(cors());

app.get("/generate", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Hello Gemini"; // Get prompt from query parameter or use a default prompt
    const content = await generateContent(prompt);
    res.send(content); // Send the content as JSON
  } catch (error) {
    res.status(500).json({ error: "Error generating content" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
