const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 
const fetch = require('node-fetch');

const API_BASE_URL = "https://ytdl.sandarux.sbs/api/download";
const API_KEY = "darknero";

// ======================= YouTube MP4 Downloader =======================
cmd({
    pattern: "mp4",
    alias: ["video", "ytv"],
    react: "🎥",
    desc: "Download YouTube video",
    category: "main",
    use: ".mp4 <YouTube URL or Name>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ *Please provide a YouTube URL or Video name!*");

        // YouTube search
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length === 0) return reply("❌ No results found!");

        let yts = yt.results[0];
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp4&quality=360&apikey=${API_KEY}`;

        let response = await fetch(apiUrl);
        let apiData = await response.json();

        // Extract download URL safely
        const extractedData = apiData.data || apiData.result || apiData;
        const downloadUrl = extractedData.download_url || extractedData.url;
        const thumbnail = extractedData.thumbnail || yts.thumbnail || "";

        if (!downloadUrl) {
            console.error("MP4 API Error:", apiData);
            return reply("❌ Failed to fetch the video. Please try again later.");
        }

        // Video info message
        let ytmsg = `
╭───❖ *🎬 VIDEO Downloader*────❖
│
│ 🎵 *Title:* ${yts.title}
│ ⏱️ *Duration:* ${yts.timestamp}
│ 👁️ *Views:* ${yts.views}
│ 👤 *Channel:* ${yts.author.name}
│ 🔗 *Link:* ${yts.url}
│ 📥 *_Auto downloading..._*
╰───────────────────────❖
> *🎫 Powered By © VILON-X-MD *
`;

        // Send thumbnail + info
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: ytmsg
        }, { quoted: mek });

        // Send video as video
        await conn.sendMessage(from, {
            video: { url: downloadUrl },
            mimetype: "video/mp4",
            caption: `✨ *${yts.title}* ✨\n> 🎬 *Powered By VILON-X-MD*`
        }, { quoted: mek });

        // Send video as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "video/mp4",
            fileName: `${yts.title}.mp4`,
            caption: `🎥 *${yts.title}*\n> © *VILON-X-MD*`
        }, { quoted: mek });

    } catch (e) {
        console.error("MP4 Error:", e);
        reply("⚠️ *An error occurred while downloading the video. Try again later!*");
    }
});

// =================================================================
// 🎶 Command: YouTube MP3 / Audio Downloader
// =================================================================
cmd({
    pattern: "song",
    alias: ["yta", "play"],
    react: "🎶",
    desc: "Download YouTube song",
    category: "main",
    use: ".song < Yt URL or Name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("🎧 *Please provide a YouTube URL or Song name!*");

        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ No results found!");

        let yts = yt.results[0];
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp3&apikey=${API_KEY}`;

        let response = await fetch(apiUrl);
        let apiData = await response.json();

        const extractedData = apiData.data || apiData.result || apiData;
        const downloadUrl = extractedData.downloadUrl || extractedData.url;
        const thumbnail = extractedData.thumbnail || extractedData.image || yts.thumbnail || "";

        if (!downloadUrl) {
            console.error("API Response Error (MP3):", apiData);
            return reply("❌ Failed to fetch the audio. Please try again later.");
        }

        // 💎 Stylish Audio Info Message
        let ytmsg = `
╭───❖ *🎵 SONG Downloader*────❖
│
│ 🎶 *Title:* ${yts.title}
│ ⏱️ *Duration:* ${yts.timestamp}
│ 👁️ *Views:* ${yts.views}
│ 👤 *Channel:* ${yts.author.name}
│ 🔗 *Link:* ${yts.url}
│ 📥 *_Auto downloding..._*
╰───────────────────────────❖
> *🎫 Powered By © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*
`;

        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption: ytmsg
        }, { quoted: mek });

        await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
        }, { quoted: mek });

        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${yts.title}.mp3`,
            caption: `🎵 *${yts.title}*\n> 🎧 *Powered By VILON-X-MD*`
        }, { quoted: mek });

    } catch (e) {
        console.error("MP3 Error:", e);
        reply("⚠️ *An error occurred while downloading audio. Try again later!*");
    }
});                
