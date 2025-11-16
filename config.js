const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "JK~H4sIAAAAAAAAA82VW4/iuBLHv4tfQdu5mSRILW2uQEJDQyCQPjoP7sQJbnK1TSCM+O6r0N0zo92zoz7SPmyeHF+qfvV3ueobKCvCsI87MP4GakpaxHE/5F2NwRiYpzTFFAxBgjgCYyAtwgdD30RmAas26i6651FVhF50dvPLsrokApSnhh3G7vER3IagPr3mJP6FwdU8dcsAyrsLD7j/NpvoQVxLht7i0IivR1dIhUkhbvfSJH4Et94iIpSUmVMfcIEpyn3cPSNCv4Z/ntfLdV7FUepuhFfLGS1b5J0jtj1qpbgJCy+xGnzdFt4+/hp+FsXTvbP2T6K4SoXluSTeeR4MloMBza3lrptfHdWD/rO1Pr7jM5KVOJkluOSEd1/WfWSIbZxsJPPor0/a5bWRpCLKrNM89BSmK28vfnOZ5bPYyaOvgUft+pq6ZhO13PMjXCTT15etke4PZDTfOq+O/uSF4eDsr53tz+DP9DNXjv+P7mxeoGaxVSGKea7F9eApiZo8Zzt7rgrFTAnPkF4dJjtO9jV8rGRdYWoPb0Zb+Q02oFOwY7tfN0+SNzIq2KVP+fO12GeG9gMf8RP9FSXVBts521lkgXZHC+ZYVXbmPEF6Q8k2SJrZVWOpDNWsjY1NsNEnIen2HV8J04202K3y2H6xJour9cLnytlEbVMurSx7vEd0xN0sAWPxNgQUZ4RxijipyvucNBoClLQBjinmd3lBWzm5pObBaXdKLpspYabXBmcHPlRKJp+jqxTonGndYPCsPIIhqGkVY8ZwMiWMV7R7woyhDDMw/s/9pvqgKS4qjj2SgDHQFRWKiqroOvyd/XY+IM5QXf9WYg6GIKVV8YTBOEU5w0NwP2BYjgkNXYOmMjIVUXcdQVRsF7qGKqmK6vQMiHISkxqVHIwB6ENKKGaMlNlTlfR612WvRPHOtiEFZhwVNRiL6kiWVAgF6Tb8p3BVQ9GgYkLJcByoC5puyZqpiJatjGzrX4jrmprhWqI6Mh1o2rJlu6I8skeObImG/q/DlS1dhc5IFhRdkQxTMEaurYkyNAVFNv8hdeXbf4egxBf+XnP6l6KJ8hCkhDK+LU91XqHksyJ9X0VxXJ1KHnRlbPUDTMFY+DGNOSdlxnoJTiWi8YG02Ooj/ojw+/PEFCdgzOkJf2851jv4Yi5N905kgJ6+N/RnEceS/lcd8/suUVFGUFChKsm6IGj9zn7h9h2wt5dgjkjOwBhY86uat9HEWaY5jLPJxJhlhpX1rj8D+ixr72Vj48oDo1Tdl4jGT1BAc6K43sStpXAX2mHgLNAML7Z7iZbR4/8wAsZAXoe+K521Zr25OJc1Luhusqn1bn1eyU3dwK30dhUCGFF5+3oWn01Sdq1fNO11NVnYCc+w+HyeWQ/1Klw7iSVtBsec2cZj7y3BLYnxz85sMUTLzcM6XB4vuX/NRn6TxG5Xysu2kBjeKGcGjXYfDLiIheKQT+KBwHOPzZDX0HxfLtRuHw2stSXrE2elBMl2sX/7KLj3gp9/NFryUQrJ/Tcl+N63StRf4N9dyidwn1rCbfjT2Y8O+DddxNxekofMG1x2O1+2l8mEKCczWB9Qkof5Stwe7B2ZvoWu3kAJ3Pokr3PE04oWYAxQmdDq7pxWpz5VZ2Va/cKZZcxm9ipz+4hzxLjxI/3/+qYUXX/f9UyreorYoQ/eVw5Tpc/lzqjrgCP++ZyA0X8+H4HbH57KulomCgAA",
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
WELCOME: process.env.WELCOME || "false",
GOODBYE: process.env.GOODBYE || "false",
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/1s0tu5.jpg",
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
ANTI_DELETE: process.env.ANTI_DELETE || "true",
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",     
};


    
 
