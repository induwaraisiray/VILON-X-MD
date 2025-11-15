const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const translate = require('@vitalets/google-translate-api');
const { fetchJson } = require('../lib/functions');
const config = require("../config");
const { cmd, commands } = require("../command");

// COUNTRY INFO
cmd({
  pattern: "countryinfo",
  alias: ["cinfo", "country", "cinfo2"],
  desc: "Get information about a country",
  category: "info",
  react: "🌍",
  filename: __filename
}, async (conn, mek, m, { from, q, reply, react }) => {
  try {
    if (!q) return reply("Please provide a country name.\nExample: `.countryinfo Pakistan`");

    const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      await react("❌");
      return reply(`No information found for *${q}*. Please check the country name.`);
    }

    const info = data.data;
    let neighborsText = info.neighbors.length > 0
      ? info.neighbors.map(n => `🌍 *${n.name}*`).join(", ")
      : "No neighboring countries found.";

    const text = `🌍 *Country Information: ${info.name}* 🌍\n\n` +
      `🏛 *Capital:* ${info.capital}\n` +
      `📍 *Continent:* ${info.continent.name} ${info.continent.emoji}\n` +
      `📞 *Phone Code:* ${info.phoneCode}\n` +
      `📏 *Area:* ${info.area.squareKilometers} km² (${info.area.squareMiles} mi²)\n` +
      `🚗 *Driving Side:* ${info.drivingSide}\n` +
      `💱 *Currency:* ${info.currency}\n` +
      `🔤 *Languages:* ${info.languages.native.join(", ")}\n` +
      `🌟 *Famous For:* ${info.famousFor}\n` +
      `🌍 *ISO Codes:* ${info.isoCode.alpha2.toUpperCase()}, ${info.isoCode.alpha3.toUpperCase()}\n` +
      `🌎 *Internet TLD:* ${info.internetTLD}\n\n` +
      `🔗 *Neighbors:* ${neighborsText}`;

    await conn.sendMessage(from, {
      image: { url: info.flag },
      caption: text,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });

    await react("✅");
  } catch (e) {
    console.error("Error in countryinfo command:", e);
    await react("❌");
    reply("An error occurred while fetching country information.");
  }
});

// MSG

cmd({
  pattern: "msg",
  desc: "Send a message multiple times (Owner Only)",
  category: "utility",
  react: "👾",
  filename: __filename
},
async (conn, mek, m, {
  from,
  reply,
  isCreator,
  q
}) => {
  // Owner-only restriction
  if (!isCreator) return reply('🚫 *Owner only command!*');

  try {
    // Check format: .msg text,count
    if (!q.includes(',')) {
      return reply("❌ *Format:* .msg text,count\n*Example:* .msg Hello,5");
    }

    const [message, countStr] = q.split(',');
    const count = parseInt(countStr.trim());

    // Hard limit: 1-100 messages
    if (isNaN(count) || count < 1 || count > 1000) {
      // Fixed the error message to be more accurate
      return reply("❌ *Message count must be between 1 and 1000.*");
    }

    // Silent execution (no confirmations)
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(from, {
        text: message
      }, {
        quoted: null
      });
      if (i < count - 1) await new Promise(resolve => setTimeout(resolve, 100)); // 500ms delay
    }

  } catch (e) {
    console.error("Error in msg command:", e);
    reply(`❌ *Error:* ${e.message}`);
  }
});

//temp mail


