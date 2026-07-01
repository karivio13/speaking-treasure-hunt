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
  const finalTranscriptRef = useRef("");
  const isRecordingRef = useRef(false);
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
      alert("Speech recognition is not supported. Please use Chrome (Android) or Safari (iOS).");
      return;
    }

    finalTranscriptRef.current = "";
    isRecordingRef.current = true;
    setRecording(true);

    function makeAndStart() {
      const r = new SR();
      r.lang = "en-US";
      r.continuous = false;
      r.interimResults = true;
      r.maxAlternatives = 1;

      r.onresult = (e) => {
        let interim = "";
        for (let i = 0; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            finalTranscriptRef.current += e.results[i][0].transcript + " ";
          } else {
            interim += e.results[i][0].transcript;
          }
        }
        setInput(finalTranscriptRef.current.trim());
        setInterim(interim);
      };

      r.onerror = () => { setInterim(""); };

      r.onend = () => {
        setInterim("");
        if (isRecordingRef.current) {
          try { makeAndStart(); } catch {}
        }
      };

      recognitionRef.current = r;
      try { r.start(); } catch {}
    }

    makeAndStart();

    const total = TIMER_SECONDS[level] || 60;
    setTimeLeft(total);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setLastDuration(total);
          isRecordingRef.current = false;
          try { recognitionRef.current?.stop(); } catch {}
          setRecording(false);
          setInterim("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function stopRecording() {
    isRecordingRef.current = false;
    clearInterval(timerRef.current);
    const total = TIMER_SECONDS[level] || 60;
    setLastDuration(total - (timeLeft || 0));
    try { recognitionRef.current?.stop(); } catch {}
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
              src="/logo.jpg"
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
              <div class="feedback">${(t.feedback || "").split("\n").join("<br>")}</div>
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
    a.download = `speaking-session-report-${date.split("/").join("-")}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return null;
}
