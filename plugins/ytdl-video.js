const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["mp4", "song"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query or URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a video name or YouTube URL!");

        let videoUrl, title;

        // ===============================
        // Detect if input = YouTube URL
        // ===============================
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(q)) {

            // Extract video ID safely
            let id;
            if (q.includes("v=")) {
                id = q.split("v=")[1].split("&")[0];
            } else {
                id = q.split("/").pop();
            }

            const info = await yts({ videoId: id });
            if (!info || !info.title) return reply("❌ Invalid YouTube URL!");

            videoUrl = `https://youtu.be/${id}`;
            title = info.title;

        } else {

            // ===============================
            // YouTube Search Mode
            // ===============================
            const search = await yts(q);
            if (!search.videos.length) return reply("❌ No results found!");

            const vid = search.videos[0];
            videoUrl = vid.url;
            title = vid.title;
        }

        await reply("⏳ *Downloading your video... Please wait!*");

        // ===============================
        // Call API (Updated to your format)
        // ===============================
        const apiUrl = `https://apis.sandarux.sbs/api/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        // Check response properly
        if (!json.status || !json.downloadURL) {
            return reply("❌ API Error: Unable to fetch download link!");
        }

        const downloadLink = json.downloadURL;

        // ===============================
        // SEND VIDEO
        // ===============================
        await conn.sendMessage(
            from,
            {
                video: { url: downloadLink },
                mimetype: "video/mp4",
                caption: `🎬 *${title}*`
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error(error);
        reply("❌ Error: " + error.message);
    }
});
