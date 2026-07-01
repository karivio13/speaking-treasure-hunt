import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// Cambridge-style tasks per level
// ─────────────────────────────────────────────
const TASKS = {
  "A2+": [
    {
      title: "Part 1 · Personal Questions",
      intro:
        "In this part I'm going to ask you some questions about yourself and your everyday life.",
      examinerPrompt: `You are a friendly Cambridge A2 Key speaking examiner. Ask the student 2 simple personal questions (one at a time) about topics like hobbies, daily routines, family, or favourite things. Keep language simple and clear. After the student has responded to 2 questions, write [DONE] on its own line — nothing else after it.`,
    },
    {
      title: "Part 2 · Describing a Situation",
      intro:
        "I'm going to describe a situation. I'd like you to tell me what you would do.",
      examinerPrompt: `You are a Cambridge A2 Key speaking examiner. Present this situation: "Your friend is visiting your city for the first time this weekend. They ask you: 'What three things should I do or see?' Tell me your recommendations and why." Ask one follow-up question after their first response. After 2 student turns total, write [DONE] on its own line.`,
    },
    {
      title: "Part 3 · Photograph Description",
      intro:
        "Now I'd like you to look at this photograph and tell me what you can see.",
      imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&q=80",
      imageAlt: "People working together around a table in a bright office",
      examinerPrompt: `You are a Cambridge A2 Key speaking examiner. The student is looking at a photograph of people working together around a table in a bright, modern office. There are laptops, papers, and coffee cups on the table. Some people are smiling and pointing at a screen. Ask the student to describe what they can see — the people, the place, the objects, what is happening. Encourage them with simple follow-up questions like "What are the people doing?" or "How do they look?" if they get stuck. After 2 student turns, write [DONE] on its own line.`,
    },
  ],
  B1: [
    {
      title: "Part 1 · Topic Discussion",
      intro:
        "I'd like to talk with you about a topic. I'll ask you some questions and I'd like you to give me your opinions.",
      examinerPrompt: `You are a Cambridge B1 Preliminary speaking examiner. Ask the student about the topic of 'learning and education' — e.g. their favourite subject, how they prefer to study, what they find challenging. Ask one question at a time. After 3 student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 2 · Making a Decision",
      intro:
        "Now we're going to discuss a situation together and try to reach a decision.",
      examinerPrompt: `You are a Cambridge B1 Preliminary speaking examiner doing a collaborative task. Present this situation: "A student is choosing between two options for improving their English: (A) joining a weekly conversation club with other students, or (B) using an AI app to practise alone every day. Discuss both options with the student and try to agree on which is better." Engage genuinely — disagree if appropriate, ask for reasons. After 3 student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 3 · Photograph Description",
      intro:
        "I'd like you to look at this photograph. Please describe what you can see and say what you think the people are feeling.",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80",
      imageAlt: "Group of young people laughing and talking outdoors",
      examinerPrompt: `You are a Cambridge B1 Preliminary speaking examiner. The student is looking at a photograph of a group of young people laughing and talking together outdoors in what appears to be a park or campus area. They look relaxed and happy. Ask the student to describe what they see and speculate about the situation — who these people might be, what they could be talking about, how they are feeling and why. After their description, ask one follow-up: "Have you ever been in a similar situation? Tell me about it." After 3 student turns, write [DONE] on its own line.`,
    },
  ],
  "B2+": [
    {
      title: "Part 2 · Long Turn — Compare & Contrast",
      intro:
        "I'm going to describe two scenarios. I'd like you to compare them, say what the advantages and disadvantages might be, and then give your opinion.",
      examinerPrompt: `You are a Cambridge B2 First speaking examiner. Describe these two scenarios verbally: "Scenario A: A university student attends all their classes in person on campus. Scenario B: The same student studies entirely online from home." Ask the student to compare both, discuss advantages and disadvantages, and say which they think is more effective for learning. After their long turn (aim for 1 minute of speech), ask ONE follow-up question. After 2 student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 3 · Collaborative Task",
      intro:
        "Now I'd like you to discuss something with me and reach a decision together.",
      examinerPrompt: `You are a Cambridge B2 First speaking examiner. Present this scenario: "A university wants to improve student wellbeing. They can invest in ONE of the following: (1) a student counselling service, (2) more sports facilities, (3) a quiet study space open 24 hours, (4) free healthy food at the canteen, (5) a language exchange programme. Discuss the options with the student and agree on the MOST important one." Push back on their choices, ask for justification, suggest alternatives. After 3 student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 4 · Photograph Comparison",
      intro:
        "I'd like you to compare these two photographs, say what the people might be thinking or feeling, and discuss which situation you think is more challenging.",
      imageUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=700&q=80",
      imageAlt: "Teacher presenting to a classroom of students",
      imageUrl2: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=700&q=80",
      imageAlt2: "Person studying alone at a desk with books",
      examinerPrompt: `You are a Cambridge B2 First speaking examiner. The student is comparing two photographs: Photo 1 shows a teacher presenting to a classroom of engaged students. Photo 2 shows a person studying alone at a desk surrounded by books and notes, looking concentrated but perhaps tired. Ask the student to: (1) compare what is happening in each photo, (2) speculate about what the people might be thinking or feeling, and (3) say which situation they think requires more effort and why. After their long turn, ask ONE probing follow-up. After 2 student turns, write [DONE] on its own line.`,
    },
  ],
  C1: [
    {
      title: "Part 2 · Long Turn — Abstract Theme",
      intro:
        "I'd like you to talk on your own for about two minutes. I'm going to give you a topic and some prompts to help structure your ideas.",
      examinerPrompt: `You are a Cambridge C1 Advanced speaking examiner. Give the student this long-turn prompt: "Talk about the concept of IDENTITY in the modern world. You might consider: how language shapes identity, how social media affects how people present themselves, and whether it is possible to have a truly authentic identity today. You have about two minutes." After their response, ask TWO probing follow-up questions that challenge or deepen their argument. After 3 student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 3 · Discussion — Societal Topic",
      intro:
        "Now I'd like to discuss a broader topic with you.",
      examinerPrompt: `You are a Cambridge C1 Advanced speaking examiner. Discuss this question with the student: "To what extent does the education system prepare young people for the realities of adult life?" Engage as an intellectual interlocutor — challenge generalisations, ask for evidence, offer counterarguments. Expect precise vocabulary, hedging, and nuanced argument. After 3 substantial student turns, write [DONE] on its own line.`,
    },
    {
      title: "Part 4 · Visual Prompt — Thematic Discussion",
      intro:
        "I'd like you to look at this image and use it as a starting point for a discussion.",
      imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&q=80",
      imageAlt: "Child raising hand in a colourful, diverse classroom",
      examinerPrompt: `You are a Cambridge C1 Advanced speaking examiner. The student is looking at a photograph of a young child confidently raising their hand in a bright, diverse, and colourful primary school classroom. There are drawings and letters on the walls, and other children sit around them. Ask the student to use this image as a springboard to discuss broader themes — e.g. the role of confidence in learning, what makes an ideal learning environment, equity in education, or what is lost and gained as formal education progresses from childhood to adulthood. Push back on generalisations, demand evidence or examples, and introduce counterarguments. After 3 substantial turns, write [DONE] on its own line.`,
    },
  ],
};

// ─────────────────────────────────────────────
// Common Chilean EFL pronunciation patterns
// ─────────────────────────────────────────────
const CHILE_PHONETICS = `
Common pronunciation challenges for Chilean EFL speakers:
- /θ/ and /ð/ (think, this) → often replaced with /t/ or /d/
- /v/ → often pronounced as /b/ (very → "bery")
- /ɪ/ vs /iː/ (sit vs seat) → often both pronounced as long /iː/
- /æ/ (cat, that) → often pronounced as /e/
- Final consonant clusters → often dropped or simplified (asked → "ask")
- Word stress on wrong syllable (PHOtograph vs phoTOGraph)
- Schwa /ə/ → often pronounced as full vowel
- /ʤ/ (judge, gender) → sometimes replaced with /j/ or /ʒ/
`;

const LEVELS_INFO = {
  "A2+": "KET/A2 Key level — simple language, basic grammar, everyday vocabulary",
  B1: "PET/B1 Preliminary level — clear communication, some complexity, familiar topics",
  "B2+": "FCE/B2 First level — fluent communication, developed arguments, range of vocabulary",
  C1: "CAE/C1 Advanced level — sophisticated language, abstract topics, precision and nuance",
};

const TIMER_SECONDS = {
  "A2+": 45,
  B1: 60,
  "B2+": 90,
  C1: 120,
};

const COLORS = {
  "A2+": { bg: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9", dark: "#1b5e20" },
  B1: { bg: "#e3f2fd", accent: "#1565c0", light: "#bbdefb", dark: "#0d47a1" },
  "B2+": { bg: "#f3e5f5", accent: "#6a1b9a", light: "#e1bee7", dark: "#4a148c" },
  C1: { bg: "#fff3e0", accent: "#e65100", light: "#ffe0b2", dark: "#bf360c" },
};

// ─────────────────────────────────────────────
// Save session to localStorage
// ─────────────────────────────────────────────
function saveSession(session) {
  try {
    const existing = JSON.parse(localStorage.getItem("speaking_sessions") || "[]");
    existing.push(session);
    localStorage.setItem("speaking_sessions", JSON.stringify(existing));
  } catch {}
}

function getSessions() {
  try {
    return JSON.parse(localStorage.getItem("speaking_sessions") || "[]");
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────
// API call
// ─────────────────────────────────────────────
async function callClaude(messages, system, isFeedback = false) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, isFeedback }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Connection error — please try again.";
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | task | feedback | done | teacher
  const [name, setName] = useState("");
  const [level, setLevel] = useState("B1");
  const [difficultSounds, setDifficultSounds] = useState([]);
  const [otherSounds, setOtherSounds] = useState("");
  const [currentTask, setCurrentTask] = useState(0);
  const [phase, setPhase] = useState("speaking"); // speaking | ready | feedback
  const [messages, setMessages] = useState([]); // current task messages
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]); // {title, messages, feedback}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [interim, setInterim] = useState("");
  const [timeLeft, setTimeLeft] = useState(null);
  const [lastDuration, setLastDuration] = useState(null);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const [teacherPwd, setTeacherPwd] = useState("");
  const [teacherError, setTeacherError] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [expandedSession, setExpandedSession] = useState(null);
  const bottomRef = useRef(null);

  const colors = COLORS[level];
  const tasks = TASKS[level];
  const task = tasks?.[currentTask];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, feedbackMessages, loading]);

  // Auto-start the examiner's first message when entering a task
  useEffect(() => {
    if (screen === "task" && messages.length === 0 && task) {
      startTask();
    }
  }, [screen, currentTask]);

  async function startTask() {
    setLoading(true);
    const system = getTaskSystem();
    const initMessages = [{ role: "user", content: "Please begin the task." }];
    try {
      const reply = await callClaude(initMessages, system);
      const clean = reply.replace("[DONE]", "").trim();
      setMessages([
        { role: "user", content: "__init__" },
        { role: "assistant", content: clean },
      ]);
      if (reply.includes("[DONE]")) setPhase("ready");
    } catch {
      setMessages([{ role: "assistant", content: "Connection error — please refresh." }]);
    }
    setLoading(false);
  }

  function getTaskSystem() {
    const sounds = [
      ...difficultSounds,
      ...(otherSounds ? [otherSounds] : []),
    ].join(", ") || "not specified";

    const isFirst = currentTask === 0;

    return `${task.examinerPrompt}

Student name: ${name}
CEFR Level: ${level} (${LEVELS_INFO[level]})
Difficult sounds the student mentioned: ${sounds}

${isFirst ? `IMPORTANT — at the very start of your first message, add this brief note in italics (use *asterisks*): "*Note: I'm reading your typed or transcribed responses. If something I say seems off, it may be because a word wasn't captured correctly — just rephrase and try again!*" Then begin the task naturally.` : ""}

Adapt your vocabulary and complexity to ${level} level. Be professional but warm, exactly like a Cambridge examiner.`;
  }

  function getFeedbackSystem() {
    const sounds = [
      ...difficultSounds,
      ...(otherSounds ? [otherSounds] : []),
    ].join(", ") || "not specified";

    const conversation = messages
      .filter((m) => m.content !== "__init__")
      .map((m) => `${m.role === "user" ? name : "Examiner"}: ${m.content}`)
      .join("\n");

    return `You are an experienced Cambridge English speaking examiner giving structured written feedback.

Student: ${name}, Level: ${level}
Task: ${task.title}
Sounds the student finds difficult: ${sounds}
Approximate speaking time: ${lastDuration ? lastDuration + " seconds (target: " + TIMER_SECONDS[level] + "s)" : "not measured"}
${CHILE_PHONETICS}

Here is the full conversation from the task:
---
${conversation}
---

Give structured feedback using exactly these sections with emojis as headers:

✅ **Strengths**
Name 2 specific things the student did well — refer to actual things they said.

⏱️ **Response Length**
Comment on whether their speaking time was appropriate for ${level} level (target: ${TIMER_SECONDS[level]} seconds). If too short, encourage expansion. If too long, note what could be more concise. Be specific.

📝 **Grammar & Vocabulary**
Give 1-2 specific points to improve. Quote a phrase they used, then show the corrected or improved version. Keep it concrete.

🗣️ **Pronunciation Tips**
This is the MOST important section. Give 3 specific tips:
1. Based on the sounds they told you they find difficult — give a specific technique or minimal pair to practise
2. Based on common Chilean EFL patterns that likely apply to what they said in this task
3. A rhythm/stress tip based on specific words from their responses (show correct stress marking, e.g. phoTO·graph → PHO·to·graph)
Note: since you are reading a transcription, some errors may be transcription mistakes rather than grammar errors — flag this kindly if relevant.

⭐ **Overall**
One sentence of genuine encouragement + one specific action point for them to practise before the next task.

Keep the entire feedback under 200 words. Be warm, specific, and actionable.`;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await callClaude(
        newMessages.filter((m) => m.content !== "__init__"),
        getTaskSystem()
      );
      const isDone = reply.includes("[DONE]");
      const clean = reply.replace("[DONE]", "").trim();
      const updated = [...newMessages, { role: "assistant", content: clean }];
      setMessages(updated);
      if (isDone) setPhase("ready");
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Connection error — please try again." },
      ]);
    }
    setLoading(false);
  }

  async function getFeedback() {
    setPhase("feedback");
    setLoading(true);
    try {
      const fbSystem = getFeedbackSystem();
      const reply = await callClaude(
        [{ role: "user", content: "Please give me feedback on my performance." }],
        fbSystem,
        true
      );
      setFeedbackMessages([{ role: "assistant", content: reply }]);
    } catch {
      setFeedbackMessages([{ role: "assistant", content: "Error getting feedback — try again." }]);
    }
    setLoading(false);
  }

  function nextTask() {
    const taskRecord = {
      title: task.title,
      messages: messages.filter((m) => m.content !== "__init__"),
      feedback: feedbackMessages[0]?.content || "",
    };
    const newCompleted = [...completedTasks, taskRecord];
    setCompletedTasks(newCompleted);

    if (currentTask < tasks.length - 1) {
      setCurrentTask((t) => t + 1);
      setMessages([]);
      setFeedbackMessages([]);
      setPhase("speaking");
      setScreen("task");
    } else {
      // Save full session
      saveSession({
        id: Date.now(),
        name,
        level,
        difficultSounds: [...difficultSounds, otherSounds].filter(Boolean).join(", "),
        timestamp: new Date().toLocaleString("es-CL"),
        tasks: newCompleted,
      });
      setScreen("done");
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function startRecording() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Speech recognition is not supported in this browser. Please use Chrome on Android or Safari on iOS.");
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + " ";
        } else {
          interimText += e.results[i][0].transcript;
        }
      }
      if (finalText) setInput((prev) => (prev ? prev + " " + finalText.trim() : finalText.trim()));
      setInterim(interimText);
    };
    recognition.onerror = (e) => {
      if (e.error !== "aborted") { stopRecording(); }
      setInterim("");
    };
    recognition.onend = () => {
      setRecording(false);
      setInterim("");
    };

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);

    // Start countdown timer
    const total = TIMER_SECONDS[level] || 60;
    setTimeLeft(total);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setLastDuration(total);
          recognitionRef.current?.stop();
          setRecording(false);
          setInterim("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopRecording() {
    clearInterval(timerRef.current);
    const total = TIMER_SECONDS[level] || 60;
    setLastDuration(total - (timeLeft || 0));
    recognitionRef.current?.stop();
    setRecording(false);
    setInterim("");
    setTimeLeft(null);
  }

  // ── STYLES ────────────────────────────────
  const s = {
    app: {
      minHeight: "100vh",
      background: colors.bg,
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingBottom: "60px",
    },
    header: {
      width: "100%",
      background: colors.accent,
      color: "#fff",
      padding: "14px 20px",
      fontSize: "16px",
      fontWeight: "bold",
      textAlign: "center",
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      margin: "14px",
      width: "calc(100% - 28px)",
      maxWidth: "520px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
    },
    label: {
      fontSize: "12px",
      fontWeight: "700",
      color: colors.accent,
      marginBottom: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.6px",
    },
    select: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "10px",
      border: `2px solid ${colors.light}`,
      fontSize: "15px",
      marginBottom: "14px",
      outline: "none",
      background: "#fff",
    },
    textInput: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: "10px",
      border: `2px solid ${colors.light}`,
      fontSize: "15px",
      marginBottom: "14px",
      outline: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    btn: {
      background: colors.accent,
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "13px 20px",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      marginTop: "10px",
    },
    btnGhost: {
      background: "transparent",
      color: colors.accent,
      border: `2px solid ${colors.light}`,
      borderRadius: "12px",
      padding: "11px 20px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      width: "100%",
      marginTop: "8px",
    },
    bubble: (isUser) => ({
      background: isUser ? colors.accent : "#f5f5f5",
      color: isUser ? "#fff" : "#333",
      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      padding: "11px 15px",
      marginBottom: "8px",
      maxWidth: "86%",
      alignSelf: isUser ? "flex-end" : "flex-start",
      fontSize: "14px",
      lineHeight: "1.55",
      whiteSpace: "pre-wrap",
    }),
    chatArea: {
      display: "flex",
      flexDirection: "column",
      minHeight: "160px",
      maxHeight: "340px",
      overflowY: "auto",
      padding: "6px 0",
    },
    soundChip: (active) => ({
      display: "inline-block",
      padding: "7px 13px",
      borderRadius: "20px",
      border: `2px solid ${active ? colors.accent : colors.light}`,
      background: active ? colors.light : "#fff",
      color: active ? colors.dark : "#666",
      fontSize: "13px",
      fontWeight: active ? "700" : "400",
      cursor: "pointer",
      margin: "4px",
    }),
    feedbackBox: {
      background: colors.light,
      borderRadius: "14px",
      padding: "16px",
      fontSize: "14px",
      lineHeight: "1.65",
      whiteSpace: "pre-wrap",
      color: "#222",
    },
    progressBar: {
      display: "flex",
      gap: "6px",
      marginBottom: "14px",
    },
    progressDot: (done) => ({
      flex: 1,
      height: "6px",
      borderRadius: "3px",
      background: done ? colors.accent : colors.light,
    }),
  };

  const SOUND_OPTIONS = [
    "/θ/ and /ð/ (think, this)",
    "/v/ vs /b/ (very, best)",
    "/ɪ/ vs /iː/ (sit, seat)",
    "/æ/ (cat, that)",
    "Final consonants (asked, world)",
    "Word stress",
    "Connected speech / rhythm",
  ];

  // ── SETUP SCREEN ────────────────────────
  if (screen === "setup") {
    return (
      <div style={s.app}>
        <div style={s.header}>🎙️ Speaking Skills Session</div>
        <div style={s.card}>
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAFEBQIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9U6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooo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3QfqD4f8Q6Z4s0Sy1jRr+31PS72JZre8tZBJHKhGQysOCK88/aJ/Zs8E/tOeA5/DPjHTxLwWstSgAW6sZccSRP8AzU/Kw4Ir81PAPxI+J/8AwSl+L0fgfx2LjxP8HdYnMltdwKWRUJwZrfP3JFyDJCTg9R1DEA/X+isXwb4z0T4heF9N8R+HNSt9Y0TUYVntb22bckiHv7HsQeQQQea2qACiiigAooooAKKKr3moWumwma7uYbWIdZJnCKPxNAFiiuIvPjj8O7DULawn8deHY765lWCG2/tSEySSMcKoUNnJPGK7egAooooAKKKy9X8U6L4fUtqmr2GmqOpvLlIgP++iKANSiuR0D4ueB/FevnQ9E8X6HrGsCJpjY2GoRTy7FOC21WJwCR+dddQAUUUUAFFFRXV3BY27z3M0dvBGMvLKwVVHqSeBQBLRXKH4seB1uPs58ZeHxPnHlf2pBuz6Y35rorDUrTVbcXFldQ3kDcCW3kDqfxBxQBZooooAKKKKAPzo/wCC2X/JCvAv/Ywn/wBJ5K/G6v2R/wCC2X/JCvAv/Ywn/wBJ5K/G6gAr+mT9nWNYfgF8OERQiL4esAFUYA/0dK/mbr+mn9n6F4PgT8PI5FKOvh+wBVhgj/R0oA7+iiq2o6nZ6RavdX93BZWyfemuJFjQfUk4oAs0VxafGv4eSXX2ZPHfhprjr5Q1e3LflvrrrS8g1C3S4tZ47mCQZSWFwysPUEcGgCaiiigAooooAKKKKACiiigAooooAKKKKACvJ/A//JxnxT/7Beh/yvK9YryfwP8A8nGfFP8A7Beh/wArygD1iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAp6zrFj4d0m91TU7qKx06yhe4uLmdgqRRqCzMxPQAAmvyM8deKvGf/AAVa/aRTwf4ZmuNE+DXhufzZrpgdvlgkG4cdGmk5Eafwg/7xPo3/AAUs/aE1/wCLnxE0j9mT4XvJ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3R/CmuXl5rFwbiKP7NC8KKjbXYM+SpGEDH2r6KooA+XfjR8H/iH4C+Oi/HD4OWFl4i1a/wBOTSfFHg2+uhaLrEEfMM8M7fKlwmFQF+Nox6hsD4jfEb9or45eE7zwP4S+Dt18L59ZhNpfeLvEWvWzppsLjEjQR27GR5NpIVhjB5x3H2DRQBzfw38Ew/DfwD4f8LW99d6nFpFjFZi+v5DJPcFFAMkjHqzHJP1rpKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
              alt="UAH EFL Programme"
              style={{ width: "100%", maxWidth: "320px", marginBottom: "14px" }}
            />
            <div style={{ fontSize: "13px", color: "#777" }}>
              You'll complete 2 Cambridge-style speaking tasks with an AI examiner.
            </div>
          </div>

          <div style={s.label}>Your name</div>
          <input
            style={s.textInput}
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={s.label}>Your level</div>
          <select style={s.select} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>A2+</option>
            <option>B1</option>
            <option>B2+</option>
            <option>C1</option>
          </select>

          <div style={s.label}>
            Which sounds do you find most difficult? (select all that apply)
          </div>
          <div style={{ marginBottom: "14px" }}>
            {SOUND_OPTIONS.map((s_) => (
              <span
                key={s_}
                style={s.soundChip(difficultSounds.includes(s_))}
                onClick={() =>
                  setDifficultSounds((prev) =>
                    prev.includes(s_) ? prev.filter((x) => x !== s_) : [...prev, s_]
                  )
                }
              >
                {s_}
              </span>
            ))}
          </div>

          <div style={s.label}>Other difficult sounds (optional)</div>
          <input
            style={s.textInput}
            placeholder="e.g. /r/, /w/, vowel sounds..."
            value={otherSounds}
            onChange={(e) => setOtherSounds(e.target.value)}
          />

          <button
            style={{ ...s.btn, opacity: !name.trim() ? 0.5 : 1 }}
            disabled={!name.trim()}
            onClick={() => {
              setScreen("task");
              setCurrentTask(0);
              setMessages([]);
              setPhase("speaking");
            }}
          >
            Start Speaking 🚀
          </button>
        </div>

        {/* Teacher access button */}
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "#aaa",
            fontSize: "12px",
            cursor: "pointer",
            marginTop: "8px",
          }}
          onClick={() => setScreen("teacher_login")}
        >
          👩‍🏫 Teacher Access
        </button>
      </div>
    );
  }

  // ── TASK SCREEN ─────────────────────────
  if (screen === "task") {
    const progress = tasks.map((_, i) => i <= currentTask);
    return (
      <div style={s.app}>
        <div style={s.header}>
          {name} · {level} · {task?.title}
        </div>
        <div style={s.card}>
          {/* Progress */}
          <div style={s.progressBar}>
            {progress.map((done, i) => (
              <div key={i} style={s.progressDot(done)} />
            ))}
          </div>

          {/* Task intro */}
          <div
            style={{
              background: colors.light,
              borderRadius: "10px",
              padding: "12px",
              fontSize: "13px",
              color: colors.dark,
              marginBottom: "12px",
              fontStyle: "italic",
            }}
          >
            {task?.intro}
          </div>

          {/* Image display for photo tasks */}
          {task?.imageUrl && (
            <div style={{ marginBottom: "12px" }}>
              <img
                src={task.imageUrl}
                alt={task.imageAlt}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  maxHeight: "200px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {task.imageUrl2 && (
                <img
                  src={task.imageUrl2}
                  alt={task.imageAlt2}
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    display: "block",
                    marginTop: "8px",
                  }}
                />
              )}
              <div style={{ fontSize: "11px", color: "#aaa", textAlign: "center", marginTop: "4px" }}>
                📷 Describe what you see in this photograph
              </div>
            </div>
          )}

          {/* Chat area */}
          <div style={s.chatArea}>
            {messages
              .filter((m) => m.content !== "__init__")
              .map((m, i) => (
                <div key={i} style={s.bubble(m.role === "user")}>
                  {m.content}
                </div>
              ))}
            {loading && phase === "speaking" && (
              <div style={s.bubble(false)}>
                <em>Examiner is responding…</em>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input or Get Feedback */}
          {phase === "speaking" && (
            <div style={{ marginTop: "10px" }}>
              {/* Mic button */}
              <button
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: recording ? "#d32f2f" : colors.accent,
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onClick={recording ? stopRecording : startRecording}
                disabled={loading}
              >
                {recording ? "⏹ Stop Recording" : "🎙️ Hold to Speak"}
              </button>

              {recording && (
                <div style={{ marginBottom: "10px" }}>
                  {/* Timer circle */}
                  <div style={{ textAlign: "center", marginBottom: "6px" }}>
                    <span style={{
                      display: "inline-block",
                      width: "64px",
                      height: "64px",
                      lineHeight: "64px",
                      borderRadius: "50%",
                      fontSize: "22px",
                      fontWeight: "bold",
                      background: timeLeft > (TIMER_SECONDS[level] * 0.5)
                        ? "#e8f5e9"
                        : timeLeft > (TIMER_SECONDS[level] * 0.2)
                        ? "#fff9c4"
                        : "#ffebee",
                      color: timeLeft > (TIMER_SECONDS[level] * 0.5)
                        ? "#2e7d32"
                        : timeLeft > (TIMER_SECONDS[level] * 0.2)
                        ? "#f57f17"
                        : "#c62828",
                      border: "3px solid currentColor",
                    }}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div style={{ textAlign: "center", fontSize: "12px", color: "#888" }}>
                    🎯 Target: {TIMER_SECONDS[level]}s · 🔴 Speak clearly
                  </div>
                </div>
              )}
              {interim && (
                <div style={{ background: "#fff9c4", borderRadius: "8px", padding: "8px 12px", fontSize: "14px", color: "#555", marginBottom: "6px", fontStyle: "italic" }}>
                  {interim}
                </div>
              )}

              {/* Transcript review area */}
              {input.length > 0 && (
                <>
                  <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
                    ✏️ Review your transcription (edit if needed):
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <textarea
                      style={{ ...s.textInput, flex: 1, height: "60px", marginBottom: 0, resize: "none" }}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button
                      style={{ ...s.btn, width: "auto", padding: "0 16px", marginTop: 0, fontSize: "20px" }}
                      onClick={sendMessage}
                      disabled={loading}
                    >
                      ➤
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {phase === "ready" && (
            <button style={s.btn} onClick={getFeedback}>
              Get Feedback 📝
            </button>
          )}

          {phase === "feedback" && (
            <>
              {loading ? (
                <div style={{ ...s.feedbackBox, color: "#888", fontStyle: "italic" }}>
                  Getting your feedback…
                </div>
              ) : (
                <div style={s.feedbackBox}>{feedbackMessages[0]?.content}</div>
              )}
              {!loading && feedbackMessages.length > 0 && (
                <button style={s.btn} onClick={nextTask}>
                  {currentTask < tasks.length - 1 ? "Next Task →" : "Finish 🏁"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // ── DONE SCREEN ─────────────────────────
  if (screen === "done") {
    return (
      <div style={s.app}>
        <div style={s.header}>🏁 Session Complete · {level}</div>
        <div style={s.card}>
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px" }}>🎉</div>
            <div style={{ fontWeight: "bold", fontSize: "18px", marginTop: "8px" }}>
              Well done, {name}!
            </div>
            <div style={{ fontSize: "13px", color: "#666", marginTop: "4px" }}>
              You completed {completedTasks.length} speaking tasks at {level} level.
            </div>
          </div>

          {completedTasks.map((t, i) => (
            <div key={i} style={{ marginBottom: "16px" }}>
              <div style={s.label}>{t.title} — Feedback</div>
              <div style={s.feedbackBox}>{t.feedback}</div>
            </div>
          ))}

          <button
            style={s.btnGhost}
            onClick={() => {
              setScreen("setup");
              setName("");
              setDifficultSounds([]);
              setOtherSounds("");
              setCurrentTask(0);
              setMessages([]);
              setFeedbackMessages([]);
              setCompletedTasks([]);
              setPhase("speaking");
            }}
          >
            New session
          </button>
        </div>
      </div>
    );
  }

  // ── TEACHER LOGIN ────────────────────────
  if (screen === "teacher_login") {
    return (
      <div style={s.app}>
        <div style={s.header}>👩‍🏫 Teacher Access</div>
        <div style={s.card}>
          <div style={s.label}>Password</div>
          <input
            style={s.textInput}
            type="password"
            placeholder="Enter password"
            value={teacherPwd}
            onChange={(e) => { setTeacherPwd(e.target.value); setTeacherError(false); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (teacherPwd === "sessions2026") {
                  setSessions(getSessions());
                  setScreen("teacher");
                } else {
                  setTeacherError(true);
                }
              }
            }}
          />
          {teacherError && (
            <div style={{ color: "red", fontSize: "13px", marginBottom: "8px" }}>
              Incorrect password.
            </div>
          )}
          <button
            style={s.btn}
            onClick={() => {
              if (teacherPwd === "sessions2026") {
                setSessions(getSessions());
                setScreen("teacher");
              } else {
                setTeacherError(true);
              }
            }}
          >
            Access Dashboard
          </button>
          <button style={s.btnGhost} onClick={() => setScreen("setup")}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // ── TEACHER DASHBOARD ────────────────────
  if (screen === "teacher") {
    return (
      <div style={{ ...s.app, background: "#f5f5f5" }}>
        <div style={{ ...s.header, background: "#37474f" }}>
          👩‍🏫 Teacher Dashboard — {sessions.length} session{sessions.length !== 1 ? "s" : ""}
        </div>

        {sessions.length === 0 && (
          <div style={s.card}>
            <div style={{ color: "#888", textAlign: "center", padding: "20px" }}>
              No sessions recorded yet on this device.
            </div>
          </div>
        )}

        {sessions.map((sess, i) => (
          <div key={i} style={{ ...s.card, borderLeft: "4px solid #37474f" }}>
            <div
              style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => setExpandedSession(expandedSession === i ? null : i)}
            >
              <div>
                <div style={{ fontWeight: "bold", fontSize: "15px" }}>{sess.name}</div>
                <div style={{ fontSize: "12px", color: "#888" }}>
                  {sess.level} · {sess.timestamp}
                </div>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                  Difficult sounds: {sess.difficultSounds || "not specified"}
                </div>
              </div>
              <div style={{ fontSize: "18px" }}>{expandedSession === i ? "▲" : "▼"}</div>
            </div>

            {expandedSession === i && (
              <div style={{ marginTop: "14px" }}>
                {sess.tasks?.map((t, j) => (
                  <div key={j} style={{ marginBottom: "18px" }}>
                    <div style={{ fontWeight: "bold", fontSize: "13px", color: "#37474f", marginBottom: "8px" }}>
                      {t.title}
                    </div>

                    <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px", fontWeight: "600" }}>
                      TRANSCRIPT
                    </div>
                    <div
                      style={{
                        background: "#f9f9f9",
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        marginBottom: "10px",
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {t.messages?.map((m, k) => (
                        <div key={k} style={{ marginBottom: "6px" }}>
                          <span style={{ fontWeight: "bold", color: m.role === "user" ? "#1565c0" : "#555" }}>
                            {m.role === "user" ? sess.name : "Examiner"}:{" "}
                          </span>
                          {m.content}
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: "12px", color: "#888", marginBottom: "4px", fontWeight: "600" }}>
                      FEEDBACK GIVEN
                    </div>
                    <div
                      style={{
                        background: "#e8f5e9",
                        borderRadius: "10px",
                        padding: "12px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {t.feedback}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: "10px", maxWidth: "520px", margin: "0 14px" }}>
          <button
            style={{ ...s.btn, background: "#2e7d32", flex: 1, marginTop: 0 }}
            onClick={downloadReport}
            disabled={sessions.length === 0}
          >
            ⬇️ Download Report
          </button>
          <button
            style={{ ...s.btnGhost, flex: 1, marginTop: 0 }}
            onClick={() => { setScreen("setup"); setTeacherPwd(""); }}
          >
            ← Exit
          </button>
        </div>
      </div>
    );
  }

  function downloadReport() {
    const date = new Date().toLocaleDateString("es-CL");
    const time = new Date().toLocaleTimeString("es-CL");

    const sessionHTML = sessions.map((sess, i) => `
      <div class="session">
        <div class="session-header">
          <h2>${i + 1}. ${sess.name}</h2>
          <div class="meta">
            <span class="badge">${sess.level}</span>
            <span class="timestamp">${sess.timestamp}</span>
          </div>
          <p class="sounds"><strong>Difficult sounds:</strong> ${sess.difficultSounds || "not specified"}</p>
        </div>
        ${(sess.tasks || []).map((t, j) => `
          <div class="task">
            <h3>Task ${j + 1}: ${t.title}</h3>
            <div class="transcript-section">
              <h4>📝 Transcript</h4>
              <div class="transcript">
                ${(t.messages || []).map(m => `
                  <div class="message ${m.role}">
                    <strong>${m.role === "user" ? sess.name : "Examiner"}:</strong>
                    <span>${m.content}</span>
                  </div>
                `).join("")}
              </div>
            </div>
            <div class="feedback-section">
              <h4>💬 Feedback Given</h4>
              <div class="feedback">${(t.feedback || "").replace(/
/g, "<br>")}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `).join("");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Speaking Skills Session Report — ${date}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 860px; margin: 0 auto; padding: 40px 24px; color: #222; }
    h1 { color: #1a237e; border-bottom: 3px solid #1a237e; padding-bottom: 12px; }
    .report-meta { color: #666; font-size: 14px; margin-bottom: 32px; }
    .session { background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 32px; border-left: 5px solid #1a237e; }
    .session-header h2 { margin: 0 0 8px 0; color: #1a237e; }
    .meta { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; }
    .badge { background: #1a237e; color: white; border-radius: 20px; padding: 3px 12px; font-size: 13px; font-weight: bold; }
    .timestamp { color: #888; font-size: 13px; }
    .sounds { font-size: 13px; color: #555; margin: 4px 0 0 0; }
    .task { background: white; border-radius: 10px; padding: 18px; margin-top: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .task h3 { color: #333; margin: 0 0 14px 0; font-size: 15px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    h4 { font-size: 13px; color: #666; margin: 12px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; }
    .transcript { background: #f5f5f5; border-radius: 8px; padding: 14px; }
    .message { margin-bottom: 10px; font-size: 14px; line-height: 1.5; }
    .message.user strong { color: #1565c0; }
    .message.assistant strong { color: #555; }
    .feedback { background: #e8f5e9; border-radius: 8px; padding: 14px; font-size: 14px; line-height: 1.65; }
    .summary { background: #e8eaf6; border-radius: 10px; padding: 18px; margin-bottom: 28px; }
    .summary h2 { margin: 0 0 10px 0; color: #1a237e; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { background: #1a237e; color: white; padding: 10px 14px; text-align: left; }
    td { padding: 9px 14px; border-bottom: 1px solid #ddd; }
    tr:nth-child(even) td { background: #f0f0f0; }
    @media print { body { padding: 20px; } .session { break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>🎙️ Speaking Skills Session — Report</h1>
  <div class="report-meta">
    <strong>UAH · Facultad de Educación · English as a Foreign Language Teacher Education Programme</strong><br>
    Generated: ${date} at ${time} · Total sessions: ${sessions.length}
  </div>

  <div class="summary">
    <h2>Summary</h2>
    <table>
      <thead><tr><th>#</th><th>Student</th><th>Level</th><th>Time</th><th>Difficult Sounds</th></tr></thead>
      <tbody>
        ${sessions.map((s, i) => `
          <tr>
            <td>${i + 1}</td>
            <td>${s.name}</td>
            <td>${s.level}</td>
            <td>${s.timestamp}</td>
            <td>${s.difficultSounds || "—"}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  </div>

  ${sessionHTML}
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speaking-session-report-${date.replace(/\//g, "-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return null;
}
