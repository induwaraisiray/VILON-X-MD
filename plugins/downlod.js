"use strict";

/**
 * Fixed Command Pack
 * - Consistent axios/fetchJson usage
 * - Cheerio import for MediaFire
 * - Safe error handling + reactions
 * - Removed undefined variables
 * - Safer null checks
 */

const axios = require("axios").create({
  timeout: 25000,
  maxRedirects: 5,
});
const cheerio = require("cheerio");
const { cmd } = require("../command");
const config = require("../config");
const { fetchJson } = require("../lib/functions");
const API_URL = "https://facebook-downloader.apis-bj-devs.workers.dev/"; // Current API URL
const api = `https://nethu-api-ashy.vercel.app`;

// Helpers
const isHttpUrl = (u) => typeof u === "string" && /^https?:\/\//i.test(u || "");
const safe = (v, d = null) => (v === undefined || v === null ? d : v);

cmd(
  {
    pattern: "fb",
    alias: ["facebook"],
    react: "🎬",
    category: "download",
    desc: "Download Facebook videos (HD or SD) with thumbnail and extra info",
    filename: __filename,
  },
  async (
    robin,
    m,
    mek,
    { from, q, reply }
  ) => {
    try {
      console.log("Received Facebook URL:", q);

      if (!q || q.trim() === "") {
        console.log("No URL provided by user");
        return await reply("*🎬 Please provide a valid Facebook video URL!*");
      }

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb|m\.facebook|fb\.watch)\.com\/(?:(?:share|videos|watch|video|reel|post|live|stories|groups)\/.+|(?:u\/\d+|user\/\d+|profile\.php\?id=\d+)|(?:photo\.php\?fbid=\d+)|(?:permalink\.php\?story_fbid=\d+&id=\d+))+/i;
      if (!fbRegex.test(q)) {
        console.log("Invalid Facebook URL provided:", q);
        return await reply("*❌ Invalid Facebook URL! Please provide a valid link (e.g., facebook.com/videos, fb.watch, facebook.com/share, etc.).* ❄️");
      }

      await reply("*⏳ Fetching video details, please wait...*️");

      const apiUrl = `${API_URL}?url=${encodeURIComponent(q)}`;
      console.log("API Request URL:", apiUrl);

      const response = await axios.get(apiUrl, { timeout: 15000 });

      console.log("API Response:", JSON.stringify(response.data, null, 2));

      if (!response.data) {
        console.log("No API response received");
        return await reply("*❌ No response from API. The service might be down. Try again later.* ❄️");
      }

      const apiStatus = response.data.status === true;

      if (!apiStatus) {
        console.log("API reported failure, Response:", response.data);
        let errorMsg = "*❌ Failed to fetch video details.* ⚡";
        if (response.data.message) {
          errorMsg += `\nReason: ${response.data.message}`;
        } else {
          errorMsg += "\nThe video might be private, restricted, or the URL is invalid. Please check the URL and try again.";
        }
        return await reply(errorMsg);
      }

      const videoData = {
        ...response.data.data,
        poweredBy: "Frozen MD",
        status: apiStatus
      };

      console.log("Video Data:", JSON.stringify(videoData, null, 2));

      if (videoData.url) {
        console.log("Single video found, URL:", videoData.url);

        let caption = `*🎬 Facebook Video*\n`;
        let videoUrlToSend = videoData.url; // Default to HD or available quality

        // Check if SD quality is available (assuming API might return multiple qualities)
        if (videoData.qualities && Array.isArray(videoData.qualities)) {
          const sdQuality = videoData.qualities.find(q => q.quality === "SD");
          if (sdQuality && sdQuality.url) {
            videoUrlToSend = sdQuality.url; // Use SD if available
            caption += `📌 Quality: SD\n`;
          } else if (videoData.quality) {
            caption += `📌 Quality: ${videoData.quality}\n`;
          }
        } else if (videoData.quality) {
          caption += `📌 Quality: ${videoData.quality}\n`;
        }

        caption += `${config.DESCRIPTION}`;

        if (videoData.thumbnail) {
          await robin.sendMessage(
            from,
            {
              image: { url: videoData.thumbnail },
              caption: "*🎬 Facebook Video Thumbnail*\n*⏳ Video will be sent next...*",
            },
            { quoted: mek }
          );
        }

        await robin.sendMessage(
          from,
          {
            video: { url: videoUrlToSend },
            caption: caption,
          },
          { quoted: mek }
        );
      } else {
        console.log("No video URL found in response:", response.data);
        return await reply("*❌ No video URL found in the response. The video might be private or not available.* ⚡");
      }

    } catch (e) {
      console.error("Error downloading FB video:", e.message, e.stack);
      if (e.code === "ECONNABORTED") {
        return await reply("*❌ Timeout: The server took too long to respond. Please try again later.* ⚡");
      } else if (e.response && e.response.data) {
        return await reply(`*❌ Error:* ${e.response.data.message || "API error occurred. Try again later."} ⚡`);
      } else {
        return await reply(`*❌ Error:* ${e.message || "Something went wrong while downloading the video. Try again later."} ⚡`);
      }
    }
  }
);

