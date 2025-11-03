const { cmd } = require('../command');
const axios = require("axios");

// === GEMINI API CONFIG ===
const GEMINI_API_KEY = 'AIzaSyC8pSIvRTtYS-ZghDZWWPUY360gEFB37hM'; 
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// === CHATBOT STATUS ===
let chatbotEnabled = false;

// ==================================================
// 🔹 CHATBOT CONTROL COMMAND (ON / OFF / STATUS)
// ==================================================
cmd({
  pattern: "chatbot",
  desc: "Turn chatbot on, off, or check status",
  react: "🤖",
  category: "ai",
  use: ".chatbot on / off / status",
  filename: __filename
}, async (conn, mek, m, { reply, args }) => {
  const option = (args[0] || "").toLowerCase();

  // Turn ON chatbot
  if (option === "on") {
    chatbotEnabled = true;
    reply("✅ *Chatbot Activated!* Now I’ll reply to every message automatically 🤖✨");
    return;
  }

  // Turn OFF chatbot
  if (option === "off") {
    chatbotEnabled = false;
    reply("🛑 *Chatbot Deactivated!* I’ll stop auto replying.");
    return;
  }

  // Show chatbot status
  if (option === "status") {
    const status = chatbotEnabled ? "🟢 *ON*" : "🔴 *OFF*";
    reply(`🤖 *Chatbot Status:* ${status}`);
    return;
  }

  // Invalid option
  reply("⚙️ Usage: `.chatbot on` | `.chatbot off` | `.chatbot status`");
});

// ==================================================
// 🔹 AUTO CHATBOT MESSAGE HANDLER
// ==================================================
cmd({
  on: "message"
}, async (conn, mek, m, { reply, body, sender, pushname }) => {
  try {
    // If chatbot is disabled → ignore
    if (!chatbotEnabled) return;

    // Ignore commands (start with .)
    if (!body || body.startsWith(".")) return;

    // === Gemini Prompt ===
    const prompt = `
    My name is ${pushname}.
    Your name is VILON-X-MD AI.
    You are a smart and friendly WhatsApp assistant created by Induwara.
    Reply in the same language I use, naturally like a human, and include meaningful emojis.
    My message: ${body}
    `;

    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) return;

    await reply(aiResponse);

  } catch (error) {
    console.error("🤖 Chatbot Error:", error.response?.data || error.message);
  }
});    
