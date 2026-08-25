export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" role="status" aria-label="Typing">
      <span className="typing-dot" style={{ animationDelay: "0ms" }} />
      <span className="typing-dot" style={{ animationDelay: "150ms" }} />
      <span className="typing-dot" style={{ animationDelay: "300ms" }} />
    </div>
  );
}
