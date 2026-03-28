import google.generativeai as genai

def test_chat():
    api_key = "NOT_A_REAL_KEY"
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    formatted_history = [
        {"role": "user", "parts": ["System prompt context"]},
        {"role": "model", "parts": ["Understood. I am ready."]}
    ]
    try:
        chat = model.start_chat(history=formatted_history)
        print("Chat initialized successfully.")
    except Exception as e:
        print(f"Error initializing chat: {e}")

if __name__ == "__main__":
    test_chat()
