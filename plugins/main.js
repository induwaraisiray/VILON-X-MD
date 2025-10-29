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
I’m *VILON-X-MD* ⚡

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

> *© Powered by VILON-X-MD*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        // Function to send menu image
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: 'https://files.catbox.moe/9l6abf.jpg' },
                        caption: menuCaption,
                        contextInfo
                    },
                    { quoted: mek }
                );
            } catch {
                // fallback to text
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Send menu with 10s timeout
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Image send timeout')), 10000)
                )
            ]);
        } catch {
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo },
                { quoted: mek }
            );
        }

        const messageID = sentMsg.key.id;

        const menuData = {
            '1': { title: "⚡ Bot speed", content: `⚡ Pong! ${ping}ms`, image: false },
            '2': { 
                title: "📂 Bot Menu", 
                content: `🎀 Ξ MAIN COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : alive — Check if bot is online
│ヤ Command : ping — Check bot speed
│ヤ Command : system — Show bot system info
│ヤ Command : owner — Show owner details
│ヤ Command : runtime — Display bot uptime
│ヤ Command : time — Show SL date & time
│ヤ Command : about — Display bot information
╰──────────●●►

🤖 Ξ AI COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : ai — Chat with Asta AI
│ヤ Command : openai — Chat with OpenAI GPT
│ヤ Command : deepseek — Chat with DeepSeek AI
│ヤ Command : chat — Chat with Gemini AI
╰──────────●●►

🎧 Ξ CONVERT COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : tts — Convert text to speech
│ヤ Command : readmore — Add read more effect
│ヤ Command : translate — Translate text
│ヤ Command : gitclone — Download GitHub repo as ZIP
│ヤ Command : npm1 — Search npm packages
│ヤ Command : ss — Take website screenshot
╰──────────●●►

📥 Ξ DOWNLOAD COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : facebook — Download Facebook videos
│ヤ Command : tiktok — Download TikTok videos
│ヤ Command : ytpost — Download YouTube posts
│ヤ Command : apk — Download APK files
│ヤ Command : gdrive — Download Google Drive files
│ヤ Command : gitclone — Download GitHub repository
│ヤ Command : mediafire — Download MediaFire files
│ヤ Command : image — Download random images
│ヤ Command : song — Download YouTube songs
│ヤ Command : video — Download YouTube videos
╰──────────●●►

🔍 Ξ SEARCH COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : yts / ytsearch — Search YouTube videos
│ヤ Command : define — Find word definitions
│ヤ Command : npm / npm1 — Search npm packages
│ヤ Command : srepo — Search GitHub repositories
│ヤ Command : xstalk — Get Twitter/X user info
│ヤ Command : tiktokstalk — Get TikTok user info
│ヤ Command : lyrics — Find song lyrics
│ヤ Command : movie / imdb — Search movie info
│ヤ Command : weather — Get weather updates
│ヤ Command : news — Get latest news
╰──────────●●►

👥 Ξ GROUP COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : requests — View join requests
│ヤ Command : accept — Accept join requests
│ヤ Command : reject — Reject join requests
│ヤ Command : hidetag — Tag all members
│ヤ Command : promote — Make member admin
│ヤ Command : demote — Remove admin role
│ヤ Command : kick — Remove member
│ヤ Command : mute — Mute group chat
│ヤ Command : unmute — Unmute group chat
│ヤ Command : join — Join via group link
│ヤ Command : del — Delete a message
╰──────────●●►

👑 Ξ OWNER COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : vv / vv2 — Retrieve view-once media
│ヤ Command : getpp — Get user profile picture
│ヤ Command : setpp — Change bot profile picture
│ヤ Command : broadcast — Send message to all groups
│ヤ Command : shutdown — Turn off bot
│ヤ Command : restart — Restart bot
│ヤ Command : clearchats — Clear all chats
╰──────────●●►

🧰 Ξ TOOLS & UTILITY COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : jid — Get chat/user JID
│ヤ Command : svtext — Save text as URL
│ヤ Command : send — Forward quoted message
│ヤ Command : trsi — Translate English ➜ Sinhala
│ヤ Command : tren — Translate Sinhala ➜ English
│ヤ Command : tts — Convert Sinhala text to voice
│ヤ Command : tempnum — Get temporary numbers
│ヤ Command : templist — View available countries
│ヤ Command : otpbox — Check OTP inbox
│ヤ Command : tempmail — Generate temporary email
│ヤ Command : checkmail — View temporary mail inbox
│ヤ Command : countryinfo — Get country details
╰──────────●●►

📰 Ξ NEWS COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : newson — Enable automatic news updates
│ヤ Command : newsoff — Disable automatic news updates
│ヤ Command : alerton — Enable breaking news alerts
│ヤ Command : alertoff — Disable breaking news alerts
╰──────────●●►

🤣 Ξ FUN COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : hack — Activate bot funny mode
│ヤ Command : happy — Dynamic happy emoji edit
│ヤ Command : heart — Dynamic heart emoji edit
│ヤ Command : angry — Dynamic angry emoji edit
│ヤ Command : sad — Dynamic sad emoji edit
│ヤ Command : shy — Shy/blush emoji edit
│ヤ Command : moon — Moon phases animation
│ヤ Command : confused — Confused emoji edit
│ヤ Command : hot — Flirty/hot emoji edit
│ヤ Command : nikal — ASCII art / darkzone message
│ヤ Command : animegirl — Random anime girl image
╰──────────●●►

> *Powered by: © VILON-X-MD*`,
                image: true 
            }
        };

        // Handler for menu replies
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu =
                    receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToMenu) return;

                const receivedText =
                    receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;

                if (menuData[receivedText]) {
                    const selectedMenu = menuData[receivedText];

                    try {
                        if (selectedMenu.image) {
                            await conn.sendMessage(
                                senderID,
                                {
                                    image: { url: 'https://files.catbox.moe/9l6abf.jpg' },
                                    caption: selectedMenu.content,
                                    contextInfo
                                },
                                { quoted: receivedMsg }
                            );
                        } else {
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo },
                                { quoted: receivedMsg }
                            );
                        }
                        await conn.sendMessage(senderID, {
                            react: { text: '✅', key: receivedMsg.key }
                        });
                    } catch {
                        await conn.sendMessage(
                            senderID,
                            { text: selectedMenu.content, contextInfo },
                            { quoted: receivedMsg }
                        );
                    }
                } else {
                    await conn.sendMessage(
                        senderID,
                        {
                            text: `❌ *Invalid Option!* ❌\nReply with "1" or "2".\n> *Powered by: © VILON-X-MD*`,
                            contextInfo
                        },
                        { quoted: receivedMsg }
                    );
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        conn.ev.on('messages.upsert', handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off('messages.upsert', handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system is busy. Please try later.\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
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