// Handle button response (removed since we are handling single video directly now)
cmd(
  {
    pattern: "fb_quality",
    dontAddCommandList: true, // Hide from command list
  },
  async (
    robin,
    mek,
    m,
    { from, reply }
  ) => {
    try {
      console.log("Button interaction received for user:", m.sender, "Button ID:", m.id);
      await reply("*❌ This command is no longer needed. Use !fb directly with the video URL.* ❄️");

    } catch (e) {
      console.error("Error in fb_quality command:", e.message, e.stack);
      await reply("*❌ Error processing your request. Please try again.* ❄️");
    }
  }
);

/* ======================= FACEBOOK DOWNLOADER ======================= */
cmd(
  {
    pattern: "facebook",
    react: "🎥",
    alias: ["fbb", "fbvideo", "fb"],
    desc: "Download videos from Facebook",
    category: "download",
    use: ".facebook <facebook_url>",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!isHttpUrl(q)) return reply("🚩 Please give me a valid Facebook URL.");

      const fb = await fetchJson(
        `${api}/download/fbdown?url=${encodeURIComponent(q)}`
      ).catch(() => null);

      const res = fb?.result || {};
      const sd = res.sd;
      const hd = res.hd;
      const thumb = res.thumb;

      if (!sd && !hd) return reply("I couldn't find anything :(");

      const caption = `${config.DESCRIPTION}\n\n📝 ᴛɪᴛʟᴇ : Facebook video\n🔗 ᴜʀʟ : ${q}`;

      if (thumb && isHttpUrl(thumb)) {
        await conn.sendMessage(
          from,
          { image: { url: thumb }, caption },
          { quoted: mek }
        );
      }

      if (sd && isHttpUrl(sd)) {
        await conn.sendMessage(
          from,
          { video: { url: sd }, mimetype: "video/mp4", caption: `*SD-Quality*` },
          { quoted: mek }
        );
      }

      if (hd && isHttpUrl(hd)) {
        await conn.sendMessage(
          from,
          { video: { url: hd }, mimetype: "video/mp4", caption: `*HD-Quality*` },
          { quoted: mek }
        );
      }
    } catch (err) {
      console.error("facebook:", err);
      reply("*ERROR*");
    }
  }
);

/* ======================= TIKTOK DOWNLOADER ======================= */
cmd(
  {
    pattern: "tiktok",
    react: "📱",
    desc: "Download TikTok Video (No Watermark)",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("Ex: `.tiktok https://vm.tiktok.com/XYZ123`");
      if (!q.includes("tiktok.com")) return reply("❌ Invalid TikTok URL.");

      const API_URL = `https://www.tikwm.com/api/?url=${encodeURIComponent(q)}`;
      const { data: result } = await axios.get(API_URL);

      if (result.code !== 0 || !result.data?.play) {
        return reply("❌ Couldn't fetch video. Try again later.");
      }

      const videoUrl = result.data.play;
      const title = result.data.title || "TikTok Video";
      const author = result.data.author?.nickname || "Unknown";

      const caption =
        `*🪄 TIKTOK DOWNLOADER 🪄*\n\n` +
        `🎥 *Title*: ${title}\n` +
        `👤 *Author*: ${author}\n` +
        `🔗 *URL*: ${q}\n\n` +
        `> ${config.DESCRIPTION}*`;

      await conn.sendMessage(
        from,
        { video: { url: videoUrl }, caption, mimetype: "video/mp4" },
        { quoted: mek }
      );
    } catch (e) {
      console.error("tiktok:", e);
      reply(`❌ Error: ${e.message || "Something went wrong."}`);
    }
  }
);

