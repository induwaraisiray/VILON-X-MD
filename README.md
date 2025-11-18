<!-- ==============================
🌐 INDUWARA-MD OFFICIAL README
Theme: Blue Neon Glow ✨
============================== -->
<p align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Black+Ops+One&size=100&pause=1000&color=FF0000&center=true&width=1000&height=200&lines=VILON-X-MD+NEW;THE+ULTIMATE+WHATSAPP+BOT;CREATED+BY+ISIRA" alt="Typing SVG" />
  </a>
</p>

---

<p align="center">
  <a href="#"><img src="https://files.catbox.moe/1s0tu5.jpg" width="100%"></a>
</p>

<h1 align="center">💎 VILON-X-MD 💎</h1>
<h3 align="center">⚡ Advanced Multi-Device WhatsApp Bot ⚡</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Language-Node.js-blue?style=for-the-badge&logo=node.js&logoColor=white">
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge">
</p>

---

## 💬 About VILON-X-MD

**VILON-X-MD** is a fast, powerful and modern **WhatsApp Multi-Device Bot**  
developed to make automation, group moderation, and fun easy — all in one bot.

🧠 Features like AI Chat, Auto-Reply, Downloaders, Stickers, and Group Tools  
make it the perfect all-in-one MD bot for users and devs alike!

---

## 🚀 Main Features

✅ AI Chat (Text + Voice Reply)  
✅ Auto Sticker + Auto Reaction  
✅ YouTube / TikTok / Facebook Downloader  
✅ Group Management Tools  
✅ Owner Commands  
✅ Fun & Anime Menu  
✅ News Updates / Time & Weather  
✅ Auto System Uptime & Runtime Display  

---

## ⚙️ Setup & Deployment

### 🪄 Pairing Code (Session ID)
> Click below to get your **VILON-X-MD**Pair Code 👇

<p align="left">
<a href="https://khanmd-pair.onrender.com/" target="_blank">
  <img alt="Pair Code" src="https://img.shields.io/badge/Get%20Pairing%20Code-0066FF?style=for-the-badge&logo=whatsapp&logoColor=white"/>
</a>
</p>

---

### 🚀 Deploy Options

#### 🔹 Deploy on **Heroku**
<p align="left">
<a href="https://dashboard.heroku.com/new?template=https://github.com/induwaraisiray/VILON-X-MD" target="_blank">
  <img alt="Deploy on Heroku" src="https://img.shields.io/badge/Deploy%20on-Heroku-1877F2?style=for-the-badge&logo=heroku&logoColor=white"/>
</a>
</p>

#### 🔹 Deploy on **Koyeb**
<p align="left">
<a href="https://app.koyeb.com/services/deploy?type=git&repository=induwaraisiray/VILON-X-MD&ports=3000" target="_blank">
  <img alt="Deploy on Koyeb" src="https://img.shields.io/badge/Deploy%20on-Koyeb-00BFFF?style=for-the-badge&logo=koyeb&logoColor=white"/>
</a>
</p>

#### 🔹 Deploy on **Render**
<p align="left">
<a href="https://render.com/deploy?repo=https://github.com/induwaraisiray/VILON-X-MD" target="_blank">
  <img alt="Deploy on Render" src="https://img.shields.io/badge/Deploy%20on-Render-007FFF?style=for-the-badge&logo=render&logoColor=white"/>
</a>
</p>

---

## 🧠 GitHub Actions (Auto Run Workflow)


```
name: Node.js CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}

    - name: Install dependencies
      run: npm install

    - name: Start application
      run: npm start 
```
