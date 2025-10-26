const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
  pattern: "animeimg",
  alias: ["animeimage", "animeporn"],
  use: ".animeimg",
  react: "🎴",
  desc: "Send 10 random anime images from API with captions",
  category: "anime",
  filename: __filename
}, async (m, { conn }) => {
  try {
    const apiUrl = "https://apis.sandarux.sbs/api/animeporn/random";
    const imageCount = 10; // send 10 images

    await conn.sendMessage(m.from, { text: `🔄 Sending ${imageCount} random anime images...\nPlease wait...` }, { quoted: m });

    for (let i = 0; i < imageCount; i++) {
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      if (data && data.url) {
        const caption = `🖼️ Anime Image ${i + 1}/${imageCount}\n\n⚡ Powered by VILON-X-MD`;
        await conn.sendMessage(
          m.from,
          { image: { url: data.url }, caption },
          { quoted: m }
        );
      } else {
        await conn.sendMessage(m.from, { text: `⚠️ Failed to load image ${i + 1}` }, { quoted: m });
      }

      // small delay between sends (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await conn.sendMessage(m.from, { text: "✅ Done! All images sent successfully." }, { quoted: m });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.from, { text: `❌ Error: ${err.message}` }, { quoted: m });
  }
});

cmd({
  pattern: "animevideo",
  alias: ["animevid", "animepornvid"],
  use: ".animevideo",
  react: "🎥",
  desc: "Fetch anime videos with menu selection",
  category: "anime",
  filename: __filename
}, async (m, { conn }) => {
  try {
    const apiUrl = "https://apis.sandarux.sbs/api/animeporn/video";

    await conn.sendMessage(m.from, { text: "*🎬 Fetching anime videos...\nPlease wait...*" }, { quoted: m });

    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    let videos = [];
    if (Array.isArray(data)) {
      videos = data.slice(0, 5);
    } else if (data.video_1) {
      // Single object fallback
      videos = Array(5).fill(data);
    } else {
      throw new Error("Invalid API response format.");
    }

    // Menu text
    let menuText = "🎞️ *Anime Video Menu*\n\n";
    videos.forEach((vid, i) => {
      menuText += `*${i + 1}.* ${vid.title || "Untitled"}\n`;
    });
    menuText += `\n🕹️ Reply with a *number (1–5)* to download that video.\n⚡ Powered by VILON-X-MD`;

    await conn.sendMessage(m.from, { text: menuText }, { quoted: m });

    // Wait for user reply
    conn.once("chat-update", async (chatUpdate) => {
      try {
        if (!chatUpdate.messages) return;
        const msg = chatUpdate.messages.all()[0];
        if (!msg.message || msg.key.fromMe) return;

        const number = parseInt(msg.message.conversation.trim());
        if (isNaN(number) || number < 1 || number > videos.length) {
          await conn.sendMessage(m.from, { text: "⚠️ Please reply with a valid number between 1 and 5." }, { quoted: msg });
          return;
        }

        const vid = videos[number - 1];
        const caption = `🎞️ *${vid.title || "Unknown Title"}*\n\n` +
          `📁 *Category:* ${vid.category || "N/A"}\n` +
          `👁️ *Views:* ${vid.views_count || "N/A"}\n` +
          `🔁 *Shares:* ${vid.share_count || "N/A"}\n` +
          `📹 *Type:* ${vid.type || "N/A"}\n` +
          `🔗 *Source:* ${vid.link || "N/A"}\n\n` +
          `> ⚡ *Powered by Induwara MD*`;

        await conn.sendMessage(
          m.from,
          {
            video: { url: vid.video_1 },
            caption: caption
          },
          { quoted: msg }
        );

      } catch (err) {
        console.error(err);
        await conn.sendMessage(m.from, { text: `❌ Error while sending video: ${err.message}` });
      }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(m.from, { text: `❌ Error: ${err.message}` }, { quoted: m });
  }
});
