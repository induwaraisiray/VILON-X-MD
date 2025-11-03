const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 

// Define constants for the new API
const API_BASE_URL = "https://sadiya-tech-apis.vercel.app/download/ytdl";
const API_KEY = "dinesh-api-key";

// =================================================================
// 🎵 Command: MP4 / Video Download (.mp4, .video, .ytv)
// =================================================================

cmd({ 
    pattern: "mp4", 
    alias: ["video", "ytv"], 
    react: "🎥", 
    desc: "Download Youtube video", 
    category: "main", 
    use: '.mp4 < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("*𝐏ℓєαʂє 𝐏ɼ๏νιɖє 𝐀 𝐘ʈ 𝐔ɼℓ ๏ɼ 𝐕ιɖє๏ 𝐍αмє..*");
        
        // 1. Search YouTube
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        
        // 2. Construct New MP4 API URL with format and API key
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp4&apikey=${API_KEY}`;
        
        // 3. Fetch data from the new API
        let response = await fetch(apiUrl);
        let apiData = await response.json();
        
        // Check API status
        if (!apiData.status || apiData.status === false) {
            console.error("API Error:", apiData);
            return reply(`API Error: ${apiData.err || 'Unknown error'}`);
        }
        
        // --- FINAL MP4 DATA EXTRACTION ---
        const downloadUrl = apiData.result?.download || apiData.result?.video || apiData.download;
        const thumbnail = apiData.result?.thumbnail || apiData.thumbnail || yts.thumbnail || '';

        if (!downloadUrl) {
             console.error("API Response Error (MP4 - Missing URL):", apiData);
            return reply("Failed to fetch the video from the API. Download URL not found in response.");
        }
        
        // --- Message Construction ---
        let ytmsg = `╔═══〔 *QUEEN-SADU𓆪* 〕═══❒
║╭───────────────◆  
║│ *❍ ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*
║╰───────────────◆
╚══════════════════❒
╔══════════════════❒
║ ⿻ *ᴛɪᴛʟᴇ:* ${yts.title}
║ ⿻ *ᴅᴜʀᴀᴛɪᴏɴ:* ${yts.timestamp}
║ ⿻ *ᴠɪᴇᴡs:* ${yts.views}
║ ⿻ *ᴀᴜᴛʜᴏʀ:* ${yts.author.name}
║ ⿻ *ʟɪɴᴋ:* ${yts.url}
╚══════════════════❒
*ᴩᴏᴡᴇʀᴇᴅ ʙʏ ©ᴍʀ ᴅɪɴᴇꜱʜ ᴏꜰᴄ*`;

        // 5. Send results 
        
        // Send video details with thumbnail
        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: ytmsg 
        }, { quoted: mek });
        
        // Send video file
        await conn.sendMessage(from, { 
            video: { url: downloadUrl }, 
            mimetype: "video/mp4",
            caption: `*${yts.title}*\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ🎐*` 
        }, { quoted: mek });
        
        // Send document file (optional)
        await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: "video/mp4", 
            fileName: `${yts.title}.mp4`, 
            caption: `*${yts.title}*\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ🎐*`
        }, { quoted: mek });

    } catch (e) {
        console.error("MP4 Error:", e);
        reply("An error occurred during video download. Please try again later.");
    }
});  
       
// =================================================================
// 🎶 Command: MP3 / Audio Download (.song, .yta, .play)
// =================================================================

cmd({ 
     pattern: "ytmp3", 
     alias: ["yta", "play"], 
     react: "🎶", 
     desc: "Download Youtube song",
     category: "main", 
     use: '.song < Yt url or Name >', 
     filename: __filename }, 
     async (conn, mek, m, { from, prefix, quoted, q, reply }) => 
     
     { try { 
        if (!q) return await reply("*𝐏ℓєαʂє 𝐏ɼ๏νιɖє 𝐀 𝐘ʈ 𝐔ɼℓ ๏ɼ 𝐒๏ƞ͛g 𝐍αмє..*");

        // 1. Search YouTube
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        
        // 2. Construct New MP3 API URL with format and API key
        const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp3&apikey=${API_KEY}`;
        
        // 3. Fetch data from the new API
        let response = await fetch(apiUrl);
        let apiData = await response.json();
        
        // Check API status
        if (!apiData.status || apiData.status === false) {
            console.error("API Error:", apiData);
            return reply(`API Error: ${apiData.err || 'Unknown error'}`);
        }
        
        // --- FINAL MP3 DATA EXTRACTION ---
        const downloadUrl = apiData.result?.download || apiData.result?.audio || apiData.download;
        const thumbnail = apiData.result?.thumbnail || apiData.thumbnail || yts.thumbnail || '';

        if (!downloadUrl) {
            console.error("API Response Error (MP3 - Missing URL):", apiData);
            return reply("Failed to fetch the audio from the API. Download URL not found in response.");
        }
        
        // --- Message Construction ---
        let ytmsg = `╔═══〔 *𓆩QUEEN-SADU𓆪* 〕═══❒
║╭───────────────◆  
║│ *QUEEN-SADU-𝐌Ɗ 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐈𝐍𝐆*
║╰───────────────◆
╚══════════════════❒
╔══════════════════❒
║ ⿻ *ᴛɪᴛʟᴇ:* ${yts.title}
║ ⿻ *ᴅᴜʀᴀᴛɪᴏɴ:* ${yts.timestamp}
║ ⿻ *ᴠɪᴇᴡs:* ${yts.views}
║ ⿻ *ᴀᴜᴛʜᴏʀ:* ${yts.author.name}
║ ⿻ *ʟɪɴᴋ:* ${yts.url}
╚══════════════════❒
*ᴩᴏᴡᴇʀᴇᴅ ʙʏ © ᴍʀ ᴅɪɴᴇꜱʜ*`;

        // 5. Send results 

        // Send song details with thumbnail
        await conn.sendMessage(from, { 
            image: { url: thumbnail }, 
            caption: ytmsg 
        }, { quoted: mek });
        
        // Send audio file
        await conn.sendMessage(from, { 
            audio: { url: downloadUrl }, 
            mimetype: "audio/mpeg" 
        }, { quoted: mek });
        
        // Send document file
        await conn.sendMessage(from, { 
            document: { url: downloadUrl }, 
            mimetype: "audio/mpeg", 
            fileName: `${yts.title}.mp3`, 
            caption: `> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ᴅɪɴᴇꜱʜ🎐*`
        }, { quoted: mek });

    } catch (e) {
        console.error("MP3 Error:", e);
        reply("An error occurred during audio download. Please try again later.");
    }

});

