import { VOICE_SLOTS, speak, playVoice } from "./voice.js";
import { SAMPLE_BEEKEEPERS, LEVEL_LABELS, HIVE_STEPS, BEE_FACTS, BEE_PLANTS, ZIP_COORDS } from "./data.js";

const STORAGE_KEY = "bee_aware_beekeepers";

/* ---------- Beekeeper directory ---------- */

function getBeekeepers() {
  let custom = [];
  try {
    custom = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    custom = [];
  }
  return [...custom, ...SAMPLE_BEEKEEPERS];
}

/* ---------- ZIP distance sorting ---------- */

function haversineMiles([lat1, lon1], [lat2, lon2]) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Distance in miles, or null when we can't locate one of the ZIPs
function zipDistanceMiles(zipA, zipB) {
  const a = ZIP_COORDS[zipA];
  const b = ZIP_COORDS[zipB];
  if (a && b) return haversineMiles(a, b);
  if (zipA && zipB && zipA.slice(0, 3) === zipB.slice(0, 3)) return 25; // same regional prefix
  return null;
}

function renderDirectory(sortZip = null) {
  const list = document.getElementById("beekeeper-list");
  const count = document.getElementById("beekeeper-count");
  let keepers = getBeekeepers();

  if (sortZip) {
    keepers = keepers
      .map((bk) => ({ ...bk, distance: zipDistanceMiles(sortZip, bk.zip) }))
      .sort((x, y) => (x.distance ?? Infinity) - (y.distance ?? Infinity));
  }

  count.textContent = `${keepers.length} beekeeper${keepers.length === 1 ? "" : "s"} ready to help`;
  list.innerHTML = "";

  keepers.forEach((bk) => {
    const card = document.createElement("div");
    card.className = "keeper-card";

    const info = document.createElement("div");
    info.className = "keeper-info";

    const name = document.createElement("strong");
    name.className = "keeper-name";
    name.textContent = bk.name;

    const level = document.createElement("span");
    level.className = `keeper-level level-${bk.level}`;
    level.textContent = LEVEL_LABELS[bk.level] || bk.level;

    const meta = document.createElement("p");
    meta.className = "keeper-meta";
    meta.textContent = `📍 ${bk.city} ${bk.zip} · ${bk.specialty}`;

    const dist = document.createElement("span");
    if (bk.distance != null) {
      const miles = bk.distance < 1 ? "<1" : Math.round(bk.distance).toLocaleString();
      dist.className = "keeper-distance";
      dist.textContent = `📏 ${miles} mi away`;
    } else if (sortZip) {
      dist.className = "keeper-distance distance-unknown";
      dist.textContent = "📏 distance unknown";
    } else {
      dist.className = "keeper-distance distance-hint";
      dist.textContent = "📏 enter your ZIP to see miles";
    }

    info.append(name, level, meta, dist);

    const actions = document.createElement("div");
    actions.className = "keeper-actions";

    const call = document.createElement("button");
    call.type = "button";
    call.className = "btn btn-call";
    call.textContent = `📞 Call`;
    call.title = "Get this beekeeper's phone number";
    call.addEventListener("click", () => openContactModal(bk, "call"));

    const text = document.createElement("button");
    text.type = "button";
    text.className = "btn btn-text";
    text.textContent = "💬 Text";
    text.title = "Get texting instructions for this beekeeper";
    text.addEventListener("click", () => openContactModal(bk, "text"));

    const msgBtn = document.createElement("button");
    msgBtn.type = "button";
    msgBtn.className = "btn btn-message";
    msgBtn.textContent = "✉️ Message";
    msgBtn.title = "Send a message from this site";
    msgBtn.addEventListener("click", () => openMessageModal(bk));

    actions.append(call, text, msgBtn);
    card.append(info, actions);
    list.appendChild(card);
  });
}

/* ---------- Contact modal (call / text) ---------- */

