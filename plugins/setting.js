const config = require('../config')
const { cmd } = require('../command')

let settingReplySession = {}  // <-- Prevent multi listeners

cmd({
    pattern: "setting",
    alias: ["settings"],
    desc: "settings the bot",
    category: "owner",
    react: "⚙",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {

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
  14.1 ⟩ Status React ON
  14.2 ⟩ Status React OFF

*GOODBYE*
  15.1 ⟩ Goodbye ON
  15.2 ⟩ Goodbye OFF
                
> ${config.DESCRIPTION}
`;

        const sent = await conn.sendMessage(
            from,
            { image: { url: config.MENU_IMAGE_URL }, caption: desc },
            { quoted: mek }
        );

        // Remove previous listener for this user to avoid duplicates
        settingReplySession[from] = sent.key.id;

    } catch (e) {
        console.error(e);
        reply("❌ Error while opening settings panel.");
    }
});


// GLOBAL LISTENER (only one) — stable, safe, no crashes
cmd({
    on: "message"
}, async (conn, mek, m) => {

    const from = m.key.remoteJid;
    if (!settingReplySession[from]) return;

    let text = (
        m.message?.extendedTextMessage?.text ||
        m.message?.conversation ||
        m.message?.imageMessage?.caption ||
        ""
    ).trim();

    if (!text) return;

    // Check reply belongs to settings message
    let expectedId = settingReplySession[from];
    let contextId =
        m.message?.extendedTextMessage?.contextInfo?.stanzaId ||
        m.message?.imageMessage?.contextInfo?.stanzaId ||
        null;

    if (contextId !== expectedId) return;

    // --- OPTION HANDLER ---
    let reply = (msg) => conn.sendMessage(from, { text: msg }, { quoted: mek });

    switch (text) {

        case "1.1": reply(".mode public"); break;
        case "1.2": reply(".mode private"); break;

        case "2.1": reply(".welcome on"); break;
        case "2.2": reply(".welcome off"); break;

        case "3.1": reply(".auto-typing on"); break;
        case "3.2": reply(".auto-typing off"); break;

        case "4.1": reply(".auto-recording on"); break;
        case "4.2": reply(".auto-recording off"); break;

        case "5.1": reply(".auto-seen on"); break;
        case "5.2": reply(".auto-seen off"); break;

        case "6.1": reply(".auto-react on"); break;
        case "6.2": reply(".auto-react off"); break;

        case "7.1": reply(".read-message on"); break;
        case "7.2": reply(".read-message off"); break;

        case "9.1": reply(".antilink on"); break;
        case "9.2": reply(".antilink off"); break;
        case "9.3": reply(".update ANTI_LINK:false"); break;

        case "10.1": reply(".auto-voice on"); break;
        case "10.2": reply(".auto-voice off"); break;

        case "11.1": reply(".antidelete on"); break;
        case "11.2": reply(".antidelete off"); break;

        case "12.1": reply(".always-online on"); break;
        case "12.2": reply(".always-online off"); break;

        case "13.1": reply(".auto-reply on"); break;
        case "13.2": reply(".auto-reply off"); break;

        case "14.1": reply(".status-react on"); break;
        case "14.2": reply(".status-react off"); break;

        case "15.1": reply(".goodbye on"); break;
        case "15.2": reply(".goodbye off"); break;

        default:
            reply("❌ Invalid option. Please select a valid number.");
    }

    // Remove session after reply
    delete settingReplySession[from];
});