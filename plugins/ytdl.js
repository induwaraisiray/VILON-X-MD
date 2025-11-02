const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js'); 

// Define constants for the new API
const API_BASE_URL = "https://sadiya-tech-apis.vercel.app/download/ytdl";
const API_KEY = "dinesh-api-key";

cmd({ 
     pattern: "song", 
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
// MP3 song download
cmd({ 
    pattern: "song1", 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
     
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
        
        let ytmsg = `*VILON-X-MD SONG DOWNLOADER ✨️*

┃ 🎶 *Title:* ${yts.title}
┃ ⏳ *Duration:* ${yts.timestamp}
┃ 👀 *Views:* ${yts.views}
┃ 👤 *Author:* ${yts.author.name}
┃ 🔗 *Link:* ${yts.url}

*Choose download format:*

1 || . 📄 MP3 as Document
2 || . 🎧 MP3 as Audio
3 || . 🎙️ MP3 as Voice Note

_Reply with 1, 2 or 3 to this message to download the format you prefer._

> *©  𝙿𝙾𝚆𝙴𝚁𝙳 𝙱𝚈 𝚅𝙸𝙻𝙾𝙽-𝚇-𝙼𝙳*`;
        
        let contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363395674230271@newsletter',
                newsletterName: 'isira induwara',
                serverMessageId: 143
            }
        };
        
        // Send thumbnail with caption only
  const songmsg = await conn.sendMessage(from, { image: { url: yts.thumbnail }, caption: ytmsg, contextInfo }, { quoted: mek });

  
     
                     conn.ev.on("messages.upsert", async (msgUpdate) => {
        

                const mp3msg = msgUpdate.messages[0];
                if (!mp3msg.message || !mp3msg.message.extendedTextMessage) return;

                const selectedOption = mp3msg.message.extendedTextMessage.text.trim();

                if (
                    mp3msg.message.extendedTextMessage.contextInfo &&
                    mp3msg.message.extendedTextMessage.contextInfo.stanzaId === songmsg.key.id
                ) {
                
                            
                   await conn.sendMessage(from, { react: { text: "⬇️", key: mp3msg.key } });

                    switch (selectedOption) {
case "1":   

      
      
   await conn.sendMessage(from, { document: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", fileName: `${yts.title}.mp3`, contextInfo }, { quoted: mp3msg });   
      
      
break;
case "2":   
await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", contextInfo }, { quoted: mp3msg });
break;
case "3":   
await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg", ptt: true, contextInfo }, { quoted: mp3msg });
break;


default:
                            await conn.sendMessage(
                                from,
                                {
                                    text: "*invalid selection please select between ( 1 or 2 or 3) 🔴*",
                                },
                                { quoted: mp3msg }
                            );
             }}});
           
    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});
