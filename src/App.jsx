import { useState, useRef, useEffect } from "react";

// ============================================================
// ✏️  EDIT THESE — Replace with your real campus locations
// ============================================================
const ROUTES = {
  A: {
    phrase: "LANGUAGE OPENS DOORS",
    stops: [
      {
        name: "Stop 1",
        riddle: `"I hold a thousand voices, but I never speak.\nPeople come to me empty and leave full —\nnot of food, but of something else.\nWhere am I?"`,
        locationHint: "📍 Find this place on campus — scan when you arrive!",
        fragment: "LANGUAGE",
      },
      {
        name: "Stop 2",
        riddle: `"I have no walls, but everyone passes through me.\nI've heard a thousand conversations in a hundred languages,\nbut I keep no secrets.\nFind me where the sky is the only roof."`,
        locationHint: "📍 Find this place on campus — scan when you arrive!",
        fragment: "OPENS DOORS",
      },
    ],
  },
  B: {
    phrase: "MISTAKES ARE BRIDGES",
    stops: [
      {
        name: "Stop 1",
        riddle: `"I am loudest at noon and silent at midnight.\nPeople come to me hungry and leave talking\nmore than when they arrived.\nWhat am I?"`,
        locationHint: "📍 Find this place on campus — scan when you arrive!",
        fragment: "MISTAKES",
      },
      {
        name: "Stop 2",
        riddle: `"I am full of silence, but I'm not empty.\nPeople come to me with questions\nthey can't say out loud anywhere else.\nFind the place where quiet has its own kind of sound."`,
        locationHint: "📍 Find this place on campus — scan when you arrive!",
        fragment: "ARE BRIDGES",
      },
    ],
  },
};

const CRITERIA = {
  "A2+": {
    stop: [
      "Ask them to describe what they see in this place using at least 2 complete sentences. Accept correct simple present with basic vocabulary. Be warm and encouraging.",
      "Ask them to name 3 things people do in this place, in complete sentences. Accept if verbs are correct.",
    ],
    final:
      "Ask: 'Why do you think this is true? Give one example from your life.' Accept a simple answer with 1 complete sentence and a concrete example.",
  },
  B1: {
    stop: [
      "Ask them to describe a time they came to a place like this and what happened. Accept past simple, at least one connector (so/then/because), minimum 3 connected sentences.",
      "Ask them to give advice to a new student about this place. Accept 'should/can/must' with 2 pieces of advice and reasons.",
    ],
    final:
      "Ask: 'Can you connect this phrase to something that happened to you this year?' Accept a personal connection in past tense, minimum 4 sentences.",
  },
  "B2+": {
    stop: [
      "Ask whether this place fulfills its purpose well and why. Push back ONCE with a counterargument ('But couldn't you say...'). Accept only if they give 2+ developed reasons AND respond to your pushback.",
      "Ask: 'If this place could only be used by one group, who should it be?' Push back: 'But what about the others?' Accept only if they respond to the objection with developed reasoning.",
    ],
    final:
      "Ask: 'Do you fully agree with this phrase, or is there an exception? Explain.' Accept only if they take a nuanced position — not just agreement or disagreement.",
  },
  C1: {
    stop: [
      "Ask: 'What does this place reveal about how your university values knowledge?' Push back TWICE. Accept only if they sustain abstract argument with precise vocabulary and handle both counterarguments without losing coherence.",
      "Ask: 'Public spaces shape social dynamics — does this place prove or disprove that?' Push back with a specific counterexample. Accept only if they engage with abstraction and use sophisticated linking language.",
    ],
    final:
      "Ask: 'Challenge this phrase — is there a situation where it is completely false?' Accept only if they construct a genuine counterargument and then defend their overall position with sophistication.",
  },
};

const COLORS = {
  "A2+": { bg: "#e8f5e9", accent: "#2e7d32", light: "#c8e6c9" },
  B1: { bg: "#e3f2fd", accent: "#1565c0", light: "#bbdefb" },
  "B2+": { bg: "#f3e5f5", accent: "#6a1b9a", light: "#e1bee7" },
  C1: { bg: "#fff3e0", accent: "#e65100", light: "#ffe0b2" },
};

