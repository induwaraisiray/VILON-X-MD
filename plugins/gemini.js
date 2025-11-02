const { cmd } = require('../command');
const axios = require("axios");

// API CONFIG
const GEMINI_API_KEY = 'AIzaSyC8pSIvRTtYS-ZghDZWWPUY360gEFB37hM';  // Replace
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// 🧠 Session store
let geminiSessions = {}; 

cmd({
  pattern: "chat",
  react: '🤖',
  desc: "Talk with Google Gemini AI.",
  category: "ai",
  use: ".chat <Your Question>",
  filename: __filename
}, async (conn, mek, m, { reply, args, pushname, sender }) => {
  try {
    const text = args.join(" ");
    if (!text) {
      return reply("❗ Please give me a question.");
    }

    // 🧠 Create new session
    geminiSessions[sender] = true;  

    const prompt = `My name is ${pushname}. Your name is VILON-X-MD AI. You are a WhatsApp AI bot created by Induwara. Answer in the same language I'm using. Answer naturally, like a human, not a bot. Add meaningful emojis. My question is: ${text}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await axios.post(GEMINI_API_URL, payload, { headers: { "Content-Type": "application/json" } });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) return reply("❌ No response from AI 😢");

    await reply(aiResponse);

  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    reply("❌ Error talking to AI.");
  }
});


// 📌 Auto reply to session messages
cmd({
  on: "message"   // catch all messages
}, async (conn, mek, m, { reply, body, sender, pushname }) => {
  try {
    if (!geminiSessions[sender]) return; // Only reply if session is active
    if (body.startsWith(".")) return;    // Avoid commands

    const prompt = `My name is ${pushname}. Your name is Rasindu AI. You are a WhatsApp AI bot created by Rasindu(රසිදු). Answer in the same language I'm using. Answer naturally, like a human, not a bot. Add meaningful emojis. My message is: ${body}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    const response = await axios.post(GEMINI_API_URL, payload, { headers: { "Content-Type": "application/json" } });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) return;

    await reply(aiResponse);

  } catch (error) {
    console.error("Gemini Auto Reply Error:", error.response?.data || error.message);
  }
});
