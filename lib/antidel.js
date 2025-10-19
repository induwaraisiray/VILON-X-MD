const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

// ============================================================
// 📝 Function : DeletedText
// ============================================================
const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    const messageContent =
        mek.message?.conversation ||
        mek.message?.extendedTextMessage?.text ||
        '⚠️ Unknown content';

    const formattedText = `
╭─────❰ *🚫 MESSAGE RESTORED* ❱─────╮
│ 💬 *Deleted Message Found!*
│━━━━━━━━━━━━━━━━━━━━━━━━━━
${deleteInfo}
│━━━━━━━━━━━━━━━━━━━━━━━━━━
│ 💭 *CONTENT:* 
│ ${messageContent}
╰────────────────────────────╯
`;

    await conn.sendMessage(
        jid,
        {
            text: formattedText,
            contextInfo: {
                mentionedJid: isGroup
                    ? [update.key.participant, mek.key.participant]
                    : [update.key.remoteJid],
            },
        },
        { quoted: mek }
    );
};

// ============================================================
// 🎞️ Function : DeletedMedia
// ============================================================
const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    const antideletedmek = structuredClone(mek.message);
    const messageType = Object.keys(antideletedmek)[0];

    if (antideletedmek[messageType]) {
        antideletedmek[messageType].contextInfo = {
            stanzaId: mek.key.id,
            participant: mek.sender,
            quotedMessage: mek.message,
        };
    }

    if (messageType === 'imageMessage' || messageType === 'videoMessage') {
        antideletedmek[messageType].caption = `
╭─────❰ *🚫 MEDIA RESTORED* ❱─────╮
│ 💬 *A deleted media was recovered!*
│━━━━━━━━━━━━━━━━━━━━━━━━━━
${deleteInfo}
╰────────────────────────────╯`;
    } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
        await conn.sendMessage(
            jid,
            {
                text: `
╭─────❰ *🚫 FILE RESTORED* ❱─────╮
│ 📁 Deleted file recovered!
│━━━━━━━━━━━━━━━━━━━━━━━━━━
${deleteInfo}
╰────────────────────────────╯`,
            },
            { quoted: mek }
        );
    }

    await conn.relayMessage(jid, antideletedmek, {});
};

// ============================================================
// 🔄 Function : AntiDelete
// ============================================================
const AntiDelete = async (conn, updates) => {
    for (const update of updates) {
        if (update.update.message === null) {
            const store = await loadMessage(update.key.id);

            if (store && store.message) {
                const mek = store.message;
                const isGroup = isJidGroup(store.jid);
                const antiDeleteStatus = await getAnti();
                if (!antiDeleteStatus) continue;

                const deleteTime = new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                });

                let deleteInfo, jid;
                if (isGroup) {
                    const groupMetadata = await conn.groupMetadata(store.jid);
                    const groupName = groupMetadata.subject;
                    const sender = mek.key.participant?.split('@')[0];
                    const deleter = update.key.participant?.split('@')[0];

                    deleteInfo = `
📛 *Group Message Deleted!*
├👥 *Group:* ${groupName}
├👤 *Sender:* @${sender}
├🗑️ *Deleted By:* @${deleter}
├⏰ *Time:* ${deleteTime}
╰⚠️ *Action:* Message Recovered 👇`;

                    jid =
                        config.ANTI_DEL_PATH === 'inbox'
                            ? conn.user.id
                            : store.jid;
                } else {
                    const senderNumber = mek.key.remoteJid?.split('@')[0];
                    const deleterNumber = update.key.remoteJid?.split('@')[0];

                    deleteInfo = `
📛 *Private Message Deleted!*
├👤 *Sender:* @${senderNumber}
├⏰ *Time:* ${deleteTime}
╰⚠️ *Action:* Message Recovered 👇`;

                    jid =
                        config.ANTI_DEL_PATH === 'inbox'
                            ? conn.user.id
                            : update.key.remoteJid;
                }

                if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                    await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
                } else {
                    await DeletedMedia(conn, mek, jid, deleteInfo);
                }
            }
        }
    }
};

// ============================================================
// 📦 Export
// ============================================================
module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
