const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const ddownr = require('denethdev-ytmp3');
const { resizeImage } = require('../lib/functions');

// 🎥 Helper: Extract YouTube Video ID
function extractYouTubeId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\\?v=|embed\\/|v\\/|shorts\\/)|youtu\\.be\\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// 🧩 Helper: Normalize query or link
function convertYouTubeLink(input) {
  const videoId = extractYouTubeId(input);
  return videoId ? `https://www.youtube.com/watch?v=${videoId}` : input;
}

/*───────────────────────────────*
 🎧 SONG COMMAND (MP3 DOWNLOAD)
*───────────────────────────────*/
cmd({
  pattern: "song",
  alias: ["ytsong"],
  use: ".song <query or url>",
  react: '🎧',
  desc: "Download songs from YouTube (MP3)",
  category: "Download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return await reply("*Please enter a YouTube title or URL!*");

    // Step 1: Searching...
    const progressMsg = await reply("🔎 *Searching your song...*");
    const cleanQuery = convertYouTubeLink(q.trim());
    const search = await yts(cleanQuery);
    const video = search.videos[0];
    if (!video) return await reply("❌ *No results found!*");

    const caption = `
🎶 *VILON-X SONG DOWNLOADER* 🎶

┌────────────────────┐
│ 🎵 *Title:* ${video.title}
│ 👁️ *Views:* ${video.views}
│ ⏱️ *Duration:* ${video.timestamp}
│ 📅 *Published:* ${video.ago}
│ 🔗 *URL:* ${video.url}
└────────────────────┘
`;

    // Step 2: Show video info
    await conn.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: m });
    await conn.sendMessage(from, { react: { text: '⬇️', key: m.key } });
    await conn.sendMessage(from, { edit: progressMsg.key, text: "🎧 *Downloading audio... please wait...*" });

    // Step 3: Download audio
    const result = await ddownr.download(video.url, 'mp3');
    const audioUrl = result.downloadUrl;
    if (!audioUrl) return await reply("*⚠️ Failed to get audio link!*");

    // Step 4: Upload audio
    await conn.sendMessage(from, { edit: progressMsg.key, text: "⬆️ *Uploading audio...*" });
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      ptt: false
    }, { quoted: m });

    // Step 5: Send as file
    const thumbResponse = await fetch(video.thumbnail);
    const thumbBuffer = await thumbResponse.buffer();
    const resizedThumb = await resizeImage(thumbBuffer, 200, 200);

    await conn.sendMessage(from, {
      document: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
      jpegThumbnail: resizedThumb,
      caption: `✨ *${yts.title}* ✨\n> 🎶 *Powered By VILON-X-MD*`
    }, { quoted: m });

    // Done
    await conn.sendMessage(from, { edit: progressMsg.key, text: "✅ *Song download complete!*" });
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await reply("❌ *Error: Could not process your request.*");
  }
});


/*───────────────────────────────*
 📽️ VIDEO COMMAND (MP4 DOWNLOAD)
*───────────────────────────────*/
cmd({
  pattern: "video",
  alias: ["ytvideo"],
  use: ".video <query or url>",
  react: '📽️',
  desc: "Download videos from YouTube (MP4)",
  category: "Download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return await reply("*Please enter a YouTube title or URL!*");

    // Step 1: Searching...
    const progressMsg = await reply("🔎 *Searching your video...*");
    const cleanQuery = convertYouTubeLink(q.trim());
    const search = await yts(cleanQuery);
    const video = search.videos[0];
    if (!video) return await reply("❌ *No results found!*");

    const caption = `
🎬 *VILON-X VIDEO DOWNLOADER* 🎬

┌────────────────────┐
│ 🎞️ *Title:* ${video.title}
│ 👁️ *Views:* ${video.views}
│ ⏱️ *Duration:* ${video.timestamp}
│ 📅 *Published:* ${video.ago}
│ 🔗 *URL:* ${video.url}
└────────────────────┘
`;

    // Step 2: Show video info
    await conn.sendMessage(from, { image: { url: video.thumbnail }, caption }, { quoted: m });
    await conn.sendMessage(from, { react: { text: '⬇️', key: m.key } });
    await conn.sendMessage(from, { edit: progressMsg.key, text: "🎥 *Downloading video... please wait...*" });

    // Step 3: Download MP4
    const result = await ddownr.download(video.url, 'mp4');
    const videoUrl = result.downloadUrl;
    if (!videoUrl) return await reply("*⚠️ Failed to get video link!*");

    // Step 4: Upload video
    await conn.sendMessage(from, { edit: progressMsg.key, text: "⬆️ *Uploading video...*" });
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `🎥 *${video.title}*\n\n${config.FOOTER || ''}`,
      mimetype: "video/mp4"
    }, { quoted: m });

    // Step 5: Send as file
    const thumbResponse = await fetch(video.thumbnail);
    const thumbBuffer = await thumbResponse.buffer();
    const resizedThumb = await resizeImage(thumbBuffer, 200, 200);

    await conn.sendMessage(from, {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${video.title}.mp4`,
      jpegThumbnail: resizedThumb,
      caption: `✨ *${yts.title}* ✨\n> 🎬 *Powered By VILON-X-MD*`
    }, { quoted: m });

    // Done
    await conn.sendMessage(from, { edit: progressMsg.key, text: "✅ *Video download complete!*" });
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await reply("❌ *Error: Could not process your request.*");
  }
});            
