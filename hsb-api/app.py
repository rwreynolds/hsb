from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
from openai import OpenAI
import time

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure CORS for Next.js frontend
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

# Configure OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
ASSISTANT_ID = os.getenv("OPENAI_ASSISTANT_ID")

@app.route('/api/ping', methods=['GET'])
def ping():
    return jsonify({"status": "ok", "message": "API is running"})

@app.route('/api/chat', methods=['POST'])
def chat():
    # Get user message from request
    data = request.json
    user_message = data.get('message')
    thread_id = data.get('thread_id')
    
    # Create a new thread if one doesn't exist
    if not thread_id:
        thread = client.beta.threads.create()
        thread_id = thread.id
    
    # Add the user message to the thread
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_message
    )
    
    # Run the assistant on the thread
    run = client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ASSISTANT_ID
    )
    
    # Wait for the run to complete
    while True:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
        )
        if run_status.status == 'completed':
            break
        elif run_status.status == 'failed':
            return jsonify({
                'error': 'Assistant run failed',
                'thread_id': thread_id
            }), 500
        time.sleep(1)
    
    # Get messages from the thread
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    
    # Get the last assistant message
    assistant_messages = [
        msg for msg in messages.data 
        if msg.role == "assistant" and msg.created_at > run.created_at
    ]
    
    if assistant_messages:
        last_message = assistant_messages[0]
        assistant_response = last_message.content[0].text.value
    else:
        assistant_response = "No response from assistant."
    
    # Return the response and thread ID
    return jsonify({
        'response': assistant_response,
        'thread_id': thread_id
    })

@app.route('/api/threads', methods=['GET'])
def get_threads():
    # List all threads
    threads = client.beta.threads.list()
    return jsonify({
        'threads': [{'id': thread.id, 'created_at': thread.created_at} for thread in threads.data]
    })

@app.route('/api/threads/<thread_id>', methods=['GET'])
def get_thread(thread_id):
    # Get messages from a specific thread
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    return jsonify({
        'messages': [
            {
                'id': msg.id,
                'role': msg.role,
                'content': msg.content[0].text.value if msg.content else None,
                'created_at': msg.created_at
            } 
            for msg in messages.data
        ]
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
