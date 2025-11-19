const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const axios = require('axios');

// Your API Info
const API_KEY = "4365b40cd50c5c54ba11de356350e0190c46d7f6c2ecb0a6a4f08a3eeebe8479";
const API_BASE_URL = "https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api";
const ENDPOINT = "/ytapi";

// MP4 VIDEO DOWNLOAD
cmd({
    pattern: "mp4",
    alias: ["video2"],
    react: "🎥",
    desc: "Download YouTube video",
    category: "main",
    use: ".mp4 <youtube url or name>",
    filename: __filename
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => {

    try {
        if (!q) return reply("❗ Please provide a YouTube URL or search text.");

        // Search
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length < 1) {
            return reply("❗ No results found.");
        }

        let video = yt.results[0];

        // Call your Koyeb API
        const response = await axios.get(`${API_BASE_URL}${ENDPOINT}`, {
            params: {
                url: video.url,
                fo: "1",
                qu: "720"
            },
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        const result = response.data;

        if (!result.downloadData?.url) {
            return reply("❗ Failed to fetch download link.");
        }

        // Download message
        let msg = `📹 *YouTube Video Downloader*
🎬 *Title:* ${video.title}
⏳ *Duration:* ${video.timestamp}
👁 *Views:* ${video.views}
👤 *Channel:* ${video.author.name}
🔗 *Link:* ${video.url}

> 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐈𝐒𝐈𝐑𝐀 𝐈𝐍𝐃𝐔𝐖𝐀𝐑𝐀 🇱🇰🔥`;

        // Send Video
        await conn.sendMessage(
            from,
            {
                video: { url: result.downloadData.url },
                caption: msg,
                mimetype: "video/mp4"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.log(err);
        reply("❌ Error downloading video. Try again later.");
    }
});
