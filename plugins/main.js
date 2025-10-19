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

cmd({
    pattern: "alive",
    desc: "Show interactive bot status",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const totalCommands = commands ? Object.keys(commands).length : 0;
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);

        const menuCaption = `👋 *Hey ${pushname || 'User'}!*  
Im *VILON-X-MD* ⚡

╭───〔 *BOT STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│
│🧠 *Owner:* 𝙸𝚜𝚒𝚛𝚊 𝙸𝚗𝚍𝚞𝚠𝚊𝚛𝚊
│⚡ *Version:* 1.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│⌛ *Uptime:* ${runtime(process.uptime())}
╰────────────────────◉

*_1⃣ BOT SPEED_*
*_2⃣ BOT MENU_*

> *©𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363388320701164@newsletter',
                newsletterName: 'VILON-X-MD',
                serverMessageId: 143
            }
        };

        // Send main alive message
        let sentMsg;
        try {
            sentMsg = await conn.sendMessage(
                from,
                {
                    image: { url: 'https://files.catbox.moe/9l6abf.jpg' },
                    caption: menuCaption,
                    contextInfo
                },
                { quoted: mek }
            );
        } catch {
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo },
                { quoted: mek }
            );
        }

        const messageID = sentMsg?.key?.id;
        if (!messageID) return;

        const ping = new Date().getTime() - mek.messageTimestamp * 1000;

        // Handler for reply menu
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages?.[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu =
                    receivedMsg.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToMenu) return;

                const receivedText =
                    receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;

                const senderID = receivedMsg.key.remoteJid;

                if (receivedText === '1') {
                    await conn.sendMessage(senderID, { text: `⚡ Pong! ${ping}ms`, contextInfo }, { quoted: receivedMsg });
                    await conn.sendMessage(senderID, { react: { text: '⚡', key: receivedMsg.key } });
                } 
                else if (receivedText === '2') {
                    // 🟢 Auto trigger .menu command
                    await conn.sendMessage(senderID, { react: { text: '📜', key: receivedMsg.key } });
                    const fakeMek = {
                        key: { remoteJid: senderID },
                        message: { conversation: `${config.PREFIX}menu` },
                        pushName: pushname || 'User'
                    };
                    conn.ev.emit("messages.upsert", { messages: [fakeMek], type: "notify" });
                } 
                else {
                    await conn.sendMessage(
                        senderID,
                        {
                            text: `❌ *Invalid Option!* ❌\n\nPlease reply with 1 or 2.\n\n> *© Powered by VILON-X-MD*`,
                            contextInfo
                        },
                        { quoted: receivedMsg }
                    );
                }
            } catch (e) {
                console.error('Handler error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);
        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (e) {
        console.error('Alive menu error:', e);
        await conn.sendMessage(
            from,
            {
                text: `❌ Menu system is currently busy. Please try again later.\n\n> ${config.DESCRIPTION}`
            },
            { quoted: mek }
        );
    }
});

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
*• Node Version  : ${process.version}*`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/9l6abf.jpg" }, // <-- replace with your image URL
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

• Name   : Isira
• Number : +94 75 147 4995
• Role   : Bot Developer

• Name   : Vil
• Number : +94 74 054 4995
• Role   : Bot Developer

> *© 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/9l6abf.jpg" }, // <-- replace with your image URL
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

> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`;

    await conn.sendMessage(from, {
      image: { url: "https://files.catbox.moe/0enyp3.jpg" },
      caption
    }, { quoted: mek });
  } catch (e) {
    console.error("About Command Error:", e);
  }
});

cmd({
    pattern: "setting",
    alias: ["setmenu", "configmenu"],
    desc: "Show bot settings menu",
    category: "menu",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { from, reply, isCreator }) => {
    if (!isCreator) return reply("*📛 Only the owner can use this menu!*");

    // Menu text
    const menuText = `
*🛠️ BOT SETTINGS MENU 🛠️*

1️⃣ Anti-Delete: ${config.ANTI_DELETE ? "✅ ON" : "❌ OFF"}
2️⃣ Auto-Read Messages: ${config.READ_MESSAGE ? "✅ ON" : "❌ OFF"}
3️⃣ Auto-React: ${config.AUTO_REACT ? "✅ ON" : "❌ OFF"}
4️⃣ Auto-Status Reply: ${config.AUTO_STATUS_REPLY ? "✅ ON" : "❌ OFF"}
5️⃣ Auto-View Status: ${config.AUTO_STATUS_SEEN ? "✅ ON" : "❌ OFF"}
6️⃣ Auto-Like Status: ${config.AUTO_STATUS_REACT ? "✅ ON" : "❌ OFF"}
7️⃣ Always Online: ${config.ALWAYS_ONLINE ? "✅ ON" : "❌ OFF"}
8️⃣ Bot Mode: ${config.MODE.toUpperCase()}
9️⃣ Command Prefix: ${config.PREFIX}

*📌 Usage Example:*
• To toggle ON: .<command> on
• To toggle OFF: .<command> off
• To check status: .<command> status

Type the corresponding command below to toggle or check status.

> *© 𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`;

    await reply(menuText);
});