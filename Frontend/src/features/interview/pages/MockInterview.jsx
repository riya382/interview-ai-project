import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";

// ── Design tokens perfectly matched with image_db28a1 ──────────────
const C = {
  pink:       '#9333ea',
  pinkLight:  '#2d1254',
  pinkMid:    '#c026d3',
  glow:       '#c026d3',
  bg:         '#07040e',
  cardBg:     '#0e0a1a',
  cardBorder: '#2d1254',
  text:       '#f5f0ff',
  muted:      '#8878a8',
  sub:        '#d8b4fe',
  greenLight: '#052e16',
  greenText:  '#4ade80',
  amberLight: '#1c1004',
}

// ── Confetti Canvas Helper ────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const colors = ["#9333ea", "#c026d3", "#a855f7", "#e879f9"];
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
      w: Math.random() * 8 + 4, h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 1.5, angle: Math.random() * 360, spin: (Math.random() - 0.5) * 4,
    }));
    let frame = 0; let rafId;
    const draw = () => {
      if (frame > 220) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        p.y += p.speed; p.angle += p.spin;
      });
      frame++; rafId = requestAnimationFrame(draw);
    };
    draw(); return () => cancelAnimationFrame(rafId);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 999 }} />;
}

// ── Custom Timer Box Component ───────────────────────────────────
function Timer({ onTimeUp }) {
  const [inputMinutes, setInputMinutes] = useState(2); 
  const [selectedDuration, setSelectedDuration] = useState(120); 
  const [remaining, setRemaining] = useState(120);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); onTimeUp?.(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const applyPresetTime = (mins) => {
    if (running) return; setInputMinutes(mins);
    const totalSeconds = mins * 60; setSelectedDuration(totalSeconds); setRemaining(totalSeconds);
  };

  const handleInputChange = (e) => {
    let val = Math.max(1, Math.min(60, Number(e.target.value)));
    setInputMinutes(e.target.value === "" ? "" : val);
    if (val > 0) {
      const totalSeconds = val * 60; setSelectedDuration(totalSeconds); setRemaining(totalSeconds); setRunning(false);
    }
  };

  const mins = Math.floor(remaining / 60); const secs = remaining % 60;
  const circumference = 2 * Math.PI * 54; const offset = circumference * (1 - remaining / selectedDuration);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          <svg width="80" height="80" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke={C.cardBorder} strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none" stroke={C.pink} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            <div style={{ fontSize: "15px", fontWeight: 600, color: C.text }}>{mins}:{String(secs).padStart(2, "0")}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setRunning(!running)} style={{ padding: "8px 16px", borderRadius: "8px", background: running ? `${C.pink}22` : C.pink, color: "white", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{running ? "Pause" : "Start"}</button>
          <button onClick={() => { setRunning(false); setRemaining(selectedDuration); }} style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}`, fontSize: "13px", cursor: "pointer" }}>Reset</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[1, 2, 3, 5].map((m) => (
          <button key={m} disabled={running} onClick={() => applyPresetTime(m)} style={{ background: inputMinutes === m ? `${C.pink}33` : C.cardBg, border: `1px solid ${inputMinutes === m ? C.pink : C.cardBorder}`, color: C.text, padding: "5px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>{m}m</button>
        ))}
        <input type="number" value={inputMinutes} onChange={handleInputChange} disabled={running} min="1" max="60" style={{ background: C.bg, border: `1px solid ${C.cardBorder}`, borderRadius: "6px", color: C.text, padding: "4px 6px", fontSize: "12px", width: "48px", textAlign: "center", outline: "none" }} />
      </div>
    </div>
  );
}

// ── Summary Score Breakdown Screen ───────────────────────────────
function SummaryScreen({ allFeedback, questions, onRetry, onNew }) {
  const navigate = useNavigate();
  const scores = allFeedback.map((f) => f?.score ?? 0);
  const avgScore = scores.length ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) : 0;
  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      {avgScore >= 70 && <ConfettiCanvas />}
      <div style={{ background: C.cardBg, borderRadius: "20px", padding: "32px", maxWidth: "500px", width: "100%", border: `1px solid ${C.cardBorder}`, textAlign: "center" }}>
        <h2 style={{ fontSize: "22px", color: C.text, margin: "0 0 8px" }}>Interview Complete!</h2>
        <div style={{ fontSize: "44px", fontWeight: 800, color: C.pink, margin: "16px 0" }}>{avgScore}%</div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onRetry} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: "transparent", color: C.text, border: `1px solid ${C.cardBorder}`, cursor: "pointer" }}>Try Again</button>
          <button onClick={onNew} style={{ flex: 1, padding: "12px", borderRadius: "10px", background: C.pink, color: "white", border: "none", fontWeight: 600, cursor: "pointer" }}>Dashboard</button>
        </div>
      </div>
    </div>
  );
}

// ── Main Workspace Component ─────────────────────────────────────
const MockInterview = () => {
  const { interviewId } = useParams(); const navigate = useNavigate();
  const { startInterview, submitAnswer } = useInterview();
  const [sessionId, setSessionId] = useState(null); const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1); const [totalQuestions, setTotalQuestions] = useState(4);
  const [answer, setAnswer] = useState(""); const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false); const [isListening, setIsListening] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); const [showHint, setShowHint] = useState(false);
  const [allFeedback, setAllFeedback] = useState([]); const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    const start = async () => {
      const data = await startInterview(interviewId);
      if (data) { setSessionId(data.sessionId); setQuestion(data.question); if (data.totalQuestions) setTotalQuestions(data.totalQuestions); }
    };
    start();
  }, []);

  // Speech Recognition API Handler
  const startListening = () => {
    if (!window.webkitSpeechRecognition && !window.SpeechRecognition) {
      alert("Speech recognition profile parameters are unsupported inside this browser environment."); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR(); recognition.lang = "en-US"; recognition.start();
    setIsListening(true);
    recognition.onresult = (e) => { setAnswer(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false); recognition.onend = () => setIsListening(false);
  };

  const handleSubmit = async () => {
    if (!answer.trim()) return; setIsSubmitting(true);
    const data = await submitAnswer({ sessionId, candidateAnswer: answer });
    if (!data) { setIsSubmitting(false); return; }
    setFeedback(data.evaluation); setAllFeedback((p) => [...p, data.evaluation]); setAllQuestions((p) => [...p, question]);
    if (data.completed) setCompleted(true);
    else { setQuestion(data.nextQuestion); setQuestionNumber((n) => n + 1); setAnswer(""); setShowHint(false); }
    setIsSubmitting(false);
  };

  const testVoice = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/interview/speak", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: "Voice validation diagnostic initialising." }),
      });
      const blob = await response.blob(); new Audio(URL.createObjectURL(blob)).play();
    } catch (e) { console.log(e); }
  };

  if (completed) return <SummaryScreen allFeedback={allFeedback} questions={allQuestions} onRetry={() => window.location.reload()} onNew={() => navigate("/")} />;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column" }}>
      <style>{`* { box-sizing: border-box; }`}</style>
      
      {/* ── Navbar Matched 100% with image_db28a1 ── */}
      <header style={{ height: '92px', background: 'linear-gradient(to bottom, #110b24, #0e0a1a)', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', flexShrink: 0, boxShadow: `0 4px 24px rgba(7, 4, 14, 0.6)` }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#fff' }}>AI</div>
            <span style={{ fontSize: '20px', fontWeight: 800, background: `linear-gradient(135deg, #ffffff 30%, ${C.sub} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>Interview AI</span>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: C.pinkLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 700, color: C.pink, border: `2px solid ${C.pink}55` }}>R</div>
        </div>
      </header>

      {/* Main Framework Grid View */}
      <div style={{ flex: 1, width: "100%", maxWidth: "680px", margin: "32px auto 0", padding: "0 16px", display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted, marginBottom: "6px" }}>
            <span>Question {questionNumber} of {totalQuestions}</span>
            <span>{Math.round(((questionNumber - 1) / totalQuestions) * 100)}% done</span>
          </div>
          <div style={{ height: "4px", background: C.cardBorder, borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((questionNumber - 1) / totalQuestions) * 100}%`, background: C.pink, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {question && (
          <div style={{ background: C.cardBg, borderRadius: "14px", padding: "20px", border: `1px solid ${C.cardBorder}`, borderLeft: `4px solid ${C.pink}`, boxShadow: `0 4px 20px ${C.glow}11` }}>
            <p style={{ fontSize: "15px", color: C.text, margin: 0, lineHeight: 1.6 }}>{question.question}</p>
          </div>
        )}

        <div style={{ background: C.cardBg, borderRadius: "14px", padding: "16px 20px", border: `1px solid ${C.cardBorder}` }}>
          <Timer onTimeUp={handleSubmit} />
        </div>

        <div style={{ background: C.cardBg, borderRadius: "14px", padding: "20px", border: `1px solid ${C.cardBorder}`, display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={startListening} style={{ padding: "8px 16px", borderRadius: "8px", background: isListening ? `${C.pink}22` : C.pink, color: "white", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>{isListening ? "🎤 Listening..." : "🎤 Speak"}</button>
              <button onClick={testVoice} style={{ padding: "8px 16px", borderRadius: "8px", background: "transparent", color: C.muted, border: `1px solid ${C.cardBorder}`, fontSize: "13px", cursor: "pointer" }}>🔊 Test voice</button>
            </div>
            <button onClick={() => setShowHint(!showHint)} style={{ padding: "8px 14px", borderRadius: "8px", background: "transparent", border: `1px solid ${C.pink}`, color: C.sub, fontSize: "13px", cursor: "pointer" }}>✨ Need Hint?</button>
          </div>

          {showHint && (
            <div style={{ background: "#110b24", borderRadius: "10px", padding: "12px", border: `1px dashed ${C.cardBorder}` }}>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(question?.hintKeywords || ["Core Engineering", "Architecture Patterns"]).map((k, idx) => (
                  <span key={idx} style={{ fontSize: "12px", background: `${C.pink}22`, color: C.sub, padding: "3px 8px", borderRadius: "4px" }}>{k}</span>
                ))}
              </div>
            </div>
          )}

          <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." rows={5} style={{ width: "100%", borderRadius: "10px", border: `1px solid ${C.cardBorder}`, padding: "14px", fontSize: "15px", color: C.text, background: "#06030c", resize: "none", outline: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
          <button onClick={handleSubmit} disabled={isSubmitting} style={{ width: "100%", padding: "12px", borderRadius: "10px", background: `linear-gradient(135deg, ${C.pinkMid}, ${C.pink})`, color: "white", border: "none", fontSize: "14.5px", fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${C.glow}33` }}>{isSubmitting ? "Evaluating..." : "Submit answer"}</button>
        </div>

        {feedback && (
          <div style={{ background: C.cardBg, borderRadius: "14px", padding: "20px", border: `1px solid ${C.cardBorder}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <h4 style={{ margin: 0, color: C.text, fontSize: "14px" }}>Evaluation Feedback</h4>
              <span style={{ fontSize: "16px", fontWeight: 700, color: feedback.score >= 7 ? C.greenText : "#fcd34d" }}>{feedback.score}/10</span>
            </div>
            <p style={{ fontSize: "13px", color: C.muted, margin: 0, lineHeight: 1.5 }}>{feedback.feedback}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default MockInterview;