const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// === Constants ===
const API_BASE_URL = "https://sadiya-tech-apis.vercel.app/download/ytdl";
const API_KEY = "dinesh-api-key";

// ===============================
// 🔹 SONG COMMAND (Direct Download)
// ===============================
cmd({
    pattern: "song",
    alias: ["yta", "play"],
    react: "🎶",
    desc: "Download YouTube song",
    category: "main",
    use: ".song < Yt url or Name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a YouTube URL or Song name!*");

        // 🔹 1. Search YouTube
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length === 0) return reply("No results found!");

        const yts = yt.results[0];

        // 🔹 2. Construct API URL
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp3&apikey=${API_KEY}`;

        // 🔹 3. Fetch API Data
        const res = await fetch(apiUrl);
        const apiData = await res.json();

        if (!apiData.status) {
            console.error("API Error:", apiData);
            return reply(`API Error: ${apiData.err || "Unknown error"}`);
        }

        const downloadUrl = apiData.result?.download || apiData.result?.audio || apiData.download;
        const thumbnail = apiData.result?.thumbnail || yts.thumbnail;

        if (!downloadUrl) return reply("Failed to fetch download URL.");

        // 🔹 4. Build message
        const ytmsg = `╔═══〔 *𓆩QUEEN-SADU𓆪* 〕═══❒
║╭───────────────◆  
║│ *QUEEN-SADU-MD DOWNLOADING*
║╰───────────────◆
╚══════════════════❒
╔══════════════════❒
║ ⿻ *Title:* ${yts.title}
║ ⿻ *Duration:* ${yts.timestamp}
║ ⿻ *Views:* ${yts.views}
║ ⿻ *Author:* ${yts.author.name}
║ ⿻ *Link:* ${yts.url}
╚══════════════════❒
*Powered by © Mr Dinesh*`;

        // 🔹 5. Send image + info
        await conn.sendMessage(from, { image: { url: thumbnail }, caption: ytmsg }, { quoted: mek });

        // 🔹 6. Send as audio
        await conn.sendMessage(from, { audio: { url: downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });

        // 🔹 7. Send as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${yts.title}.mp3`,
            caption: `> *© Powered by Mr Dinesh 🎐*`
        }, { quoted: mek });

    } catch (e) {
        console.error("MP3 Error:", e);
        reply("An error occurred during audio download. Please try again later.");
    }
});

// ==========================================
// 🔹 SONG1 COMMAND (Interactive Format Choice)
// ==========================================
cmd({
    pattern: "song1",
    react: "🎶",
    desc: "Download YouTube song with format choice",
    category: "main",
    use: ".song1 < Yt url or Name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a YouTube URL or Song name!*");

        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length === 0) return reply("No results found!");

        const yts = yt.results[0];
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp3&apikey=${API_KEY}`;
        const res = await fetch(apiUrl);
        const apiData = await res.json();

        if (!apiData.status) {
            console.error("API Error:", apiData);
            return reply(`API Error: ${apiData.err || "Unknown error"}`);
        }

        const downloadUrl = apiData.result?.download || apiData.result?.audio || apiData.download;
        if (!downloadUrl) return reply("Failed to fetch download URL.");

        const ytmsg = `*VILON-X-MD SONG DOWNLOADER ✨️*

┃ 🎶 *Title:* ${yts.title}
┃ ⏳ *Duration:* ${yts.timestamp}
┃ 👀 *Views:* ${yts.views}
┃ 👤 *Author:* ${yts.author.name}
┃ 🔗 *Link:* ${yts.url}

*Choose download format:*

1 || . 📄 MP3 as Document
2 || . 🎧 MP3 as Audio
3 || . 🎙️ MP3 as Voice Note

_Reply with 1, 2 or 3 to this message to download your format._

> *© Powered by VILON-X-MD*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363395674230271@newsletter',
                newsletterName: 'isira induwara',
                serverMessageId: 143
            }
        };

        const sentMsg = await conn.sendMessage(
            from,
            { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo },
            { quoted: mek }
        );

        // 🔹 Wait for reply from user
        conn.ev.on("messages.upsert", async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages[0];
                if (!msg.message?.extendedTextMessage) return;

                const selected = msg.message.extendedTextMessage.text.trim();
                const ctx = msg.message.extendedTextMessage.contextInfo;
                if (!ctx || ctx.stanzaId !== sentMsg.key.id) return;

                await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

                switch (selected) {
                    case "1":
                        await conn.sendMessage(from, {
                            document: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${yts.title}.mp3`,
                            caption: `> *🎶 Your song is ready!*`,
                            contextInfo
                        }, { quoted: msg });
                        break;

                    case "2":
                        await conn.sendMessage(from, {
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            contextInfo
                        }, { quoted: msg });
                        break;

                    case "3":
                        await conn.sendMessage(from, {
                            audio: { url: downloadUrl },
                            mimetype: "audio/mpeg",
                            ptt: true,
                            contextInfo
                        }, { quoted: msg });
                        break;

                    default:
                        await conn.sendMessage(from, { text: "*❌ Invalid selection! Please reply 1, 2, or 3.*" }, { quoted: msg });
                        break;
                }
            } catch (err) {
                console.error("Reply Error:", err);
            }
        });

    } catch (e) {
        console.error("Song1 Error:", e);
        reply("An error occurred. Please try again later.");
    }
});                        