cmd(
  {
    pattern: "tiktokwm",
    react: "💦",
    desc: "Download TikTok Video (With Watermark)",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("Ex: `.tiktokwm https://vm.tiktok.com/XYZ123`");
      if (!q.includes("tiktok.com")) return reply("❌ Invalid TikTok URL.");

      const API_URL = `https://www.tikwm.com/api/?url=${encodeURIComponent(q)}`;
      const { data: result } = await axios.get(API_URL);

      if (result.code !== 0 || !result.data?.wmplay) {
        return reply("❌ Couldn't fetch watermarked video.");
      }

      await conn.sendMessage(
        from,
        {
          video: { url: result.data.wmplay },
          caption: `*🫦 TikTok Watermarked Video 🫦*\n👤 Author: ${safe(
            result.data.author?.nickname,
            "Unknown"
          )}`,
          mimetype: "video/mp4",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("tiktokwm:", e);
      reply(`❌ Error: ${e.message || "Something went wrong."}`);
    }
  }
);

cmd(
  {
    pattern: "tiktokaudio",
    react: "🎵",
    desc: "Download TikTok Audio",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("Ex: `.tiktokaudio https://vm.tiktok.com/XYZ123`");
      if (!q.includes("tiktok.com")) return reply("❌ Invalid TikTok URL.");

      const API_URL = `https://www.tikwm.com/api/?url=${encodeURIComponent(q)}`;
      const { data: result } = await axios.get(API_URL);

      if (result.code !== 0 || !result.data?.music) {
        return reply("❌ Couldn't fetch TikTok audio.");
      }

      const title = result.data.music_info?.title || "TikTok Audio";
      const author =
        result.data.music_info?.author ||
        result.data.author?.nickname ||
        "Unknown";

      await conn.sendMessage(
        from,
        {
          audio: { url: result.data.music },
          mimetype: "audio/mp4",
          fileName: `${title.replace(/[^\w\s]/gi, "")}.mp3`,
          caption: `*🎵 TikTok Audio 🎵*\n🎵 Title: ${title}\n👤 Artist: ${author}`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("tiktokaudio:", e);
      reply(`❌ Error: ${e.message || "Something went wrong."}`);
    }
  }
);

/* ======================= YOUTUBE POST ======================= */
cmd(
  {
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!isHttpUrl(q))
        return reply("Please provide a valid YouTube community post URL.");

      const { data } = await axios.get(
        `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`
      );

      if (!data?.status || !data?.data) {
        return reply("Failed to fetch the community post.");
      }

      const post = data.data;
      let caption = `📢 *YouTube Community Post* 📢\n\n📜 *Content:* ${safe(
        post?.content,
        "-"
      )}`;

      const imgs = Array.isArray(post?.images) ? post.images : [];
      if (imgs.length > 0) {
        for (const img of imgs) {
          if (!isHttpUrl(img)) continue;
          await conn.sendMessage(
            from,
            { image: { url: img }, caption },
            { quoted: mek }
          );
          caption = "";
        }
      } else {
        await conn.sendMessage(from, { text: caption }, { quoted: mek });
      }
    } catch (e) {
      console.error("ytpost:", e);
      reply("❌ Error fetching the YouTube community post.");
    }
  }
);

