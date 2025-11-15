const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 

// Define constants for the new API
const API_BASE_URL = "https://sadiya-tech-apis.vercel.app/download/ytdl";
const API_KEY = "dinesh-api-key";

cmd({
  pattern: "song",
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

    if (!apiData.status) return reply(`API Error: ${apiData.err || "Unknown error"}`);

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

> ${config.DESCRIPTION}`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: yts.thumbnail },
      caption: ytmsg
    }, { quoted: mek });

    // ✅ Wait for user's next message
    const filter = (msg) =>
      msg.key.remoteJid === from &&
      msg.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

    const timeout = 30000; // 30 sec timeout

    const listener = async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!filter(msg)) return;

      const selected = msg.message.extendedTextMessage.text.trim();
      await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

      switch (selected) {
        case "1":
          await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${yts.title}.mp3`,
            caption: `> *🎶 Your song is ready!*`
          }, { quoted: msg });
          break;

        case "2":
          await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
          }, { quoted: msg });
          break;

        case "3":
          await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            ptt: true
          }, { quoted: msg });
          break;

        default:
          await conn.sendMessage(from, { text: "*❌ Invalid selection!*" }, { quoted: msg });
          break;
      }

      conn.ev.off("messages.upsert", listener); // 🔹 stop listener after first valid reply
    };

    conn.ev.on("messages.upsert", listener);

    // 🔹 optional timeout auto-stop
    setTimeout(() => conn.ev.off("messages.upsert", listener), timeout);

  } catch (e) {
    console.error("Song1 Error:", e);
    reply("An error occurred. Please try again later.");
  }
});