cmd({
  pattern: "tempmail",
  alias: ["genmail"],
  desc: "Generate a new temporary email address",
  category: "utility",
  react: "📧",
  filename: __filename
},
async (conn, mek, m, {
  from,
  reply,
  prefix
}) => {
  try {
    const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');
    const {
      email,
      session_id,
      expires_at
    } = response.data;

    // Format the expiration time and date
    const expiresDate = new Date(expires_at);
    const timeString = expiresDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const dateString = expiresDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Create the complete message
    const message = `
📧 *TEMPORARY EMAIL GENERATED*

✉️ *Email Address:*
${email}

⏳ *Expires:*
${timeString} • ${dateString}

🔑 *Session ID:*
\`\`\`${session_id}\`\`\`

📥 *Check Inbox:*
.inbox ${session_id}

_Email will expire after 24 hours_
`;

    await conn.sendMessage(
      from, {
        text: message,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363363023106228@newsletter',
            newsletterName: 'TempMail Service',
            serverMessageId: 101
          }
        }
      }, {
        quoted: mek
      }
    );

  } catch (e) {
    console.error('TempMail error:', e);
    reply(`❌ Error: ${e.message}`);
  }
});
cmd({
  pattern: "checkmail",
  alias: ["inbox", "tmail", "mailinbox"],
  desc: "Check your temporary email inbox",
  category: "utility",
  react: "📬",
  filename: __filename
},
async (conn, mek, m, {
  from,
  reply,
  args
}) => {
  try {
    const sessionId = args[0];
    if (!sessionId) return reply('🔑 Please provide your session ID\nExample: .checkmail YOUR_SESSION_ID');

    const inboxUrl = `https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${encodeURIComponent(sessionId)}`;
    const response = await axios.get(inboxUrl);

    if (!response.data.success) {
      return reply('❌ Invalid session ID or expired email');
    }

    const {
      inbox_count,
      messages
    } = response.data;

    if (inbox_count === 0) {
      return reply('📭 Your inbox is empty');
    }

    let messageList = `📬 *You have ${inbox_count} message(s)*\n\n`;
    messages.forEach((msg, index) => {
      messageList += `━━━━━━━━━━━━━━━━━━\n` +
        `📌 *Message ${index + 1}*\n` +
        `👤 *From:* ${msg.from}\n` +
        `📝 *Subject:* ${msg.subject}\n` +
        `⏰ *Date:* ${new Date(msg.date).toLocaleString()}\n\n` +
        `📄 *Content:*\n${msg.body}\n\n`;
    });

    await reply(messageList);

  } catch (e) {
    console.error('CheckMail error:', e);
    reply(`❌ Error checking inbox: ${e.response?.data?.message || e.message}`);
  }
});

cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a city name. Usage: .weather [city name]");
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const weather = `
🌍 *Weather Information for ${data.name}, ${data.sys.country}* 🌍
🌡️ *Temperature*: ${data.main.temp}°C
🌡️ *Feels Like*: ${data.main.feels_like}°C
🌡️ *Min Temp*: ${data.main.temp_min}°C
🌡️ *Max Temp*: ${data.main.temp_max}°C
💧 *Humidity*: ${data.main.humidity}%
☁️ *Weather*: ${data.weather[0].main}
🌫️ *Description*: ${data.weather[0].description}
💨 *Wind Speed*: ${data.wind.speed} m/s
🔽 *Pressure*: ${data.main.pressure} hPa

> ${config.DESCRIPTION}
`;
        return reply(weather);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});

cmd({
    pattern: "trsi",
    desc: "Translate English → Sinhala (reply to a message)",
    category: "tools",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { reply, react }) => {
    const msg = m.quoted?.text;
    if (!msg) return reply("කරුණාකර reply message එකක් දෙන්න.");

    try {
        const res = await translate(msg, { to: 'si' });
        await react("✅");
        return reply(`🇱🇰 *සිංහලට පරිවර්තනය:* \n\n${res.text}`);
    } catch (e) {
        console.error("Translate Error:", e);
        await react("❌");
        return reply("පරිවර්තනය අසාර්ථකයි.");
    }
});

// Sinhala ➜ English
cmd({
    pattern: "tren",
    desc: "Translate Sinhala → English (reply to a message)",
    category: "tools",
    react: "🌐",
    filename: __filename
}, async (conn, mek, m, { reply, react }) => {
    const msg = m.quoted?.text;
    if (!msg) return reply("Please reply to a Sinhala message to translate.");

    try {
        const res = await translate(msg, { to: 'en' });
        await react("✅");
        return reply(`🇬🇧 *Translated to English:* \n\n${res.text}`);
    } catch (e) {
        console.error("Translate Error:", e);
        await react("❌");
        return reply("Translation failed.");
    }
});


cmd({
    pattern: "tts",
    desc: "Convert Sinhala text to speech",
    react: "🗣️",
    filename: __filename
}, async (conn, m, msg, { text, from }) => {
    if (!text) {
        return await conn.sendMessage(from, { text: "උදාහරණයක්: `.tts ඔයාට කොහොමද කියලා`" });
    }

    try {
        const ttsRes = await axios({
            method: "GET",
            url: `https://translate.google.com/translate_tts`,
            params: {
                ie: "UTF-8",
                q: text,
                tl: "si",
                client: "tw-ob"
            },
            responseType: "arraybuffer"
        });

        const filePath = path.join(__dirname, '../temp', `${Date.now()}.mp3`);
        fs.writeFileSync(filePath, ttsRes.data);

        await conn.sendMessage(from, {
            audio: fs.readFileSync(filePath),
            mimetype: 'audio/mp4',
            ptt: true
        });

        fs.unlinkSync(filePath);
    } catch (err) {
        console.error("TTS Error:", err);
        await conn.sendMessage(from, { text: "වදිනවා! TTS voice එක generate කරන්න බැරි වුණා." });
    }
});


