const ChatPanel = ({
    userId,
    messages,
    message,
    onMessageChange,
    onSubmit,
}) => (
    <section className="chat-panel" aria-label="채팅">
        <header className="chat-header">
            <div>
                <span className="eyebrow">JOBFIT CHAT</span>
                <h1>{userId}님의 채팅</h1>
            </div>
            <span className="connection-status">
                <span className="status-dot" /> 온라인
            </span>
        </header>

        <div className="message-list" aria-live="polite">
            {messages.map((item) => (
                <div key={item.id} className={`message-row ${item.sender}`}>
                    <div className="message-bubble">{item.text}</div>
                </div>
            ))}
        </div>

        <form className="message-form" onSubmit={onSubmit}>
            <input
                value={message}
                onChange={(event) => onMessageChange(event.target.value)}
                placeholder="메시지를 입력하세요"
                aria-label="메시지"
            />
            <button type="submit" disabled={!message.trim()}>전송</button>
        </form>
    </section>
)

export default ChatPanel
