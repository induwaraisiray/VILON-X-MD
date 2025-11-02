const config = require('../config');
const os = require('os');
const { cmd } = require('../command');

// === Helper Functions ===
const runtime = (seconds) => {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
};

const getPing = async (conn) => {
  const start = Date.now();
  await conn.sendPresenceUpdate('available');
  return Date.now() - start;
};

// === MAIN COMMAND ===
cmd({
  pattern: "alive",
  desc: "Show interactive bot status",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
  try {
    const ping = await getPing(conn);
    const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);

    const caption = `👋 *Hey ${pushname || 'User'}!*  
I’m *VILON-X-MD* ⚡

╭───〔 *BOT STATUS* 〕───◉
│✨ *Bot is Active & Online!*
│🧠 *Owner:* 𝙸𝚜𝚒𝚛𝚊 𝙸𝚗𝚍𝚞𝚠𝚊𝚛𝚊
│⚡ *Version:* 1.0.0
│📝 *Prefix:* [${config.PREFIX}]
│📳 *Mode:* [${config.MODE}]
│📡 *Ping:* ${ping} ms
│💾 *RAM:* ${usedRam}/${totalRam} MB
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

    // Try sending image
    let sentMsg;
    try {
      sentMsg = await conn.sendMessage(from, {
        image: { url: 'https://files.catbox.moe/wwufnr.jpg' },
        caption,
        contextInfo
      }, { quoted: mek });
    } catch {
      sentMsg = await conn.sendMessage(from, {
        text: caption,
        contextInfo
      }, { quoted: mek });
    }

    // Menu data
    const menuData = {
      '1': { title: "⚡ Bot speed", content: `⚡ Pong! ${ping}ms`, image: false },
      '2': {
        title: "📂 Full Bot Menu",
        content: `👋 *Hello ${pushname}!*
        
*✨ WELCOME TO VILON-X-MD ✨*
╭─「 COMMAND PANEL 」
│◈ *Runtime:* ${runtime(process.uptime())}
│◈ *Owner:* Isira Induwara
│◈ *Prefix:* ${config.PREFIX}
│◈ *Mode:* ${config.MODE}
│◈ *Version:* 1.0.0
╰──────────●●►

🎀 *Ξ MAIN COMMAND LIST: Ξ*
╭──────────●●►
│ヤ Command : alive — Check if bot is online
│ヤ Command : ping — Check bot speed
│ヤ Command : system — Show bot system info
│ヤ Command : owner — Show owner details
│ヤ Command : runtime — Display bot uptime
│ヤ Command : time — Show SL date & time
│ヤ Command : about — Display bot information
╰──────────●●►

🤖 *Ξ AI COMMAND LIST: Ξ*
╭──────────●●►
│ヤ Command : ai — Chat with Asta AI
│ヤ Command : openai — Chat with OpenAI GPT
│ヤ Command : deepseek — Chat with DeepSeek AI
│ヤ Command : chat — Chat with Gemini AI
╰──────────●●►

🎧 *Ξ CONVERT COMMAND LIST: Ξ*
╭──────────●●►
│ヤ Command : tts — Convert text to speech
│ヤ Command : readmore — Add read more effect
│ヤ Command : translate — Translate text
│ヤ Command : gitclone — Download GitHub repo as ZIP
│ヤ Command : npm1 — Search npm packages
│ヤ Command : ss — Take website screenshot
╰──────────●●►

📥 *Ξ DOWNLOAD COMMAND LIST: Ξ*
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

🔍 *Ξ SEARCH COMMAND LIST: Ξ*
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

👥 *Ξ GROUP COMMAND LIST: Ξ*
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

👑 *Ξ OWNER COMMAND LIST: Ξ*
╭──────────●●►
│ヤ Command : vv / vv2 — Retrieve view-once media
│ヤ Command : getpp — Get user profile picture
│ヤ Command : setpp — Change bot profile picture
│ヤ Command : broadcast — Send message to all groups
│ヤ Command : shutdown — Turn off bot
│ヤ Command : restart — Restart bot
│ヤ Command : clearchats — Clear all chats
╰──────────●●►

🧰 *Ξ TOOLS & UTILITY COMMAND LIST: Ξ*
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

📰 *Ξ NEWS COMMAND LIST: Ξ*
╭──────────●●►
│ヤ Command : newson — Enable automatic news updates
│ヤ Command : newsoff — Disable automatic news updates
│ヤ Command : alerton — Enable breaking news alerts
│ヤ Command : alertoff — Disable breaking news alerts
╰──────────●●►

🤣 *Ξ FUN COMMAND LIST: Ξ*
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

> *© Powered by VILON-X-MD*`,
        image: true
      }
    };

    // === Reply Handler ===
    const messageID = sentMsg.key.id;

    const handler = async (msgData) => {
      try {
        const received = msgData.messages[0];
        if (!received?.message || !received.key?.remoteJid) return;

        const replyToMenu =
          received.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

        if (!replyToMenu) return;

        const text =
          received.message.conversation ||
          received.message.extendedTextMessage?.text;
        const sender = received.key.remoteJid;

        if (menuData[text]) {
          const menu = menuData[text];
          if (menu.image) {
            await conn.sendMessage(sender, {
              image: { url: 'https://files.catbox.moe/wwufnr.jpg' },
              caption: menu.content,
              contextInfo
            }, { quoted: received });
          } else {
            await conn.sendMessage(sender, {
              text: menu.content,
              contextInfo
            }, { quoted: received });
          }
          await conn.sendMessage(sender, {
            react: { text: '✅', key: received.key }
          });
        } else {
          await conn.sendMessage(sender, {
            text: `❌ *Invalid Option!*\nReply with "1" or "2".`,
            contextInfo
          }, { quoted: received });
        }
      } catch (err) {
        console.log("Reply Handler Error:", err);
      }
    };

    conn.ev.on('messages.upsert', handler);
    setTimeout(() => conn.ev.off('messages.upsert', handler), 300000);

  } catch (err) {
    console.error('Alive Error:', err);
    await conn.sendMessage(from, {
      text: '❌ *Alive system busy.* Please try again later.'
    }, { quoted: mek });
  }
});
