const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ai",
    alias: ["vilonx", "vxai", "ai"],
    desc: "Chat with VILON-X-MD AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*කරුණාකර ඔබේ ප්‍රශ්නය type කරන්න.* \nඋදාහරණ: `.ai Hello`");
        }

        const personaInstruction = `ඔබේ නම VILON-X-MD AI. ඔබ මිත්‍රශීලී, super-smart සහ මිනිස් කතාබස් style එකෙන් කතා කරන AI සර්වර් එකකි. ඔබ පරිශීලකයාට හොඳම යාළුවෙක් වගේ කතා කරන්න. Emoji භාවිතා කරන්න. යමෙක් ඔබ කවුදැයි ඇහුවොත්, "මම VILON-X-MD AI, ඔයාගේ smart helper! 🤖🔥" කියන්න. තවත් කිසිම AI එකක් වගේ behave නොවන්න. පහත පණිවිඩයට පිළිතුරු දෙන්න: `;

        const fullQuery = personaInstruction + q;

        const apiUrl = `https://sadiya-tech-apis.vercel.app/ai/gemini?q=${encodeURIComponent(fullQuery)}&apikey=dinesh-api-key`;

        const { data } = await axios.get(apiUrl);

        let aiResponse = '';

        if (typeof data === 'string') aiResponse = data;
        else if (data.result) aiResponse = data.result;
        else if (data.response) aiResponse = data.response;
        else if (data.data) aiResponse = data.data;
        else if (data.message) aiResponse = data.message;
        else {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("VILON-X-MD AI ප්‍රතිචාර ලබා දීමට නොහැකි විය.");
        }

        await reply(`🤖 *VILON-X-MD AI:* \n\n${aiResponse}`);
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("VILON-X-MD AI Error:", e.response?.data || e.message);
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
        reply("VILON-X-MD AI සමඟ සන්නිවේදනයේ දෝෂයක් ඇතිවියා.");
    }
});

cmd({
    pattern: "openai",
    alias: ["chatgpt", "gpt3", "open-gpt"],
    desc: "Chat with OpenAI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for OpenAI.\nExample: `.openai Hello`");

        const apiUrl = `https://vapis.my.id/api/openai?q=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
            await react("❌");
            return reply("OpenAI failed to respond. Please try again later.");
        }

        await reply(`🧠 *OpenAI Response:*\n\n${data.result}`);
        await react("✅");
    } catch (e) {
        console.error("Error in OpenAI command:", e);
        await react("❌");
        reply("An error occurred while communicating with OpenAI.");
    }
});

cmd({
    pattern: "deepseek",
    alias: ["deep", "seekai"],
    desc: "Chat with DeepSeek AI",
    category: "ai",
    react: "🧠",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a message for DeepSeek AI.\nExample: `.deepseek Hello`");

        const apiUrl = `https://api.ryzendesu.vip/api/ai/deepseek?text=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.answer) {
            await react("❌");
            return reply("DeepSeek AI failed to respond. Please try again later.");
        }

        await reply(`🧠 *DeepSeek AI Response:*\n\n${data.answer}`);
        await react("✅");
    } catch (e) {
        console.error("Error in DeepSeek AI command:", e);
        await react("❌");
        reply("An error occurred while communicating with DeepSeek AI.");
    }
});


      