function openContactModal(bk, mode) {
  const modal = document.getElementById("contact-modal");
  const title = document.getElementById("contact-title");
  const number = document.getElementById("contact-number");
  const instructions = document.getElementById("contact-instructions");
  const openApp = document.getElementById("contact-open-app");
  const copyBtn = document.getElementById("contact-copy");
  const confirm = document.getElementById("contact-confirm");

  const digits = bk.phone.replace(/[^0-9+]/g, "");
  const prefilled = `Hi ${bk.name}! I found a beehive near my home and need help. I found you on BeeAware.`;

  number.textContent = bk.phone;
  confirm.hidden = true;
  copyBtn.textContent = "📋 Copy Number";

  if (mode === "call") {
    title.textContent = `📞 Call ${bk.name}`;
    instructions.textContent =
      "Type this number into your phone and give them a call. On a mobile device, you can also tap the button below to open your phone app.";
    openApp.textContent = "📱 Open Phone App";
    openApp.href = `tel:${digits}`;
    playVoice("showNumber", VOICE_SLOTS.find((s) => s.id === "showNumber").script);
  } else {
    title.textContent = `💬 Text ${bk.name}`;
    instructions.textContent =
      "Type this number into your phone's messaging app and send them a text. On a mobile device, tap the button below to open your texting app with a message already written.";
    openApp.textContent = "📱 Open Texting App";
    openApp.href = `sms:${digits}?&body=${encodeURIComponent(prefilled)}`;
    playVoice("showNumber", VOICE_SLOTS.find((s) => s.id === "showNumber").script);
  }

  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(digits);
      copyBtn.textContent = "✅ Copied!";
    } catch {
      copyBtn.textContent = "📋 Copy failed — long-press the number";
    }
  };

  openApp.onclick = () => {
    confirm.textContent =
      mode === "call"
        ? `Opening your phone app... If nothing happened, dial ${bk.phone} manually. Once you've called, keep people and pets away from the hive until ${bk.name} arrives. 🐝`
        : `Opening your texting app... If nothing happened, text ${bk.phone} manually from your phone. 🐝`;
    confirm.hidden = false;
    if (mode === "call") {
      playVoice("beekeeperCalled", VOICE_SLOTS.find((s) => s.id === "beekeeperCalled").script);
    }
  };

  modal.hidden = false;
}

function setupContactModal() {
  const modal = document.getElementById("contact-modal");
  document.getElementById("contact-close").addEventListener("click", () => {
    modal.hidden = true;
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.hidden = true;
  });
}

/* ---------- Message modal ---------- */

function openMessageModal(bk) {
  const modal = document.getElementById("message-modal");
  const title = document.getElementById("message-title");
  const form = document.getElementById("message-form");
  const note = document.getElementById("message-note");
  const confirm = document.getElementById("message-confirm");

  title.textContent = `✉️ Message ${bk.name}`;
  confirm.hidden = true;
  form.hidden = false;
  form.reset();
  form.elements.message.value =
    "Hi! I found a beehive in my yard. Could you help me remove it safely?";

  note.textContent = bk.email
    ? `This opens your email app addressed to ${bk.email}. Prefer to talk? Call ${bk.phone}.`
    : `This beekeeper prefers phone or text: ${bk.phone}.`;

  form.onsubmit = (e) => {
    e.preventDefault();
    const sender = form.elements.sender.value.trim();
    const message = form.elements.message.value.trim();
    if (sender.length < 2) return;
    if (message.length < 5) return;

    if (bk.email) {
      const subject = encodeURIComponent(`🐝 Hive help request via BeeAware — from ${sender}`);
      const body = encodeURIComponent(`${message}\n\n— ${sender} (sent via BeeAware)`);
      window.location.href = `mailto:${bk.email}?subject=${subject}&body=${body}`;
    }

    confirm.textContent = bk.email
      ? `Your email app should now open with your message to ${bk.name}. If nothing happened, call or text ${bk.phone} instead. 🐝`
      : `Please call or text ${bk.name} at ${bk.phone} — they don't have email listed. 🐝`;
    confirm.hidden = false;
    form.hidden = true;
    playVoice("beekeeperCalled", VOICE_SLOTS.find((s) => s.id === "beekeeperCalled").script);
  };

  modal.hidden = false;
}

function setupMessageModal() {
  const modal = document.getElementById("message-modal");
  document.getElementById("message-close").addEventListener("click", () => {
    modal.hidden = true;
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") modal.hidden = true;
  });
}

/* ---------- Registration ---------- */

