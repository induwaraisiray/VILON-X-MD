
const config = require('../config');
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');
const axios = require("axios");
const fs = require("fs");


cmd({
  pattern: 'aiimg',
  react: '🧩',
  desc: 'Generate an image using Flux',
  category: 'image',
  filename: __filename
}, async (conn, mek, m, {
  body,
  from,
  quoted,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    const text = body.trim().replace(command, '').trim();
    if (!text) {
      return reply(`*Usage:* ${command} <prompt>\n\n*Example:* ${command} cat`);
    }

    await reply('> *📷 Processing Image...*');

    const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;

    await conn.sendMessage(m.chat, { image: { url: apiUrl }, caption: `🎨 *Flux Image Generator*\n\n📄 *Prompt:* ${text}\n\n> *POWERD BY VILON-X-MD*` }, { quoted: m });
  } catch (error) {
    console.error('Error in Flux command:', error);
    reply(`*AN ERROR OCCURRED!! MESSAGE :*\n\n> ${error.message}`);
  }
});

cmd({
  pattern: "imagine",
  alias: ["aiimg6", "metaimg"],
  react: "✨",
  desc: "Generate an image using AI.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("Please provide a prompt for the image.");

    await reply("> *Brewing Up Magic...✨*");

    const apiUrl = `https://api.siputzx.my.id/api/ai/flux?prompt=${encodeURIComponent(q)}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    if (!response || !response.data) {
      return reply("Error: The API did not return a valid image. Try again later.");
    }

    const imageBuffer = Buffer.from(response.data, "binary");

    await conn.sendMessage(m.chat, {
      image: imageBuffer,
      caption: `* 🤖 ᴘʀᴏᴍᴘᴛ : ${q}*\n\n> ${config.DESCRIPTION}*`
    });

  } catch (error) {
    console.error("FluxAI Error:", error);
    reply(`An error occurred: ${error.response?.data?.message || error.message || "Unknown error"}`);
  }
});

cmd({
  pattern: "img",
  alias: ["aiimg3", "bingimage"],
  desc: "Search for images using Bing and send 10 results.",
  category: "utility",
  use: ".img dog",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply("❌ Please provide a search query. Example: `.img dog`");

    // Fetch images from API
    const response = await axios.get(
      `https://apis.sandarux.sbs/api/tools/bing-search?query=${encodeURIComponent(query)}`
    );

    const { status, result } = response.data;

    // Validate
    if (!status || !result || result.length === 0) {
      return reply("❌ No images found for your query.");
    }

    // Take first 10 results
    const images = result.slice(0, 10);

    // Send one by one
    for (const imageUrl of images) {
      await conn.sendMessage(from, {
        image: { url: imageUrl },
        caption: `🔍 *Bing Image Search Result*\nQuery: _${query}_`,
      });
    }
  } catch (error) {
    console.error("Image Search Error:", error);
    reply("❌ Error: Unable to fetch images. Try again later.");
  }
});




cmd({
    pattern: "animegirl",
    desc: "Fetch a random anime girl image.",
    category: "fun",
    react: "👧",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const apiUrl = `https://api.waifu.pics/sfw/waifu`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        await conn.sendMessage(from, { image: { url: data.url }, caption: '👸 *RANDOM ANIME GIRL IMAGES*\n\n\*' }, { quoted: mek });
    } catch (e) {
        console.log(e);
        reply(`*Error Fetching Anime Girl image*: ${e.message}`);
    }
});
