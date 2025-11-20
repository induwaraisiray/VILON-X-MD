const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// NEW API
const API_BASE_URL = "https://sadaslk-apis.vercel.app/api/v1/download/youtube";
const API_KEY = "b85be247e99f8f416a17764b67ee3f02";

// =================================================================
// 🎥 YOUTUBE MP4 DOWNLOAD COMMAND (UPDATED + VILON-X-MD STYLE)
// =================================================================

cmd({
    pattern: "yt",
    alias: ["video", "ytv"],
    react: "🎥",
    desc: "Download YouTube video",
    category: "main",
    use: ".mp4 < YouTube URL or Name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {

    try {

        if (!q) return reply("*❗ Please provide a YouTube URL or Video name.*");

        // 1. Search YouTube
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length === 0)
            return reply("❌ No results found!");

        const video = yt.results[0];

        // 2. Build API URL
        const apiUrl = `${API_BASE_URL}?q=${encodeURIComponent(video.url)}&format=360&apiKey=${API_KEY}`;

        // 3. Fetch data
        const res = await fetch(apiUrl);
        const api = await res.json();

        if (!api.status) {
            console.log(api);
            return reply(`❌ API Error: ${api.message || "Unknown error"}`);
        }

        // 4. Extract real API fields
        const downloadUrl = api.data?.download;
        const thumbnail = api.data?.thumbnail || video.thumbnail;
        const title = api.data?.title || video.title;
        const duration = api.data?.duration || video.timestamp;

        if (!downloadUrl) {
            console.log(api);
            return reply("❌ Failed to fetch download link from API!");
        }

        // ==========================
        // 🎨 BEAUTIFUL VILON-X-MD CAPTION
        // ==========================
        const captionText = `*🎬 VILON-X-MD — Video Downloader*

🔰 *Title:* ${title}
⏱️ *Duration:* ${duration}
👁️ *Views:* ${video.views}
👤 *Uploader:* ${video.author.name}
🔗 *URL:* ${video.url}

> ${config.DESCRIPTION}
`;

        // 6. Send thumbnail + caption
        await conn.sendMessage(
            from,
            { image: { url: thumbnail }, caption: captionText },
            { quoted: mek }
        );

        // 7. Send video file
        await conn.sendMessage(
            from,
            {
                video: { url: downloadUrl },
                mimetype: "video/mp4",
                caption: `*🎬 ${title}*\n> 🔥 Powered by *VILON-X-MD*`
            },
            { quoted: mek }
        );

        // 8. Extra Document format
        await conn.sendMessage(
            from,
            {
                document: { url: downloadUrl },
                mimetype: "video/mp4",
                fileName: `${title}.mp4`,
                caption: `*🎬 ${title}*\n> 🔥 Powered by *VILON-X-MD*`
            },
            { quoted: mek }
        );

    } catch (err) {
        console.error("MP4 Error:", err);
        return reply("⚠️ Error downloading video. Please try again.");
    }
});