function setupForm() {
  const form = document.getElementById("register-form");
  const msg = document.getElementById("register-msg");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const city = form.elements.city.value.trim();
    const zip = form.elements.zip.value.trim();
    const level = form.elements.level.value;
    const specialty = form.elements.specialty.value.trim() || "General beekeeping help";

    if (name.length < 2) return showMsg(msg, "Please enter your name.", false);
    if (!/^[0-9+\-() ]{7,20}$/.test(phone)) return showMsg(msg, "Please enter a valid phone number (digits, dashes, spaces).", false);
    if (city.length < 2) return showMsg(msg, "Please enter your city or area.", false);
    if (!/^\d{5}$/.test(zip)) return showMsg(msg, "Please enter a valid 5-digit ZIP code.", false);

    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (custom.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
      return showMsg(msg, "That name is already registered.", false);
    }
    custom.push({ name, phone, city, zip, level, specialty });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));

    form.reset();
    showMsg(msg, `Welcome aboard, ${name}! You're now listed in the directory. 🐝`, true);
    playVoice("thankYou", VOICE_SLOTS.find((s) => s.id === "thankYou").script);
    renderDirectory();
  });
}

function showMsg(el, text, ok) {
  el.textContent = text;
  el.className = `form-msg ${ok ? "msg-ok" : "msg-err"}`;
  el.hidden = false;
}

/* ---------- Precaution steps ---------- */

function renderSteps() {
  const wrap = document.getElementById("steps-list");
  HIVE_STEPS.forEach((step, i) => {
    const card = document.createElement("div");
    card.className = "step-card";

    const num = document.createElement("span");
    num.className = "step-num";
    num.textContent = i + 1;

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = `${step.emoji} ${step.title}`;
    const text = document.createElement("p");
    text.textContent = step.text;
    body.append(title, text);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-hear";
    btn.textContent = "🔊 Hear it";
    btn.addEventListener("click", () => playVoice(step.slot, step.text));

    card.append(num, body, btn);
    wrap.appendChild(card);
  });
}

/* ---------- Info sections ---------- */

function renderFacts() {
  const wrap = document.getElementById("facts-grid");
  BEE_FACTS.forEach((f) => {
    const card = document.createElement("div");
    card.className = "info-card";
    const emoji = document.createElement("span");
    emoji.className = "info-emoji";
    emoji.textContent = f.emoji;
    const title = document.createElement("h3");
    title.textContent = f.title;
    const text = document.createElement("p");
    text.textContent = f.text;
    card.append(emoji, title, text);
    wrap.appendChild(card);
  });
}

function renderPlants() {
  const wrap = document.getElementById("plants-grid");
  BEE_PLANTS.forEach((p) => {
    const card = document.createElement("div");
    card.className = "plant-card";
    const emoji = document.createElement("span");
    emoji.className = "info-emoji";
    emoji.textContent = p.emoji;
    const title = document.createElement("h3");
    title.textContent = p.name;
    const text = document.createElement("p");
    text.textContent = p.text;
    card.append(emoji, title, text);
    wrap.appendChild(card);
  });
}

/* ---------- ZIP search ---------- */

function setupZipSearch() {
  const input = document.getElementById("zip-input");
  const btn = document.getElementById("zip-btn");
  const msg = document.getElementById("zip-msg");

  function search() {
    const zip = input.value.trim();
    if (!/^\d{5}$/.test(zip)) {
      msg.textContent = "Please enter a valid 5-digit ZIP code.";
      msg.className = "zip-msg msg-err";
      msg.hidden = false;
      return;
    }
    renderDirectory(zip);
    const known = !!ZIP_COORDS[zip];
    msg.textContent = known
      ? `Showing beekeepers closest to ${zip} first. 🐝`
      : `Sorted by region for ${zip} (exact distance unavailable for this ZIP — regional estimate used where possible).`;
    msg.className = "zip-msg msg-ok";
    msg.hidden = false;
    speak("Here are the beekeepers closest to you. Call any of them and they will help!");
  }

  btn.addEventListener("click", search);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
}

/* ---------- Mobile nav ---------- */

function setupNav() {
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
    toggle.textContent = open ? "✖" : "☰";
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    })
  );
}

/* ---------- Init ---------- */

if (!("speechSynthesis" in window)) {
  document.getElementById("tts-warning").hidden = false;
}

setupNav();
renderSteps();
renderDirectory();
setupZipSearch();
setupForm();
setupMessageModal();
setupContactModal();
renderFacts();
renderPlants();