cmd({
    pattern: "person",
    react: "👤",
    alias: ["userinfo", "profile"],
    desc: "Get complete user profile information",
    category: "utility",
    use: '.person [@tag or reply]',
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, reply, quoted, participants }) => {
    try {
        // 1. DETERMINE TARGET USER
        let userJid = quoted?.sender || 
                     mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                     sender;

        // 2. VERIFY USER EXISTS
        const [user] = await conn.onWhatsApp(userJid).catch(() => []);
        if (!user?.exists) return reply("❌ User not found on WhatsApp");

        // 3. GET PROFILE PICTURE
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(userJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // 4. GET NAME (MULTI-SOURCE FALLBACK)
        let userName = userJid.split('@')[0];
        try {
            // Try group participant info first
            if (isGroup) {
                const member = participants.find(p => p.id === userJid);
                if (member?.notify) userName = member.notify;
            }
            
            // Try contact DB
            if (userName === userJid.split('@')[0] && conn.contactDB) {
                const contact = await conn.contactDB.get(userJid).catch(() => null);
                if (contact?.name) userName = contact.name;
            }
            
            // Try presence as final fallback
            if (userName === userJid.split('@')[0]) {
                const presence = await conn.presenceSubscribe(userJid).catch(() => null);
                if (presence?.pushname) userName = presence.pushname;
            }
        } catch (e) {
            console.log("Name fetch error:", e);
        }

        // 5. GET BIO/ABOUT
        let bio = {};
        try {
            // Try personal status
            const statusData = await conn.fetchStatus(userJid).catch(() => null);
            if (statusData?.status) {
                bio = {
                    text: statusData.status,
                    type: "Personal",
                    updated: statusData.setAt ? new Date(statusData.setAt * 1000) : null
                };
            } else {
                // Try business profile
                const businessProfile = await conn.getBusinessProfile(userJid).catch(() => null);
                if (businessProfile?.description) {
                    bio = {
                        text: businessProfile.description,
                        type: "Business",
                        updated: null
                    };
                }
            }
        } catch (e) {
            console.log("Bio fetch error:", e);
        }

        // 6. GET GROUP ROLE
        let groupRole = "";
        if (isGroup) {
            const participant = participants.find(p => p.id === userJid);
            groupRole = participant?.admin ? "👑 Admin" : "👥 Member";
        }

        // 7. FORMAT OUTPUT
        const formattedBio = bio.text ? 
            `${bio.text}\n└─ 📌 ${bio.type} Bio${bio.updated ? ` | 🕒 ${bio.updated.toLocaleString()}` : ''}` : 
            "No bio available";

        const userInfo = `
*GC MEMBER INFORMATION 🧊*

📛 *Name:* ${userName}
🔢 *Number:* ${userJid.replace(/@.+/, '')}
📌 *Account Type:* ${user.isBusiness ? "💼 Business" : user.isEnterprise ? "🏢 Enterprise" : "👤 Personal"}

*📝 About:*
${formattedBio}

*⚙️ Account Info:*
✅ Registered: ${user.isUser ? "Yes" : "No"}
🛡️ Verified: ${user.verifiedName ? "✅ Verified" : "❌ Not verified"}
${isGroup ? `👥 *Group Role:* ${groupRole}` : ''}
`.trim();

        // 8. SEND RESULT
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: userInfo,
            mentions: [userJid]
        }, { quoted: mek });

    } catch (e) {
        console.error("Person command error:", e);
        reply(`❌ Error: ${e.message || "Failed to fetch profile"}`);
    }
});

