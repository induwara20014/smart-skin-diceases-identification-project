// services/pythonChatService.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function getPythonChatReply({ message, disease, chatHistory }) {
  try {
    const response = await fetch("http://localhost:5005/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        disease,
        chat_history: chatHistory || [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Python chatbot returned status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.reply;

    // Check if the reply is in the structured format (Name: ..., Symptoms: ..., etc.)
    if (replyText.includes("Name:") && replyText.includes("Symptoms:") && replyText.includes("Treatments:")) {
      try {
        const lines = replyText.split("\n");
        const parsed = {};
        lines.forEach(line => {
          const [key, ...val] = line.split(":");
          if (key && val.length > 0) {
            const k = key.trim();
            const v = val.join(":").trim();
            if (k === "Symptoms" || k === "Precautions" || k === "Treatments") {
              parsed[k] = v.split(",").map(item => item.trim());
            } else {
              parsed[k] = v;
            }
          }
        });
        if (parsed.Name) return parsed;
      } catch (e) {
        console.error("Failed to parse structured chatbot reply:", e);
      }
    }

    return replyText;
  } catch (err) {
    console.error("Python chatbot error:", err.message);
    return "Python chatbot failed. Please try again later.";
  }
}

module.exports = { getPythonChatReply };