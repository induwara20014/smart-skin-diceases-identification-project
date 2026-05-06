# chatbot_langchain_gemini_sinhala_dynamic.py
from flask import Flask, request, jsonify
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

# Initialize Gemini client via LangChain
gemini_model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    temperature=0.2
)

# System message template
system_template = """You are a professional medical chatbot. 
When providing details about a skin disease, you MUST respond in this EXACT format for the UI to parse it:

Name: <Disease Name>
Symptoms: <Symptom 1, Symptom 2...>
Precautions: <Precaution 1, Precaution 2...>
Treatments: <Treatment 1, Treatment 2...>

Keep the response strictly in this format. Do not use markdown bolding in the labels."""
system_prompt = SystemMessagePromptTemplate.from_template(system_template)

# Human message template
human_template = """
User Input: "{disease_name}"
Context/History:
{history}
"""
human_prompt = HumanMessagePromptTemplate.from_template(human_template)

chat_prompt = ChatPromptTemplate.from_messages([system_prompt, human_prompt])

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    disease_name = data.get("message", "").strip().lower()  
    chat_history = data.get("chat_history", [])
    history_text = "\n".join([f"{m.get('from', 'user')}: {m.get('text', '')}" for m in chat_history]) or "None"

    prompt_values = {
        "disease_name": disease_name,
        "history": history_text
    }

    try:
        # Generate reply via LangChain Gemini model
        reply = gemini_model.invoke(chat_prompt.format_prompt(**prompt_values).to_messages())
        text = reply.content
    except Exception as e:
        print("Gemini LangChain error:", e)
        text = "I'm sorry, I'm having trouble connecting to my knowledge base. Please try typing the specific disease name again (e.g., Acne, Eczema)."

    return jsonify({"reply": text})


if __name__ == "__main__":
    app.run(port=5005, debug=True)