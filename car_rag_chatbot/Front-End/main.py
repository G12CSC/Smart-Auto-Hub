import streamlit as st
import requests

# Backend API URL
API_URL = "http://localhost:8000/api/v1/chat"

# Page config
st.set_page_config(
    page_title="Car Selling ChatBot",
    layout="wide"
)

st.title("🚗 Car Seller Assistant")

# Initialize chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display previous messages
for message in st.session_state.messages:
    with st.chat_message(message["role"], avatar="👤" if message["role"] == "user" else "🤖"):
        st.markdown(message["content"])

# User input
if prompt := st.chat_input("Ask me about available cars..."):

    # Add user message (RIGHT side automatically)
    st.session_state.messages.append({
        "role": "user",
        "content": prompt
    })

    with st.chat_message("user", avatar="👤"):
        st.markdown(prompt)

    # Call backend
    try:
        response = requests.post(API_URL, json={"query": prompt})

        if response.status_code == 200:
            data = response.json()
            bot_reply = data.get("answer", "No answer returned from backend.")
        else:
            bot_reply = f"Error: {response.status_code}"

    except Exception as e:
        bot_reply = "⚠️ Failed to connect to backend."

    # Add assistant message (LEFT side automatically)
    st.session_state.messages.append({
        "role": "assistant",
        "content": bot_reply
    })

    with st.chat_message("assistant", avatar="🤖"):
        st.markdown(bot_reply)
