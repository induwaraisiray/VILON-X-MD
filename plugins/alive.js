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

    const caption = `👋 𝐇𝐄𝐋𝐋𝐎, ${pushname}!

*✨ 𝗪ELCOME TO VILON-X-MD ✨*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *𝚁𝚄𝙽𝚃𝙸𝙼𝙴* : ${runtime(process.uptime())}
│◈ *𝙾𝚆𝙽𝙴𝚁 𝙽𝙰𝙼𝙴* : Isira induwara </>
│◈ *𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁* : 94751474995
│◈ *𝙿𝚁𝙴𝙵𝙸𝚇* : .
│◈ *𝚅𝙴𝚁𝙸𝚂𝙾𝙽* : 𝟷.𝟶.𝟶
╰──────────●●►
*⚡ BOT REPO* https://github.com/induwaraisiray/VILON-X-MD/
*⚡ WHATSAPP CHANNEL* https://whatsapp.com/channel/0029Vb6FspM6RGJNsF4Sfs31

*_1⃣ BOT SPEED_*
*_2⃣ BOT MENU_*

> ${config.DESCRIPTION}`;

    const contextInfo = {
      mentionedJid: [m.sender],
      forwardingScore: 999,
      isForwarded: true
    };

    // Try sending image
    let sentMsg;
    try {
      sentMsg = await conn.sendMessage(from, {
        image:  { url: config.MENU_IMAGE_URL },
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
        content: `.menu`,
        image: false
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
              image: { url: config.MENU_IMAGE_URL },
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
