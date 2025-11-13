const { cmd } = require('../command');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
const config = require('../config');
const { runtime } = require('../lib/functions');
const moment = require('moment-timezone');
const pkg = require("../package.json");

// ================= Helper Functions =================
function formatUptime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs}h ${mins}m ${secs}s`;
}

function getMemoryUsage() {
  const used = process.memoryUsage();
  return {
    heap: (used.heapUsed / 1024 / 1024).toFixed(2),
    rss: (used.rss / 1024 / 1024).toFixed(2),
    total: (os.totalmem() / 1024 / 1024).toFixed(0),
    free: (os.freemem() / 1024 / 1024).toFixed(2)
  };
}

function getTotalUsers() {
  try {
    return global.db && global.db.users
      ? Object.keys(global.db.users).length
      : 0;
  } catch {
    return 0;
  }
}

// ================= PING Command =================
cmd({
  pattern: "ping",
  alias: ["speed", "pong"],
  desc: "Check bot's response time.",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const startTime = Date.now();
    const msg = await conn.sendMessage(from, { text: '*𝙿𝙸𝙽𝙶𝙸𝙽𝙶...*' });
    const endTime = Date.now();
    const ping = endTime - startTime;

    await conn.sendMessage(from, {
      text: `*⚡ Pong : ${ping}ms*`
    }, { quoted: msg });

  } catch (e) {
    console.error("Ping Command Error:", e);
    reply(`❌ ${e.message}`);
  }
});

// ================= SYSTEM INFO Command =================
cmd({
  pattern: "system",
  alias: ["status", "botinfo"],
  desc: "Check bot runtime, system usage and version",
  category: "main",
  react: "🤖",
  filename: __filename
}, async (conn, mek, m, { reply, from }) => {
  try {
    const mem = getMemoryUsage();
    const uptime = formatUptime(process.uptime());
    const platform = `${os.type()} ${os.arch()} (${os.platform()})`;
    const hostname = os.hostname();
    const cpuLoad = os.loadavg()[0] ? os.loadavg()[0].toFixed(2) : "N/A";
    const totalUsers = getTotalUsers();

    let status = `*╭━━━[ 🤖 BOT SYSTEM INFO ]━━━╮*
*┃* ⏳ Uptime      : ${uptime}
*┃* 🧠 RAM Usage   : ${mem.rss} MB / ${mem.total} MB
*┃* 💻 CPU Load    : ${cpuLoad}%
*┃* 🖥 Platform    : ${platform}
*┃* 🏷 Hostname    : ${hostname}
*┃* 🔋 Status      : Online 24/7
*┃* 🆚 Version     : ${pkg.version}
*┃* 👤 Owner       : Isira Induwara
*╰━━━━━━━━━━━━━━━━━━━━━━╯*

*📊 Extra Info*
*• CPU Cores     : ${os.cpus().length}*
*• Free Memory   : ${mem.free} MB*
*• Total Users   : ${totalUsers}*
*• Node Version  : ${process.version}*
> ${config.DESCRIPTION}
`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/wwufnr.jpg" }, // <-- replace with your image URL
      caption: status
    }, { quoted: mek });

  } catch (e) {
    console.error("System Command Error:", e);
    reply(`⚠️ Error: ${e.message}`);
  }
});

// ================= OWNER Command =================
cmd({
  pattern: "owner",
  desc: "Show owner contact info.",
  category: "main",
  react: "👤",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const caption = `👤 *Owner Info*
• Name   : Induwara
• Number : +94 77 225 7877
• Role   : Bot Developer

• Name   : Induwara 
• Number : +94 75 147 4995
• Role   : Bot Developer

• Name   : Induwara 
• Number : +94 74 054 4995
• Role   : Bot Developer

> ${config.DESCRIPTION}`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/wwufnr.jpg" }, // <-- replace with your image URL
      caption
    }, { quoted: mek });

  } catch (e) {
    console.error("Owner Command Error:", e);
  }
});

// ================= RUNTIME Command =================
cmd({
  pattern: "runtime",
  desc: "Show bot uptime only.",
  category: "main",
  react: "⏳",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const text = `⏱ Bot Uptime: *${formatUptime(process.uptime())}*`;
    await conn.sendMessage(from, { text }, { quoted: mek });
  } catch (e) {
    console.error("Runtime Command Error:", e);
  }
});

// ================= TIME Command =================
cmd({
  pattern: "time",
  desc: "Show current SL date & time.",
  category: "main",
  react: "🕒",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const currentTime = moment().tz("Asia/Colombo");
    const date = currentTime.format("dddd, D MMMM YYYY");
    const time = currentTime.format("hh:mm:ss A");
    const msg = `📅 Today is *${date}*\n⏰ Current Time: *${time}*`;

    await conn.sendMessage(from, { text: msg }, { quoted: mek });
  } catch (e) {
    console.error("Time Command Error:", e);
  }
});

// ================= ABOUT Command =================
cmd({
  pattern: "about",
  desc: "Show bot information.",
  category: "main",
  react: "ℹ️",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const caption = `🤖 *Bot Info*
• Name       : Vilon-X-MD
• Version    : ${pkg.version}
• Owner      : Isira Induwara
• Framework  : Node.js ${process.version}
• Platform   : ${os.type()} ${os.arch()}
• Library    : Baileys WhatsApp API

> ${config.DESCRIPTION}`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/wwufnr.jpg" },
      caption
    }, { quoted: mek });
  } catch (e) {
    console.error("About Command Error:", e);
  }
});

