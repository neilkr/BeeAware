// Shared voice engine: kid-style TTS plus user-recorded custom voice slots
// Same agent as EverClear-Care, with bee-safety voice slots.

export const VOICE_SLOTS = [
  { id: "hiveSpotted", label: "Hive Spotted", script: "You found a beehive! Stay calm, keep your distance, and do not touch it. Let's call a beekeeper together." },
  { id: "stayCalm", label: "Bee Near You", script: "A bee is near you. Stay still and breathe slowly. Do not swat. The bee is just exploring and will fly away soon." },
  { id: "beekeeperCalled", label: "Beekeeper Called", script: "Great job! You called the beekeeper. Keep people and pets away from the hive until they arrive." },
  { id: "showNumber", label: "Show Phone Number", script: "Here is the beekeeper's phone number. Type it into your phone and give them a call!" },
  { id: "swarmSafety", label: "Swarm Safety", script: "You see a swarm of bees. Walk away slowly and calmly. Swarms are usually gentle, but give them lots of space." },
  { id: "thankYou", label: "Thank You", script: "Thank you for protecting the bees! Every hive you report helps pollinators and your neighborhood." },
  { id: "recordingStart", label: "Recording Started", script: "Recording has started. Speak clearly, then tap stop when you are done." },
];

function pickKidVoice() {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const kidKeywords = ["child", "kid", "junior", "young"];
  const femaleKeywords = ["female", "girl", "samantha", "zira", "victoria", "karen", "moira", "tessa"];
  return (
    voices.find((v) => kidKeywords.some((k) => v.name.toLowerCase().includes(k))) ||
    voices.find((v) => femaleKeywords.some((k) => v.name.toLowerCase().includes(k))) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    voices[0]
  );
}

export function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.8;
    const kidVoice = pickKidVoice();
    if (kidVoice) utterance.voice = kidVoice;
    window.speechSynthesis.speak(utterance);
  }
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

export function playDataUrl(dataUrl) {
  const audio = new Audio(dataUrl);
  return audio.play();
}

export function getSlotRecording(slotId) {
  return localStorage.getItem(`bee_voice_slot_${slotId}`);
}

export function saveSlotRecording(slotId, dataUrl) {
  localStorage.setItem(`bee_voice_slot_${slotId}`, dataUrl);
}

export function deleteSlotRecording(slotId) {
  localStorage.removeItem(`bee_voice_slot_${slotId}`);
}

// Plays the user's custom recording for this slot when present, else kid TTS
export function playVoice(slotId, fallbackText) {
  const rec = getSlotRecording(slotId);
  if (rec) {
    playDataUrl(rec).catch(() => speak(fallbackText));
  } else {
    speak(fallbackText);
  }
}
