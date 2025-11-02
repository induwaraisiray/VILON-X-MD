const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "📂",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
    try {
        // Count total commands
        const totalCommands = Object.keys(commands).length;

        const menuCaption = `👋 𝐇𝐄𝐋𝐋𝐎, ${pushname}!

*✨ 𝗪ELCOME TO VILON-X-MD ✨*
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *𝚁𝚄𝙽𝚃𝙸𝙼𝙴* : ${runtime(process.uptime())}
│◈ *𝙾𝚆𝙽𝙴𝚁 𝙽𝙰𝙼𝙴* : Isira induwara </>
│◈ *𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁* : 94751474995
│◈ *𝙿𝚁𝙴𝙵𝙸𝚇* : .
│◈ *𝚅𝙴𝚁𝙸𝚂𝙾𝙽* : 𝟷.𝟶.𝟶
╰──────────●●►

╭──◯
┆ *_⭓ BOT MENU ITEMS_*
┆ ⭔1️⃣ *Main menu*
┆ ⭔2️⃣ *Ai menu*
┆ ⭔3️⃣ *Convert menu*
┆ ⭔4️⃣ *Download menu*
┆ ⭔5️⃣ *Search menu*
┆ ⭔6️⃣ *Group menu*
┆ ⭔7️⃣ *Owner menu*
┆ ⭔8️⃣ *Tools menu*
┆ ⭔9️⃣ *News menu*
┆ ⭔🔟 *fun menu*
╰──◯

> *• © ᴩᴏᴡᴇʀᴅ ʙʏ ᴠɪʟᴏɴ-x ᴍᴅ •*`;

const contextInfo = {
    mentionedJid: [m.sender],
    forwardingScore: 999,
    isForwarded: true
};

// Function to send the main menu image
const sendMenuImage = async () => {
    try {
        return await conn.sendMessage(
            from,
            {
                image: { url: 'https://files.catbox.moe/wwufnr.jpg' },
                caption: menuCaption,
                contextInfo: contextInfo
            },
            { quoted: mek }
        );
    } catch (e) {
        console.log('Image send failed, falling back to text');
        return await conn.sendMessage(
            from,
            { text: menuCaption, contextInfo: contextInfo },
            { quoted: mek }
        );
    }
};

// Try sending menu image with timeout
let sentMsg;
try {
    sentMsg = await Promise.race([
        sendMenuImage(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
    ]);
} catch (e) {
    console.log('Menu send error:', e);
    sentMsg = await conn.sendMessage(
        from,
        { text: menuCaption, contextInfo: contextInfo },
        { quoted: mek }
    );
}

const messageID = sentMsg.key.id;

        // Menu data (Trimmed sample - you can keep all your sections)
        const menuData = {
            '1': {
                title: "🎀 *Main Menu*",
                content: `
🎀 Ξ MAIN COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *alive*
│ヤ Use : .alive — Check if bot is online
╰──────────●●►
╭──────────●●►
│ヤ Command : *ping*
│ヤ Use : .ping — Check bot speed
╰──────────●●►
╭──────────●●►
│ヤ Command : *system*
│ヤ Use : .system — Bot system info
╰──────────●●►
╭──────────●●►
│ヤ Command : *owner*
│ヤ Use : .owner — Owner details
╰──────────●●►
╭──────────●●►
│ヤ Command : *runtime*
│ヤ Use : .runtime — Show bot uptime
╰──────────●●►
╭──────────●●►
│ヤ Command : *time*
│ヤ Use : .time — Show SL date & time
╰──────────●●►
╭──────────●●►
│ヤ Command : *about*
│ヤ Use : .about — Bot info
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '2': {
                title: "*🤖 Ai Menu*",
                content: `🤖 Ξ AI COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *ai*
│ヤ Use : .ai — Chat with Asta AI
╰──────────●●►
╭──────────●●►
│ヤ Command : *openai*
│ヤ Use : .openai — Chat with OpenAI GPT
╰──────────●●►
╭──────────●●►
│ヤ Command : *deepseek*
│ヤ Use : .deepseek — Chat with DeepSeek AI
╰──────────●●►
╭──────────●●►
│ヤ Command : *chat*
│ヤ Use : .chat — Chat with Gemini AI
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '3': {
                title: "🎧 *Convert Menu*",
                content: `🎧 Ξ CONVERT COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *tts*
│ヤ Use : .tts — Text to Speech
╰──────────●●►
╭──────────●●►
│ヤ Command : *readmore*
│ヤ Use : .readmore — Add Read More
╰──────────●●►
╭──────────●●►
│ヤ Command : *translate*
│ヤ Use : .translate — Translate text
╰──────────●●►
╭──────────●●►
│ヤ Command : *gitclone*
│ヤ Use : .gitclone — GitHub ZIP Download
╰──────────●●►
╭──────────●●►
│ヤ Command : *npm1*
│ヤ Use : .npm1 — Search npm packages
╰──────────●●►
╭──────────●●►
│ヤ Command : *ss*
│ヤ Use : .ss — Website Screenshot
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '4': {
                title: "📥 *Download Menu*",
                content: `📥 Ξ DOWNLOAD COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *facebook*
│ヤ Use : .facebook — Download FB Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *tiktok*
│ヤ Use : .tiktok — Download TikTok Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *ytpost*
│ヤ Use : .ytpost — Download YouTube Posts
╰──────────●●►
╭──────────●●►
│ヤ Command : *apk*
│ヤ Use : .apk — Download APK Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *gdrive*
│ヤ Use : .gdrive — Download Google Drive Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *gitclone*
│ヤ Use : .gitclone — Download GitHub Repo
╰──────────●●►
╭──────────●●►
│ヤ Command : *mediafire*
│ヤ Use : .mediafire — Download MediaFire Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *image*
│ヤ Use : .image — Download Images
╰──────────●●►
╭──────────●●►
│ヤ Command : *song*
│ヤ Use : .song — Download YouTube Songs
╰──────────●●►
╭──────────●●►
│ヤ Command : *video*
│ヤ Use : .video — Download YouTube Videos
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '5': {
                title: "🔍 *Search Menu*",
                content: `🔍 Ξ SEARCH COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *yts / ytsearch*
│ヤ Use : .yts — Search YouTube Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *define*
│ヤ Use : .define — Find word definitions
╰──────────●●►
╭──────────●●►
│ヤ Command : *npm / npm1*
│ヤ Use : .npm — Search npm Packages
╰──────────●●►
╭──────────●●►
│ヤ Command : *srepo*
│ヤ Use : .srepo — Search GitHub Repos
╰──────────●●►
╭──────────●●►
│ヤ Command : *xstalk*
│ヤ Use : .xstalk — Search Twitter/X User Info
╰──────────●●►
╭──────────●●►
│ヤ Command : *tiktokstalk*
│ヤ Use : .tiktokstalk — Search TikTok User Info
╰──────────●●►
╭──────────●●►
│ヤ Command : *lyrics*
│ヤ Use : .lyrics — Find song lyrics
╰──────────●●►
╭──────────●●►
│ヤ Command : *movie / imdb*
│ヤ Use : .movie — Search movie info
╰──────────●●►
╭──────────●●►
│ヤ Command : *weather*
│ヤ Use : .weather — Get weather updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *news*
│ヤ Use : .news — Get latest news
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '6': {
                title: "👥 *Group Menu*",
                content: `👥 Ξ GROUP COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *requests*
│ヤ Use : .requests — Show join requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *accept*
│ヤ Use : .accept — Accept requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *reject*
│ヤ Use : .reject — Reject requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *hidetag*
│ヤ Use : .hidetag — Tag all members
╰──────────●●►
╭──────────●●►
│ヤ Command : *promote*
│ヤ Use : .promote — Make admin
╰──────────●●►
╭──────────●●►
│ヤ Command : *demote*
│ヤ Use : .demote — Remove admin
╰──────────●●►
╭──────────●●►
│ヤ Command : *kick*
│ヤ Use : .kick — Remove member
╰──────────●●►
╭──────────●●►
│ヤ Command : *mute*
│ヤ Use : .mute — Mute group
╰──────────●●►
╭──────────●●►
│ヤ Command : *unmute*
│ヤ Use : .unmute — Unmute group
╰──────────●●►
╭──────────●●►
│ヤ Command : *join*
│ヤ Use : .join — Join via link
╰──────────●●►
╭──────────●●►
│ヤ Command : *del*
│ヤ Use : .del — Delete message
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '7': {
                title: "👑 *Owner Menu*",
                content: `👑 Ξ OWNER COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *vv / vv2*
│ヤ Use : .vv — Retrieve view-once media
╰──────────●●►
╭──────────●●►
│ヤ Command : *getpp*
│ヤ Use : .getpp — Get user profile picture
╰──────────●●►
╭──────────●●►
│ヤ Command : *setpp*
│ヤ Use : .setpp — Change bot profile picture
╰──────────●●►
╭──────────●●►
│ヤ Command : *broadcast*
│ヤ Use : .broadcast — Send msg to all groups
╰──────────●●►
╭──────────●●►
│ヤ Command : *shutdown*
│ヤ Use : .shutdown — Shutdown bot
╰──────────●●►
╭──────────●●►
│ヤ Command : *restart*
│ヤ Use : .restart — Restart bot
╰──────────●●►
╭──────────●●►
│ヤ Command : *clearchats*
│ヤ Use : .clearchats — Clear all chats
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '8': {
                title: "🧰 *Tools Menu*",
                content: `🧰 Ξ TOOLS & UTILITY COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *jid*
│ヤ Use : .jid — Get chat/user JID
╰──────────●●►
╭──────────●●►
│ヤ Command : *svtext*
│ヤ Use : .svtext — Save text as URL
╰──────────●●►
╭──────────●●►
│ヤ Command : *send*
│ヤ Use : .send — Forward quoted message
╰──────────●●►
╭──────────●●►
│ヤ Command : *trsi*
│ヤ Use : .trsi — English ➜ Sinhala
╰──────────●●►
╭──────────●●►
│ヤ Command : *tren*
│ヤ Use : .tren — Sinhala ➜ English
╰──────────●●►
╭──────────●●►
│ヤ Command : *tts*
│ヤ Use : .tts — Sinhala Text ➜ Voice
╰──────────●●►
╭──────────●●►
│ヤ Command : *tempmail*
│ヤ Use : .tempmail — Generate temp mail
╰──────────●●►
╭──────────●●►
│ヤ Command : *checkmail*
│ヤ Use : .checkmail <id> — View mail inbox
╰──────────●●►
╭──────────●●►
│ヤ Command : *countryinfo*
│ヤ Use : .countryinfo <name> — Get country info
╰──────────●●►
╭──────────●●►
│ヤ Command : *logo*
│ヤ Use : .logo <name> — Get logo imge
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '9': {
                title: "📰 *News Menu*",
                content: `📰 Ξ NEWS COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *newson*
│ヤ Use : .newson — Enable auto news updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *newsoff*
│ヤ Use : .newsoff — Disable auto news updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *alerton*
│ヤ Use : .alerton — Enable breaking news alerts
╰──────────●●►
╭──────────●●►
│ヤ Command : *alertoff*
│ヤ Use : .alertoff — Disable breaking news alerts
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
             },
            '10': {
                title: "🤣 *fun Menu*",
                content: `🤣 Ξ FUN COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *hack*
│ヤ Use     : .hack — dynamic emoji edit (hack)
╰──────────●●►
╭──────────●●►
│ヤ Command : *happy*
│ヤ Use     : .happy — dynamic emoji edit (smile)
╰──────────●●►
╭──────────●●►
│ヤ Command : *heart*
│ヤ Use     : .heart — dynamic heart emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *angry*
│ヤ Use     : .angry — dynamic angry emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *sad*
│ヤ Use     : .sad — dynamic sad emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *shy*
│ヤ Use     : .shy — shy/blush emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *moon*
│ヤ Use     : .moon — moon phases animation
╰──────────●●►
╭──────────●●►
│ヤ Command : *confused*
│ヤ Use     : .confused — confused emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *hot*
│ヤ Use     : .hot — flirty/hot emoji edit
╰──────────●●►
╭──────────●●►
│ヤ Command : *nikal*
│ヤ Use     : .nikal — ASCII art / darkzone messages
╰──────────●●►
╭──────────●●►
│ヤ Command : *animegirl*
│ヤ Use     : .animegirl — fetch random anime girl image
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
                
            }

        };

        // Message handler for menu replies
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu =
                    receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (isReplyToMenu) {
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
                                        image: { url: 'https://files.catbox.moe/wwufnr.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });
                        } catch (e) {
                            console.log('Menu reply error:', e);
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }
                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1–9.\n\n*Example:* Reply with "1" for Main Menu\n\n> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        // Add message listener
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
                { text: `❌ Menu system is busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError);
        }
    }
});