cmd({
  pattern: "song",
  react: "🎶",
  desc: "Download YouTube song with format choice",
  category: "main",
  use: ".song1 < Yt url or Name >",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("*Please provide a YouTube URL or Song name!*");

    const yt = await ytsearch(q);
    if (!yt.results || yt.results.length === 0) return reply("No results found!");

    const yts = yt.results[0];
    const apiUrl = `${API_BASE_URL}?url=${encodeURIComponent(yts.url)}&format=mp3&apikey=${API_KEY}`;
    const res = await fetch(apiUrl);
    const apiData = await res.json();

    if (!apiData.status) return reply(`API Error: ${apiData.err || "Unknown error"}`);

    const downloadUrl = apiData.result?.download || apiData.result?.audio || apiData.download;
    if (!downloadUrl) return reply("Failed to fetch download URL.");

    const ytmsg = `*VILON-X-MD SONG DOWNLOADER ✨️*

┃ 🎶 *Title:* ${yts.title}
┃ ⏳ *Duration:* ${yts.timestamp}
┃ 👀 *Views:* ${yts.views}
┃ 👤 *Author:* ${yts.author.name}
┃ 🔗 *Link:* ${yts.url}

*Choose download format:*

1 || . 📄 MP3 as Document
2 || . 🎧 MP3 as Audio
3 || . 🎙️ MP3 as Voice Note

_Reply with 1, 2 or 3 to this message to download your format._

> *© Powered by VILON-X-MD*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: yts.thumbnail },
      caption: ytmsg
    }, { quoted: mek });

    // ✅ Wait for user's next message
    const filter = (msg) =>
      msg.key.remoteJid === from &&
      msg.message?.extendedTextMessage?.contextInfo?.stanzaId === sentMsg.key.id;

    const timeout = 30000; // 30 sec timeout

    const listener = async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!filter(msg)) return;

      const selected = msg.message.extendedTextMessage.text.trim();
      await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

      switch (selected) {
        case "1":
          await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${yts.title}.mp3`,
            caption: `> *🎶 Your song is ready!*`
          }, { quoted: msg });
          break;

        case "2":
          await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg"
          }, { quoted: msg });
          break;

        case "3":
          await conn.sendMessage(from, {
            audio: { url: downloadUrl },
            mimetype: "audio/mpeg",
            ptt: true
          }, { quoted: msg });
          break;

        default:
          await conn.sendMessage(from, { text: "*❌ Invalid selection!*" }, { quoted: msg });
          break;
      }

      conn.ev.off("messages.upsert", listener); // 🔹 stop listener after first valid reply
    };

    conn.ev.on("messages.upsert", listener);

    // 🔹 optional timeout auto-stop
    setTimeout(() => conn.ev.off("messages.upsert", listener), timeout);

  } catch (e) {
    console.error("Song1 Error:", e);
    reply("An error occurred. Please try again later.");
  }
});
