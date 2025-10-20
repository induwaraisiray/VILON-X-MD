const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');
const { fetchJson, resizeImage } = require('../lib/functions');
const ddownr = require('denethdev-ytmp3');

// ✅ YouTube URL Extractor (fixed regex)
function extractYouTubeId(url) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// ✅ Convert input (query or link) to YouTube URL if needed
function convertYouTubeLink(input) {
  const videoId = extractYouTubeId(input);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return input;
}

// =================================================================
// 🎵 SONG DOWNLOADER COMMAND (.song2)
// =================================================================
cmd({
  pattern: "song2",
  alias: ["ytsong2"],
  use: ".song2 <query or url>",
  react: '🎧',
  desc: "Download songs from YouTube",
  category: "Download",
  filename: __filename
}, async (conn, m, store, { from, prefix, q, reply }) => {
  try {
    if (!q) {
      return await reply("*Please enter a query or YouTube URL!*");
    }

    const cleanQuery = q.replace(/\?si=[^&]*/, '');
    const fixedQuery = convertYouTubeLink(cleanQuery);
    const searchResult = await yts(fixedQuery);
    const video = searchResult.videos[0];

    if (!video) {
      return await reply("❌ *No video found for your search!*");
    }

    const caption = `
🎶 *VISPER SONG DOWNLOADER* 🎶

┌────────────────────┐
│ 🎵 *Title:* ${video.title}
│ 👁️ *Views:* ${video.views}
│ ⏱️ *Duration:* ${video.timestamp}
│ 🔗 *URL:* ${video.url}
└────────────────────┘
`;

    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption
    });

    const apiUrl = `https://sadas-ytmp3-5.vercel.app/convert?link=${video.url}`;
    const result = await fetchJson(apiUrl);
    const audioUrl = result?.url;

    if (!audioUrl) {
      return await reply("*⚠️ Failed to get audio download link.*");
    }

    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg"
    }, { quoted: m });

    const thumbResponse = await fetch(video.thumbnail);
    const thumbBuffer = await thumbResponse.buffer();
    const resizedThumb = await resizeImage(thumbBuffer, 200, 200);

    await conn.sendMessage(from, {
      document: { url: audioUrl },
      jpegThumbnail: resizedThumb,
      caption: config.FOOTER,
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await reply("❌ *Error: Could not process the request.*");
  }
});

// =================================================================
// 🎬 VIDEO DOWNLOADER COMMAND (.video2)
// =================================================================
cmd({
  pattern: "video2",
  alias: ["ytvideo2"],
  use: ".video2 <query or url>",
  react: '📽️',
  desc: "Download YouTube videos (MP4)",
  category: "Download",
  filename: __filename
}, async (conn, m, store, { from, prefix, q, reply }) => {
  try {
    if (!q) {
      return await reply("*Please enter a YouTube link or search query!*");
    }

    const cleanQuery = q.replace(/\?si=[^&]*/, '');
    const fixedQuery = convertYouTubeLink(cleanQuery);
    const search = await yts(fixedQuery);
    const data = search.videos[0];

    if (!data) {
      return await reply("❌ *No video found!*");
    }

    const desc = `
🎬 *VISPER VIDEO DOWNLOADER*

◆ 🎞️ *Title:* ${data.title}
◆ ⏱️ *Duration:* ${data.timestamp}
◆ 👁️ *Views:* ${data.views}
◆ 📅 *Uploaded:* ${data.ago}
◆ 🔗 *URL:* ${data.url}
`;

    await conn.sendMessage(from, {
      image: { url: data.thumbnail },
      caption: desc,
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: '⬇️', key: m.key } });

    // 🎞️ Use ddownr to get video download link
    const result = await ddownr.download(data.url, 'mp4');
    const videoUrl = result.downloadUrl;

    if (!videoUrl) {
      return await reply("⚠️ *Failed to get video download link!*");
    }

    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      caption: `🎬 ${data.title}`,
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await reply("❌ *Error: Could not process your request.*");
  }
});      