export default function App() {
  const [screen, setScreen] = useState("setup");
  const [level, setLevel] = useState("B1");
  const [route, setRoute] = useState("A");
  const [group, setGroup] = useState("");
  const [currentStop, setCurrentStop] = useState(0);
  const [fragments, setFragments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [showRiddle, setShowRiddle] = useState(true);
  const [exchanges, setExchanges] = useState(0);
  const bottomRef = useRef(null);

  const routeData = ROUTES[route];
  const stopData = routeData?.stops[currentStop];
  const colors = COLORS[level];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const getStopSystem = () => {
    const criteria = CRITERIA[level].stop[currentStop];
    const fragment = stopData.fragment;
    return `You are a mysterious guardian in an English speaking treasure hunt at a Chilean university. Students are EFL learners at ${level} level.

Stop ${currentStop + 1} of 2. Fragment to unlock: "${fragment}"

EVALUATION CRITERIA FOR THIS STOP:
${criteria}

STRICT RULES:
- Keep ALL your responses under 3 sentences — this is a mobile phone screen
- Do NOT approve on the very first message. Have at least 1-2 exchanges first.
- When the student genuinely meets the criteria, write exactly [APPROVED] on its own line
- NEVER mention the fragment or write [APPROVED] unless fully earned
- If not approved: give ONE specific piece of feedback, then ask them to try again
- Be a mysterious but kind guardian — not a teacher correcting an exam
- Always respond in English only`;
  };

  const getFinalSystem = () => {
    const phrase = routeData.phrase;
    const criteria = CRITERIA[level].final;
    return `You are the final guardian of an English treasure hunt. The correct phrase is: "${phrase}" (case insensitive).

Level: ${level} CEFR.

RULES:
1. First, check if the student's phrase matches "${phrase}" (ignore case/punctuation)
2. If WRONG: say it seems incomplete, give a subtle hint without revealing the answer
3. If CORRECT: ask your follow-up speaking question: ${criteria}
4. Evaluate their answer — if it meets the criteria, write exactly [VICTORY] on its own line
5. Keep responses under 3 sentences
6. Be mysterious and celebratory when they succeed
7. Always respond in English only`;
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setExchanges((e) => e + 1);

    try {
      const system = screen === "final" ? getFinalSystem() : getStopSystem();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, system }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "Connection error — try again.";

      if (raw.includes("[APPROVED]")) {
        setApproved(true);
        setFragments((f) => [...f, stopData.fragment]);
      }
      if (raw.includes("[VICTORY]")) {
        setTimeout(() => setScreen("victory"), 800);
      }

      const clean = raw
        .replace("[APPROVED]", "")
        .replace("[VICTORY]", "")
        .trim();

      setMessages([...newMessages, { role: "assistant", content: clean }]);
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Connection error — try again." },
      ]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const goNextStop = () => {
    if (currentStop < routeData.stops.length - 1) {
      setCurrentStop((s) => s + 1);
      setMessages([]);
      setApproved(false);
      setShowRiddle(true);
      setExchanges(0);
    } else {
      setScreen("final");
      setMessages([]);
      setExchanges(0);
    }
  };

  const s = {
    app: {
      minHeight: "100vh",
      background: colors.bg,
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 0 80px 0",
    },
    header: {
      width: "100%",
      background: colors.accent,
      color: "#fff",
      padding: "16px 20px",
      fontSize: "18px",
      fontWeight: "bold",
      textAlign: "center",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      padding: "20px",
      margin: "16px",
      width: "calc(100% - 32px)",
      maxWidth: "480px",
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    },
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: colors.accent,
      marginBottom: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    select: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: `2px solid ${colors.light}`,
      fontSize: "16px",
      marginBottom: "16px",
      outline: "none",
      background: "#fff",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "10px",
      border: `2px solid ${colors.light}`,
      fontSize: "15px",
      outline: "none",
      resize: "none",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    btn: {
      background: colors.accent,
      color: "#fff",
      border: "none",
      borderRadius: "12px",
      padding: "14px 24px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      marginTop: "12px",
    },
    btnSecondary: {
      background: colors.light,
      color: colors.accent,
      border: "none",
      borderRadius: "12px",
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: "bold",
      cursor: "pointer",
      width: "100%",
      marginTop: "8px",
    },
    riddle: {
      background: colors.light,
      borderRadius: "12px",
      padding: "16px",
      fontStyle: "italic",
      fontSize: "16px",
      lineHeight: "1.6",
      whiteSpace: "pre-line",
      color: "#333",
    },
    bubble: (isUser) => ({
      background: isUser ? colors.accent : "#f5f5f5",
      color: isUser ? "#fff" : "#333",
      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      padding: "12px 16px",
      marginBottom: "10px",
      maxWidth: "85%",
      alignSelf: isUser ? "flex-end" : "flex-start",
      fontSize: "15px",
      lineHeight: "1.5",
    }),
    chatArea: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minHeight: "180px",
      maxHeight: "340px",
      overflowY: "auto",
      padding: "8px 0",
    },
    fragment: {
      background: colors.accent,
      color: "#fff",
      borderRadius: "12px",
      padding: "14px 20px",
      textAlign: "center",
      fontSize: "22px",
      fontWeight: "bold",
      letterSpacing: "2px",
      margin: "12px 0",
    },
    badge: {
      display: "inline-block",
      background: colors.light,
      color: colors.accent,
      borderRadius: "20px",
      padding: "4px 12px",
      fontSize: "13px",
      fontWeight: "bold",
      marginBottom: "12px",
    },
  };

  // ── SETUP SCREEN ──────────────────────────────────────────
  if (screen === "setup") {
    return (
      <div style={s.app}>
        <div style={s.header}>🗝️ Speaking Treasure Hunt</div>
        <div style={s.card}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "40px" }}>🏛️</div>
            <div style={{ fontSize: "15px", color: "#666", marginTop: "6px" }}>
              Speak your way to the treasure!
            </div>
          </div>

          <div style={s.label}>Your name or group code</div>
          <input
            style={{ ...s.input, marginBottom: "16px" }}
            placeholder="e.g. Group 3 / Ana"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          />

          <div style={s.label}>Your level</div>
          <select style={s.select} value={level} onChange={(e) => setLevel(e.target.value)}>
            <option>A2+</option>
            <option>B1</option>
            <option>B2+</option>
            <option>C1</option>
          </select>

          <div style={s.label}>Your route</div>
          <select style={s.select} value={route} onChange={(e) => setRoute(e.target.value)}>
            <option value="A">Route A</option>
            <option value="B">Route B</option>
          </select>

          <button
            style={{ ...s.btn, opacity: !group.trim() ? 0.5 : 1 }}
            disabled={!group.trim()}
            onClick={() => { setScreen("stop"); setShowRiddle(true); }}
          >
            Start the Hunt 🚀
          </button>
        </div>
      </div>
    );
  }

  // ── STOP SCREEN ───────────────────────────────────────────
  if (screen === "stop") {
    return (
      <div style={s.app}>
        <div style={s.header}>
          {stopData.name} of {routeData.stops.length} · {level} · Route {route}
        </div>

        <div style={s.card}>
          {showRiddle ? (
            <>
              <div style={s.label}>🔍 Solve this riddle</div>
              <div style={s.riddle}>{stopData.riddle}</div>
              <div style={{ fontSize: "13px", color: "#888", marginTop: "10px" }}>
                {stopData.locationHint}
              </div>
              <button style={s.btn} onClick={() => setShowRiddle(false)}>
                I found the place! ✅
              </button>
            </>
          ) : approved ? (
            <>
              <div style={{ textAlign: "center", fontSize: "32px", marginBottom: "8px" }}>🎉</div>
              <div style={{ ...s.label, textAlign: "center" }}>Fragment unlocked!</div>
              <div style={s.fragment}>{stopData.fragment}</div>
              <div style={{ fontSize: "13px", color: "#666", textAlign: "center", marginBottom: "12px" }}>
                Keep it safe — you'll need all fragments at the end.
              </div>
              <button style={s.btn} onClick={goNextStop}>
                {currentStop < routeData.stops.length - 1 ? "Go to Stop 2 →" : "Go to Final Checkpoint →"}
              </button>
            </>
          ) : (
            <>
              <div style={s.badge}>
                {stopData.name} · Guardian
              </div>
              {messages.length === 0 && (
                <div style={{ ...s.riddle, marginBottom: "12px", fontStyle: "normal", fontSize: "14px" }}>
                  💬 You found the right place! Now speak to the Guardian to earn your fragment. Type your answer below.
                </div>
              )}
              <div style={s.chatArea}>
                {messages.map((m, i) => (
                  <div key={i} style={s.bubble(m.role === "user")}>
                    {m.content}
                  </div>
                ))}
                {loading && (
                  <div style={s.bubble(false)}>
                    <em>Guardian is thinking…</em>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <textarea
                  style={{ ...s.input, flex: 1, height: "56px" }}
                  placeholder="Type your answer in English…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button
                  style={{
                    ...s.btn,
                    width: "auto",
                    padding: "0 18px",
                    marginTop: 0,
                    fontSize: "20px",
                  }}
                  onClick={sendMessage}
                  disabled={loading}
                >
                  ➤
                </button>
              </div>
            </>
          )}
        </div>

        {/* Fragments collected so far */}
        {fragments.length > 0 && (
          <div style={{ ...s.card, paddingTop: "12px", paddingBottom: "12px" }}>
            <div style={s.label}>Fragments collected</div>
            {fragments.map((f, i) => (
              <div key={i} style={{ ...s.fragment, fontSize: "16px", padding: "10px", marginBottom: "6px" }}>
                {f}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── FINAL CHECKPOINT ──────────────────────────────────────
  if (screen === "final") {
    return (
      <div style={s.app}>
        <div style={s.header}>🏁 Final Checkpoint · {level}</div>
        <div style={s.card}>
          <div style={{ textAlign: "center", marginBottom: "12px" }}>
            <div style={{ fontSize: "36px" }}>🔐</div>
            <div style={{ fontSize: "15px", color: "#555" }}>
              Assemble your fragments and speak to unlock the treasure.
            </div>
          </div>

          {/* Show collected fragments */}
          <div style={s.label}>Your fragments</div>
          {fragments.map((f, i) => (
            <div key={i} style={{ ...s.fragment, fontSize: "15px", padding: "10px", marginBottom: "6px" }}>
              {f}
            </div>
          ))}

          <div style={{ ...s.riddle, fontStyle: "normal", fontSize: "14px", marginTop: "12px", marginBottom: "12px" }}>
            💬 Put the fragments together and type the full phrase. Then prove to the Guardian you understand it!
          </div>

          <div style={s.chatArea}>
            {messages.map((m, i) => (
              <div key={i} style={s.bubble(m.role === "user")}>
                {m.content}
              </div>
            ))}
            {loading && (
              <div style={s.bubble(false)}>
                <em>Final Guardian is evaluating…</em>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <textarea
              style={{ ...s.input, flex: 1, height: "56px" }}
              placeholder="Type the full phrase…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              style={{
                ...s.btn,
                width: "auto",
                padding: "0 18px",
                marginTop: 0,
                fontSize: "20px",
              }}
              onClick={sendMessage}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── VICTORY SCREEN ────────────────────────────────────────
  if (screen === "victory") {
    return (
      <div style={{ ...s.app, justifyContent: "center", textAlign: "center" }}>
        <div style={s.card}>
          <div style={{ fontSize: "64px", marginBottom: "12px" }}>🏆</div>
          <div style={{ fontSize: "26px", fontWeight: "bold", color: colors.accent, marginBottom: "8px" }}>
            Treasure Found!
          </div>
          <div style={s.fragment}>{routeData.phrase}</div>
          <div style={{ fontSize: "15px", color: "#555", marginTop: "12px" }}>
            Well done, {group}! You completed the {level} speaking challenge. 🎉
          </div>
          <button style={{ ...s.btnSecondary, marginTop: "20px" }} onClick={() => { setScreen("setup"); setFragments([]); setCurrentStop(0); setMessages([]); setGroup(""); }}>
            Play again
          </button>
        </div>
      </div>
    );
  }
}
