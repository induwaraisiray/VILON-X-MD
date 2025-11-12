const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "IK~eEUhxaTK#VbVbkE-yfWWVdwCAnS-Wsv8m5kRWJRN_uemr_cwvhgY",
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
WELCOME: process.env.WELCOME || "false",
GOODBYE: process.env.GOODBYE || "false",
AUTO_VOICE: process.env.AUTO_VOICE || "false",
AUTO_REPLY: process.env.AUTO_REPLY || "false",
ANTI_LINK: process.env.ANTI_LINK || "true",
ANTI_BAD: process.env.ANTI_BAD || "false",
AUTO_TYPING: process.env.AUTO_TYPING || "false",
AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
PREFIX: process.env.PREFIX || ".",
READ_MESSAGE: process.env.READ_MESSAGE || "true",
AUTO_REACT: process.env.AUTO_REACT || "false",
MODE: process.env.MODE || "public",
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "true",
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
READ_CMD: process.env.READ_CMD || "false",
DESCRIPTION: process.env.DESCRIPTION || "*• © ᴩᴏᴡᴇʀᴅ ʙʏ ᴠɪʟᴏɴ-x ᴍᴅ •*",
DEV: process.env.DEV || "94740544995",
ANTI_VV: process.env.ANTI_VV || "true",
ANTI_DELETE: process.env.ANTI_DELETE || "false",
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",     
};


    
 
