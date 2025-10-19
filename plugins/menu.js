const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "📄",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname, config, commands }) => { // Added pushname, config, commands
    
    // Fallback URL for the main menu image and sub-menus
    const MENU_IMG_URL = 'https://files.catbox.moe/9l6abf.jpg'; // Main menu image
    const SUBMENU_IMG_URL = 'https://files.catbox.moe/9l6abf.jpg'; // Sub-menu image (for consistency)
    
    try {
        // Count total commands (assuming 'commands' is the object containing them)
        const totalCommands = Object.keys(commands).length;
        
        // Ensure config.PREFIX is available
        const prefix = config?.PREFIX || '/';

        const menuCaption = `*╭━━━〔 Vɪʟᴏɴ-x-ᴍD 〕━━◯*
*│ ‍🚹 𝐔𝚜𝚎𝚛* : ${pushname || 'User'}
*│ 🔗 𝐁𝚊𝚕𝚒𝚢𝚊𝚛𝚜* : Multi Device
*│ 🧊❄️ 𝐓𝚢𝚙𝚎* : NodeJs
*│ 🖋️ 𝐏𝚛𝚎𝐟𝚒𝐱* : [${prefix}]
*│ 🆚 𝐕𝚎𝐫𝐬𝐢𝐨𝐧* : 1.0.0 Bᴇᴛᴀ 
*╰━━━━━━━━━━━━━━◯*
╭──◯
┆ *_⭓ BOT MEMU ITEMS_*
┆ ⭔1⃣ *Main menu*
┆ ⭔2⃣ *Ai menu*
┆ ⭔3️⃣ *Convert menu*
┆ ⭔4️⃣ *Downlod menu*
┆ ⭔5️⃣ *Search menu*
┆ ⭔6️⃣ *Group menu*
┆ ⭔7️⃣ *Owner menu*
┆ ⭔8️⃣ *Tools menu*
┆ ⭔9️⃣ *News menu*
╰──◯

> *• © ᴩᴏᴡᴇʀᴅ ʙʏ ᴠɪʟᴏɴ-x ᴍᴅ •*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterName: 'Isira Induwara', // Simplified this object
            }
        };

        // Function to send menu image with timeout
        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: MENU_IMG_URL },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, falling back to text:', e.message);
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        // Send image with timeout
        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error (possibly timeout):', e.message);
            // Fallback to text message if image fails/times out
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }
        
        // Ensure sentMsg and its key exist before accessing messageID
        const messageID = sentMsg?.key?.id;
        
        if (!messageID) {
             console.error('Could not get message ID, menu reply listener will not work.');
             return; // Stop execution if message ID isn't available
        }


        // Menu data (complete version)
        const menuData = {
            '1': {
                title: "🎀 *Main Menu*",
                content: `
🎀 Ξ MAIN COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *alive*
│ヤ Use : ${prefix}alive — Check if bot is online
╰──────────●●►
╭──────────●●►
│ヤ Command : *ping*
│ヤ Use : ${prefix}ping — Check bot speed
╰──────────●●►
╭──────────●●►
│ヤ Command : *system*
│ヤ Use : ${prefix}system — Bot system info
╰──────────●●►
╭──────────●●►
│ヤ Command : *owner*
│ヤ Use : ${prefix}owner — Owner details
╰──────────●●►
╭──────────●●►
│ヤ Command : *runtime*
│ヤ Use : ${prefix}runtime — Show bot uptime
╰──────────●●►
╭──────────●●►
│ヤ Command : *time*
│ヤ Use : ${prefix}time — Show SL date & time
╰──────────●●►
╭──────────●●►
│ヤ Command : *about*
│ヤ Use : ${prefix}about — Bot info
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '2': {
                title: "*🤖 Ai Menu*",
                content: `🤖 Ξ AI COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *ai*
│ヤ Use : ${prefix}ai — Chat with Asta AI
╰──────────●●►
╭──────────●●►
│ヤ Command : *openai*
│ヤ Use : ${prefix}openai — Chat with OpenAI GPT
╰──────────●●►
╭──────────●●►
│ヤ Command : *deepseek*
│ヤ Use : ${prefix}deepseek — Chat with DeepSeek AI
╰──────────●●►
╭──────────●●►
│ヤ Command : *chat*
│ヤ Use : ${prefix}chat — Chat with Gemini AI
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '3': {
                title: "🎧 *Convert Menu*",
                content: `🎧 Ξ CONVERT COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *tts*
│ヤ Use : ${prefix}tts — Text to Speech
╰──────────●●►
╭──────────●●►
│ヤ Command : *readmore*
│ヤ Use : ${prefix}readmore — Add Read More
╰──────────●●►
╭──────────●●►
│ヤ Command : *translate*
│ヤ Use : ${prefix}translate — Translate text
╰──────────●●►
╭──────────●●►
│ヤ Command : *gitclone*
│ヤ Use : ${prefix}gitclone — GitHub ZIP Download
╰──────────●●►
╭──────────●●►
│ヤ Command : *npm1*
│ヤ Use : ${prefix}npm1 — Search npm packages
╰──────────●●►
╭──────────●●►
│ヤ Command : *ss*
│ヤ Use : ${prefix}ss — Website Screenshot
╰──────────●●►
> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '4': {
                title: "📥 *Download Menu*",
                content: `📥 Ξ DOWNLOAD COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *facebook*
│ヤ Use : ${prefix}facebook — Download FB Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *tiktok*
│ヤ Use : ${prefix}tiktok — Download TikTok Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *ytpost*
│ヤ Use : ${prefix}ytpost — Download YouTube Posts
╰──────────●●►
╭──────────●●►
│ヤ Command : *apk*
│ヤ Use : ${prefix}apk — Download APK Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *gdrive*
│ヤ Use : ${prefix}gdrive — Download Google Drive Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *gitclone*
│ヤ Use : ${prefix}gitclone — Download GitHub Repo
╰──────────●●►
╭──────────●●►
│ヤ Command : *mediafire*
│ヤ Use : ${prefix}mediafire — Download MediaFire Files
╰──────────●●►
╭──────────●●►
│ヤ Command : *image*
│ヤ Use : ${prefix}image — Download Images
╰──────────●●►
╭──────────●●►
│ヤ Command : *song*
│ヤ Use : ${prefix}song — Download YouTube Songs
╰──────────●●►
╭──────────●●►
│ヤ Command : *video*
│ヤ Use : ${prefix}video — Download YouTube Videos
╰──────────●●►


> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '5': {
                title: "🔍 *Search Menu*",
                content: `🔍 Ξ SEARCH COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *yts / ytsearch*
│ヤ Use : ${prefix}yts — Search YouTube Videos
╰──────────●●►
╭──────────●●►
│ヤ Command : *define*
│ヤ Use : ${prefix}define — Find word definitions
╰──────────●●►
╭──────────●●►
│ヤ Command : *npm / npm1*
│ヤ Use : ${prefix}npm — Search npm Packages
╰──────────●●►
╭──────────●●►
│ヤ Command : *srepo*
│ヤ Use : ${prefix}srepo — Search GitHub Repos
╰──────────●●►
╭──────────●●►
│ヤ Command : *xstalk*
│ヤ Use : ${prefix}xstalk — Search Twitter/X User Info
╰──────────●●►
╭──────────●●►
│ヤ Command : *tiktokstalk*
│ヤ Use : ${prefix}tiktokstalk — Search TikTok User Info
╰──────────●●►
╭──────────●●►
│ヤ Command : *lyrics*
│ヤ Use : ${prefix}lyrics — Find song lyrics
╰──────────●●►
╭──────────●●►
│ヤ Command : *movie / imdb*
│ヤ Use : ${prefix}movie — Search movie info
╰──────────●●►
╭──────────●●►
│ヤ Command : *weather*
│ヤ Use : ${prefix}weather — Get weather updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *news*
│ヤ Use : ${prefix}news — Get latest news
╰──────────●●►
> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '6': {
                title: "👥 *Group Menu*",
                content: `👥 Ξ GROUP COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *requests*
│ヤ Use : ${prefix}requests — Show join requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *accept*
│ヤ Use : ${prefix}accept — Accept requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *reject*
│ヤ Use : ${prefix}reject — Reject requests
╰──────────●●►
╭──────────●●►
│ヤ Command : *hidetag*
│ヤ Use : ${prefix}hidetag — Tag all members
╰──────────●●►
╭──────────●●►
│ヤ Command : *promote*
│ヤ Use : ${prefix}promote — Make admin
╰──────────●●►
╭──────────●●►
│ヤ Command : *demote*
│ヤ Use : ${prefix}demote — Remove admin
╰──────────●●►
╭──────────●●►
│ヤ Command : *kick*
│ヤ Use : ${prefix}kick — Remove member
╰──────────●●►
╭──────────●●►
│ヤ Command : *mute*
│ヤ Use : ${prefix}mute — Mute group
╰──────────●●►
╭──────────●●►
│ヤ Command : *unmute*
│ヤ Use : ${prefix}unmute — Unmute group
╰──────────●●►
╭──────────●●►
│ヤ Command : *join*
│ヤ Use : ${prefix}join — Join via link
╰──────────●●►
╭──────────●●►
│ヤ Command : *del*
│ヤ Use : ${prefix}del — Delete message
╰──────────●●►
> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '7': {
                title: "👑 *Owner Menu*",
                content: `👑 Ξ OWNER COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *vv / vv2*
│ヤ Use : ${prefix}vv — Retrieve view-once media
╰──────────●●►
╭──────────●●►
│ヤ Command : *getpp*
│ヤ Use : ${prefix}getpp — Get user profile picture
╰──────────●●►
╭──────────●●►
│ヤ Command : *setpp*
│ヤ Use : ${prefix}setpp — Change bot profile picture
╰──────────●●►
╭──────────●●►
│ヤ Command : *broadcast*
│ヤ Use : ${prefix}broadcast — Send msg to all groups
╰──────────●●►
╭──────────●●►
│ヤ Command : *shutdown*
│ヤ Use : ${prefix}shutdown — Shutdown bot
╰──────────●●►
╭──────────●●►
│ヤ Command : *restart*
│ヤ Use : ${prefix}restart — Restart bot
╰──────────●●►
╭──────────●●►
│ヤ Command : *setting*
│ヤ Use : ${prefix}setting — change setting 
╰──────────●●►
╭──────────●●►
│ヤ Command : *clearchats*
│ヤ Use : ${prefix}clearchats — Clear all chats
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '8': {
                title: "🧰 *Tools Menu*",
                content: `🧰 Ξ TOOLS & UTILITY COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *jid*
│ヤ Use : ${prefix}jid — Get chat/user JID
╰──────────●●►
╭──────────●●►
│ヤ Command : *svtext*
│ヤ Use : ${prefix}svtext — Save text as URL
╰──────────●●►
╭──────────●●►
│ヤ Command : *send*
│ヤ Use : ${prefix}send — Forward quoted message
╰──────────●●►
╭──────────●●►
│ヤ Command : *trsi*
│ヤ Use : ${prefix}trsi — English ➜ Sinhala
╰──────────●●►
╭──────────●●►
│ヤ Command : *tren*
│ヤ Use : ${prefix}tren — Sinhala ➜ English
╰──────────●●►
╭──────────●●►
│ヤ Command : *tts*
│ヤ Use : ${prefix}tts — Sinhala Text ➜ Voice
╰──────────●●►
╭──────────●●►
│ヤ Command : *tempnum*
│ヤ Use : ${prefix}tempnum <cc> — Get temp numbers
╰──────────●●►
╭──────────●●►
│ヤ Command : *templist*
│ヤ Use : ${prefix}templist — List of countries
╰──────────●●►
╭──────────●●►
│ヤ Command : *otpbox*
│ヤ Use : ${prefix}otpbox <num> — Check OTP inbox
╰──────────●●►
╭──────────●●►
│ヤ Command : *tempmail*
│ヤ Use : ${prefix}tempmail — Generate temp mail
╰──────────●●►
╭──────────●●►
│ヤ Command : *checkmail*
│ヤ Use : ${prefix}checkmail <id> — View mail inbox
╰──────────●●►
╭──────────●●►
│ヤ Command : *countryinfo*
│ヤ Use : ${prefix}countryinfo <name> — Get country info
╰──────────●●►


> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            },
            '9': {
                title: "📰 *News Menu*",
                content: `📰 Ξ NEWS COMMAND LIST: Ξ
╭──────────●●►
│ヤ Command : *newson*
│ヤ Use : ${prefix}newson — Enable auto news updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *newsoff*
│ヤ Use : ${prefix}newsoff — Disable auto news updates
╰──────────●●►
╭──────────●●►
│ヤ Command : *alerton*
│ヤ Use : ${prefix}alerton — Enable breaking news alerts
╰──────────●●►
╭──────────●●►
│ヤ Command : *alertoff*
│ヤ Use : ${prefix}alertoff — Disable breaking news alerts
╰──────────●●►

> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                image: true
            }

        };

        // Message handler with improved error handling
        const handler = async (msgData) => {
            try {
                // Check for a non-empty message array
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                // Check if the message is a reply to the initial menu message
                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = (receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text)?.trim();
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: SUBMENU_IMG_URL }, // Use the sub-menu image URL constant
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

                            // Send reaction for successful menu selection
                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            console.log('Menu reply image send failed, falling back to text:', e.message);
                            // Fallback to text message on send failure
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        // FIX: Updated range from 1-19 to the correct 1-9
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between *1-9* to select a menu.\n\n*Example:* Reply with "1" for Main Menu\n\n> *Powered by: © 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e.message);
            }
        };

        // Add listener
        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes (300,000 milliseconds)
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
            console.log("Menu reply listener removed after 5 minutes.");
        }, 300000);

    } catch (e) {
        console.error('Menu Error (Main Block):', e);
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system encountered an error. Please try again later.\n\n> ${config?.DESCRIPTION || 'Vilon-X-MD Bot'}` },
                { quoted: mek }
            );
        } catch (finalError) {
            console.log('Final error handling failed:', finalError.message);
        }
    }
});