/* ======================= APK DOWNLOADER ======================= */
cmd(
  {
    pattern: "apk",
    desc: "Download APK from Aptoide.",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("❌ Please provide an app name.");

      const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(
        q
      )}/limit=1`;
      const { data } = await axios.get(apiUrl);

      const list = data?.datalist?.list;
      if (!Array.isArray(list) || list.length === 0) {
        return reply("⚠️ No results found.");
      }

      const app = list[0];
      const appSize = app?.size ? (app.size / 1048576).toFixed(2) : "N/A";
      const apkUrl = app?.file?.path_alt || app?.file?.path;

      if (!isHttpUrl(apkUrl)) return reply("⚠️ APK file not available.");

      const caption = `📦 *Name:* ${safe(app?.name, "-")}\n🏋️ *Size:* ${appSize} MB\n📦 *Package:* ${safe(
        app?.package,
        "-"
      )}`;

      if (isHttpUrl(app?.icon)) {
        await conn.sendMessage(
          from,
          { image: { url: app.icon }, caption },
          { quoted: mek }
        );
      } else {
        await reply(caption);
      }

      await conn.sendMessage(
        from,
        {
          document: {
            url: apkUrl,
            fileName: `${safe(app?.name, "app")}.apk`,
            mimetype: "application/vnd.android.package-archive",
          },
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("apk:", e);
      reply("❌ Error fetching APK.");
    }
  }
);

/* ======================= GOOGLE DRIVE ======================= */
cmd(
  {
    pattern: "gdrive",
    desc: "Download Google Drive files.",
    react: "🌐",
    category: "download",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!isHttpUrl(q)) return reply("❌ Please provide a valid Drive link.");

      const { data } = await axios.get(
        `https://api.fgmods.xyz/api/downloader/gdrive?url=${encodeURIComponent(
          q
        )}&apikey=mnp3grlZ`
      );

      const dl = data?.result;
      if (!isHttpUrl(dl?.downloadUrl)) {
        return reply("⚠️ No download URL found.");
      }

      await conn.sendMessage(
        from,
        {
          document: {
            url: dl.downloadUrl,
            mimetype: safe(dl.mimetype, "application/octet-stream"),
            fileName: safe(dl.fileName, "gdrive_file"),
          },
          caption: "${config.DESCRIPTION}",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("gdrive:", e);
      reply("❌ Error fetching Drive file.");
    }
  }
);

/* ======================= GITHUB ======================= */
cmd(
  {
    pattern: "gitclone",
    alias: ["git", "getrepo"],
    desc: "Download GitHub repo as zip.",
    react: "📦",
    category: "downloader",
    filename: __filename,
  },
  async (conn, mek, m, { from, args, reply }) => {
    try {
      const link = args?.[0];
      if (!/^https?:\/\/github\.com\/.+/i.test(link || "")) {
        return reply("⚠️ Invalid GitHub link.");
      }

      const match = link.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git|\/|$)/i);
      if (!match) return reply("⚠️ Invalid GitHub URL.");

      const [, username, repo] = match;
      const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

      const head = await axios.head(zipUrl).catch(() => ({ headers: {} }));
      const cd =
        head?.headers?.["content-disposition"] ||
        head?.headers?.["Content-Disposition"];
      const fileName =
        (cd && (cd.match(/filename="?([^"]+)"?/) || [])[1]) || `${repo}.zip`;

      await conn.sendMessage(
        from,
        {
          document: { url: zipUrl },
          fileName,
          mimetype: "application/zip",
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("gitclone:", e);
      reply("❌ Failed to download repository.");
    }
  }
);

/* ======================= MEDIAFIRE ======================= */
cmd(
  {
    pattern: "mediafire",
    alias: ["mfire"],
    desc: "Download Mediafire files",
    category: "download",
    react: "📩",
    filename: __filename,
  },
  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q || !q.startsWith("https://")) {
        return reply("❌ Please provide a valid Mediafire URL.");
      }

      const { data: html } = await axios.get(q);
      const $ = cheerio.load(html);

      const fileName = $(".dl-info > div > div.filename").text().trim();
      const downloadUrl = $("#downloadButton").attr("href");
      const fileType = $(".dl-info > div > div.filetype").text().trim();
      const fileSize = $(".dl-info ul li:nth-child(1) > span").text().trim();
      const fileDate = $(".dl-info ul li:nth-child(2) > span").text().trim();

      if (!fileName || !downloadUrl) {
        return reply("⚠️ Failed to extract Mediafire info.");
      }

      let mimeType = "application/octet-stream";
      const ext = fileName.split(".").pop().toLowerCase();
      const mimeTypes = {
        zip: "application/zip",
        pdf: "application/pdf",
        mp4: "video/mp4",
        mkv: "video/x-matroska",
        mp3: "audio/mpeg",
        "7z": "application/x-7z-compressed",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        rar: "application/x-rar-compressed",
      };
      if (mimeTypes[ext]) mimeType = mimeTypes[ext];

      await conn.sendMessage(
        from,
        {
          document: { url: downloadUrl },
          fileName,
          mimetype: mimeType,
          caption: `📄 *${fileName}*\n📁 Type: ${fileType}\n📦 Size: ${fileSize}\n📅 Uploaded: ${fileDate}`,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.error("mediafire:", e);
      reply("❌ Error while processing Mediafire link.");
    }
  }
);

/* ======================= GOOGLE IMAGE ======================= */
cmd({
  pattern: "img",
  alias: ["aiimg3", "bingimage"],
  desc: "Search for images using Bing and send 5 results.",
  category: "utility",
  react: "📷",
  use: ".img <query>",
  filename: __filename,
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) {
      return reply("❌ Please provide a search query. Example: `.img dog`");
    }

    // Fetch images from the Bing Image Search API
    const response = await axios.get(`https://api.siputzx.my.id/api/s/bimg?query=${encodeURIComponent(query)}`);
    const { status, data } = response.data;

    if (!status || !data || data.length === 0) {
      return reply("❌ No images found for the specified query. Please try again.");
    }

    // Select the first 5 images
    const images = data.slice(0, 5);

    // Send each image as an attachment
    for (const imageUrl of images) {
      await conn.sendMessage(from, {
        image: { url: imageUrl }, // Attach the image
        caption: `🔍 *Google Image Search*: ${query}`,
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    reply("❌ Unable to fetch images. Please try again later.");
  }
});

    
