// filepath: /Users/mrrobot/VSCodeProjects/openai-assistants/hsb/hsb-ui/src/components/ChatMessage.js
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ message }) {
  // For debugging
  console.log("ChatMessage received:", message); 

  // Destructure the message props
  const { role, content } = message || {};

  return (
    <div className={`chat-message ${role}`}>
      <div className="message-bubble">
        <div className="message-sender">
          {role === "user" ? "You" : "Ham Shack Buddy"}
        </div>
        <div className="message-content">
          {typeof content === "string" ? (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={materialLight}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          ) : (
            <p>Invalid content</p> // Fallback for non-string content
          )}
        </div>
      </div>
    </div>
  );
}