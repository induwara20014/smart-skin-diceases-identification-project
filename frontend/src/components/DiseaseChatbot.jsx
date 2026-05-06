import React, { useMemo, useState, useRef, useEffect } from "react";
import { api } from "../api/client";

export default function DiseaseChatbot({ diseaseLabel, onChatFinished }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(() => [
    {
      from: "bot",
      text: "ආයුබෝවන්! මට ඔබට උදව් කරන්න පුළුවන්. රෝග ලක්ෂණ හෝ ප්‍රතිකාර ගැන අහන්න."
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const contextDiseaseLabel = useMemo(
    () => (diseaseLabel ? String(diseaseLabel) : null),
    [diseaseLabel]
  );

  // 🔽 Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🔽 Show context hint when disease changes
  useEffect(() => {
    if (contextDiseaseLabel) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: `You can ask about ${contextDiseaseLabel} symptoms, treatments, or precautions.`
        }
      ]);
    }
  }, [contextDiseaseLabel]);

  // ✅ FORMATTER (IMPORTANT)
  function formatMedicalResponse(data) {
    return {
      type: "medical",
      name: data.Name,
      symptoms: data.Symptoms || [],
      precautions: data.Precautions || [],
      treatments: data.Treatments || []
    };
  }

  // 🔽 Send message
  async function onSend(e, quickMsg = null) {
    e?.preventDefault();

    const text = (quickMsg || message).trim();
    if (!text) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setMessage("");
    setLoading(true);

    try {
      const isSinhala = /[\u0D80-\u0DFF]/.test(text);

      const res = await api.post("/api/chat", {
        message: text,
        diseaseLabel: contextDiseaseLabel,
        chatHistory: messages.slice(-5),
        language: isSinhala ? "si" : "en"
      });

      let botMessage;

      if (typeof res.data === "object") {
        botMessage = formatMedicalResponse(res.data);
      } else {
        botMessage = res.data;
      }

      setMessages((prev) => [...prev, { from: "bot", text: botMessage }]);
      if (onChatFinished) onChatFinished();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text:
            err?.response?.data?.message ||
            "සම්බන්ධතා ගැටළුවක්. කරුණාකර නැවත උත්සාහ කරන්න."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card flex flex-col h-[520px] border-blue-100 overflow-hidden shadow-lg">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 text-white">
        <h3 className="font-semibold">SkinMage Assistant</h3>
        <p className="text-xs text-blue-100">AI Medical Consultation</p>
      </div>

      {/* Context */}
      {contextDiseaseLabel && (
        <div className="bg-blue-50 px-4 py-2 text-xs text-blue-800">
          Discussing: <b>{contextDiseaseLabel}</b>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-2 rounded-xl text-sm ${
                m.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white border"
              }`}
            >

              {/* 🔥 SMART RENDER */}
              {typeof m.text === "string" ? (
                m.text
              ) : m.text.type === "medical" ? (
                <div className="space-y-3">

                  {/* Disease Name */}
                  <div className="font-bold text-indigo-700 flex items-center gap-2">
                    🦠 {m.text.name}
                  </div>

                  {/* Symptoms */}
                  <div>
                    <div className="text-xs font-semibold text-red-500 mb-1">
                      🩺 Symptoms
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {m.text.symptoms.map((s, i) => (
                        <span
                          key={i}
                          className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-xs"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Precautions */}
                  <div>
                    <div className="text-xs font-semibold text-blue-500 mb-1">
                      🛡️ Precautions
                    </div>
                    <ul className="list-disc pl-4 text-xs text-gray-700">
                      {m.text.precautions.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Treatments */}
                  <div>
                    <div className="text-xs font-semibold text-green-500 mb-1">
                      💊 Treatments
                    </div>
                    <ul className="list-disc pl-4 text-xs text-gray-700">
                      {m.text.treatments.map((t, i) => (
                        <li key={i}>
                          <span className="font-semibold text-gray-800">
                            {t.split(":")[0]}:
                          </span>
                          {t.split(":").slice(1).join(":")}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Disclaimer */}
                  <div className="text-[10px] text-gray-400 border-t pt-2">
                    ⚠️ This is not a medical diagnosis. Please consult a doctor.
                  </div>

                </div>
              ) : null}

            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="text-sm text-gray-500">Typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="px-3 py-2 flex flex-wrap gap-2 bg-white border-t">
        {["Is this dangerous?", "How to treat it?", "Can it spread?"].map(
          (q) => (
            <button
              key={q}
              onClick={(e) => onSend(e, q)}
              className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-blue-100"
            >
              {q}
            </button>
          )
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t">
        <form onSubmit={onSend} className="flex gap-2">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}