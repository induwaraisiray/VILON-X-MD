const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")

cmd({
    pattern: "setting",
    alias: ["settings"],
    desc: "settings the bot",
    category: "owner",
    react: "⚙",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        // --- NEW STYLE SETTINGS MESSAGE START ---
        let desc = `
*⚙ BOT SETTING PANEL*

*WORK MODE*
  1.1 ⟩ Public
  1.2 ⟩ Private

*WELCOME*
  2.1 ⟩ Welcome ON
  2.2 ⟩ Welcome OFF

*AUTO TYPING*
  3.1 ⟩ Typing ON
  3.2 ⟩ Typing OFF

*AUTO RECORDING*
  4.1 ⟩ Recording ON
  4.2 ⟩ Recording OFF

*AUTO SEEN STATUS*
  5.1 ⟩ Seen ON
  5.2 ⟩ Seen OFF

*AUTO REACT*
  6.1 ⟩ React ON
  6.2 ⟩ React OFF

*MESSAGE READ*
  7.1 ⟩ Read MSG ON
  7.2 ⟩ Read MSG OFF

*ANTI LINK*
  9.1 ⟩ Anti Link ON
  9.2 ⟩ Anti Link OFF
  9.3 ⟩ Anti Link REMOVE
  
*AUTO VOICE*
  10.1 ⟩ Auto Voice ON
  10.2 ⟩ Auto Voice OFF
  
*ANTI DELETE*
  11.1 ⟩ Anti Delete ON
  11.2 ⟩ Anti Delete OFF
  
*ALWAYS ONLINE*
  12.1 ⟩ Always Online ON
  12.2 ⟩ Always Online OFF

*AUTO REPLY*
  13.1 ⟩ Auto Reply ON
  13.2 ⟩ Auto Reply OFF

*STATUS REACT*
  13.1 ⟩ Status React ON
  13.2 ⟩ Status React OFF
        
> ${config.DESCRIPTION}
`;

        // --- NEW STYLE SETTINGS MESSAGE END ---

        const vv = await conn.sendMessage(from, { image: { url: "https://files.catbox.moe/wwufnr.jpg"}, caption: desc }, { quoted: mek });

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1.1':
                        reply(".mode public" );
                        break;
                    case '1.2':               
                        reply(".mode private");
                        break;
                    case '2.1':     
                        reply(".welcome on");
                        break;
                    case '2.2':     
                        reply(".welcome off");
                    break;
                    case '3.1':    
                        reply(".auto-typing on");
                    break;
                    case '3.2':    
                        reply(".auto-typing off");
                    break;                    
                    case '4.1':    
                        reply(".auto-recording on");
                    break;
                    case '4.2':    
                        reply(".auto-recording off");
                    break;                                        
                    case '5.1':    
                        reply(".auto-seen on");
                    break;
                    case '5.2':    
                        reply(".auto-seen off");
                    break;                        
                    case '6.1':    
                        reply(".auto-react on");
                    break; 
                    case '6.2':    
                        reply(".auto-react off");
                    break;                       
                    case '7.1':    
                        reply(".read-message on");
                    break;
                    case '7.2':    
                        reply(".read-message off");
                    break;
                    case '9.1':    
                        reply(".antilink on"); 
                    break;
                    case '9.2':    
                        reply(".antilink off");
                    break;
                    case '9.3':    
                        reply(".update ANTI_LINK:false");
                    break;
                    case '10.1':    
                        reply(".auto-voice on");
                    break;
                    case '10.2':    
                        reply(".auto-voice off");
                    break;      
                    case '11.1':    
                        reply(".antidelete on");
                    break;
                    case '11.2':    
                        reply(".antidelete off");
                    break;        
                    case '12.1':    
                        reply(".always-online on");
                    break;
                    case '12.2':    
                        reply(".always-online off");
                    break;                    
                    case '13.1':    
                        reply(".auto-reply on");
                    break;
                    case '13.2':    
                        reply(".aauto-reply off");
                    break; 
                    case '14.1':    
                        reply(".status-react on");
                    break;
                    case '14.2':    
                        reply(".status-react off");
                    break;                                                                                                                           
                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }

            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } })
        reply('An error occurred while processing your request.');
    }
});
