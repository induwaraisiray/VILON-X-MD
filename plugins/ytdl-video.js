const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');

cmd({
    pattern: "video",
    alias: ["mp4", "song"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query or url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a video name or YouTube URL!");

        let videoUrl, title;

        // ===============================
        //  CHECK IF INPUT IS YOUTUBE URL
        // ===============================
        if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(q)) {

            // Extract video ID safely
            const id = q.split("v=")[1]?.split("&")[0] || q.split("/").pop();

            if (!id) return reply("❌ Invalid YouTube URL!");

            const search = await yts({ videoId: id });
            if (!search || !search.title) return reply("❌ Unable to fetch video details!");

            title = search.title;
            videoUrl = `https://youtu.be/${id}`;

        } else {
            // ===============================
            //     NORMAL SEARCH MODE
            // ===============================
            const search = await yts(q);
            if (!search.videos.length) return reply("❌ No results found!");

            const vid = search.videos[0];
            videoUrl = vid.url;
            title = vid.title;
        }

        await reply("*⏳ Downloading your video... Please wait!*");

        // ===============================
        //       API CALL (FIXED)
        // ===============================
        const apiUrl = `https://apis.sandarux.sbs/api/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (!json.status) {
            return reply("❌ Failed to download video. Try another link.");
        }

        const videoLink = json.result.url;

        // ===============================
        //        SEND VIDEO (WORKING)
        // ===============================
        await conn.sendMessage(from, {
            video: { url: videoLink },
            mimetype: "video/mp4",
            caption: `🎬 *${title}*\n\nDownloaded Successfully ✔️`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        await reply("❌ Error: " + error.message);
    }
});