cmd({
    'pattern': 'logo',
    'desc': 'Create logos',
    'react': '🎗',
    'category': 'other', // Likely the category for the bot menu
    'filename': __filename
}, async (message, chat, context, {
    from,
    quoted,
    body,
    isCmd,
    command,
    args,
    q: logoText, // The text provided by the user for the logo
    reply
}) => {
    try {
        // 1. Check if the user provided text
        if (!args[0]) {
            return reply('*_Please give me a text._*');
        }

        // 2. Construct the logo style selection menu
        let menuMessage = 
            '*🃏 VILON-X-MD LOGO MAKER 💫*\n\n' +
            '╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼➻\n' +
            `*◈ᴛᴇxᴛ :* ${logoText}\n` +
            '╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼╼➻\n\n' +
            '*🔢 Reply The Number You Want ➠*\n\n' +
            ' 1 ➠ Black Pink\n' +
            ' 2 ➠ Black Pink 2\n' +
            ' 3 ➠ Silver 3D\n' +
            ' 4 ➠ Naruto\n' +
            ' 5 ➠ Digital Glitch\n' +
            ' 6 ➠ Pixel Glitch\n' +
            ' 7 ➠ Comic Style\n' +
            ' 8 ➠ Neon Light\n' +
            ' 9 ➠ Free Bear\n' +
            '10 ➠ Devil Wings\n' +
            '11 ➠ Sad Girl\n' +
            '12 ➠ Leaves\n' +
            '13 ➠ Dragon Ball\n' +
            '14 ➠ Hand Written\n' +
            '15 ➠ Neon Light \n' +
            '16 ➠ 3D Castle Pop\n' +
            '17 ➠ Frozen Crismass\n' +
            '18 ➠ 3D Foil Balloons\n' +
            '19 ➠ 3D Colourful Paint\n' +
            '20 ➠ American Flag 3D\n\n' +
            '> *© 𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*';
        
        // 3. Prepare context for a newsletter-style forwarded message (often used in WhatsApp bots)
        const forwardContext = {
            'newsletterJid': '120363352224008317@newslettter',
            'newsletterName': 'vilon-x-md',
            'serverMessageId': 999 
        };
        const messageContext = {
            'mentionedJid': [context.sender],
            'forwardingScore': 999,
            'isForwarded': true,
            'forwardedNewsletterMessageInfo': forwardContext
        };
        
        // 4. Send the menu message and store its reference
        const messageToSend = { 'text': menuMessage, 'contextInfo': messageContext };
        let sentMessage = await message.sendMessage(from, messageToSend, { 'quoted': chat });

        // 5. Listen for the user's reply (the selected number)
        message.ev.on('messages.upsert', async update => {
            const incomingMessage = update.messages[0];
            
            // Basic message validation
            if (!incomingMessage.message || !incomingMessage.message.extendedTextMessage) return;
            
            // Get the reply number (trimmed)
            const replyNumber = incomingMessage.message.extendedTextMessage.text.trim();
            
            // Check if the message is a reply to the menu we just sent
            if (incomingMessage.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id) {
                
                let apiUrl = '';
                const baseApi = 'https://api-pink-venom.vercel.app/api/logo?url=';
                const apiFooter = '&name=' + logoText;

                // 6. Select the correct API URL based on the reply number
                switch (replyNumber) {
                    case '1':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html' + apiFooter;
                        break;
                    case '2':
                        apiUrl = baseApi + 'https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html' + apiFooter;
                        break;
                    case '3':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-glossy-silver-3d-text-effect-online-802.html' + apiFooter;
                        break;
                    case '4':
                        apiUrl = baseApi + 'https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html' + apiFooter;
                        break;
                    case '5':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html' + apiFooter;
                        break;
                    case '6':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html' + apiFooter;
                        break;
                    case '7':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html' + apiFooter;
                        break;
                    case '8':
                    case '15': // Case 15 is a duplicate of Case 8
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html' + apiFooter;
                        break;
                    case '9':
                        apiUrl = baseApi + 'https://en.ephoto360.com/free-bear-logo-maker-online-673.html' + apiFooter;
                        break;
                    case '10':
                        apiUrl = baseApi + 'https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html' + apiFooter;
                        break;
                    case '11':
                        apiUrl = baseApi + 'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html' + apiFooter;
                        break;
                    case '12':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-typography-status-online-with-impressive-leaves-357.html' + apiFooter;
                        break;
                    case '13':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html' + apiFooter;
                        break;
                    case '14':
                        apiUrl = baseApi + 'https://en.ephoto360.com/handwritten-text-on-foggy-glass-online-680.html' + apiFooter;
                        break;
                    case '16':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-a-3d-castle-pop-out-mobile-photo-effect-786.html' + apiFooter;
                        break;
                    case '17':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-a-frozen-christmas-text-effect-online-792.html' + apiFooter;
                        break;
                    case '18':
                        apiUrl = baseApi + 'https://en.ephoto360.com/beautiful-3d-foil-balloon-effects-for-holidays-and-birthday-803.html' + apiFooter;
                        break;
                    case '19':
                        apiUrl = baseApi + 'https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html' + apiFooter;
                        break;
                    case '20':
                        apiUrl = baseApi + 'https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html' + apiFooter;
                        break;
                    default:
                        // Invalid number reply
                        return reply('*_Invalid number.Please reply a valid number._*');
                }
                
                // 7. Fetch the logo from the API
                let logoData = await fetchJson(apiUrl);
                
                // 8. Send the generated image back to the user
                await message.sendMessage(from, {
                    'image': { 'url': logoData.result.download_url },
                    'caption': '> ${config.DESCRIPTION}'
                }, { 'quoted': chat });
            }
        });
    } catch (error) {
        console.log(error);
        reply('' + error);
    }
});
