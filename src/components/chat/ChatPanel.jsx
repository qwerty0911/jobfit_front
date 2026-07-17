const ChatPanel = ({
    userId,
    messages,
    message,
    onMessageChange,
    onSubmit,
    onLogout,
    isLoading,
    error,
}) => (
    <section className="chat-panel" aria-label="채팅">
        <header className="chat-header">
            <div>
                <span className="eyebrow">JOBFIT CHAT</span>
                <h1>{userId}님의 채팅</h1>
            </div>
            <div className="chat-header-actions">
                <span className="connection-status">
                    <span className="status-dot" /> 온라인
                </span>
                <button type="button" className="logout-button" onClick={onLogout}>
                    로그아웃
                </button>
            </div>
        </header>

        <div className="message-list" aria-live="polite">
            {messages.map((item) => (
                <div key={item.id} className={`message-row ${item.sender}`}>
                    <div className="message-bubble">{item.text}</div>
                </div>
            ))}
            {isLoading && (
                <div className="message-row assistant">
                    <div className="message-bubble typing-message" role="status">
                        답변을 생성하고 있습니다...
                    </div>
                </div>
            )}
        </div>

        <form className="message-form" onSubmit={onSubmit}>
            <div className="message-input-area">
                <input
                    value={message}
                    onChange={(event) => onMessageChange(event.target.value)}
                    placeholder="메시지를 입력하세요"
                    aria-label="메시지"
                    disabled={isLoading}
                />
                {error && <span className="chat-error" role="alert">{error}</span>}
            </div>
            <button type="submit" disabled={isLoading || !message.trim()}>
                {isLoading ? '전송 중...' : '전송'}
            </button>
        </form>
    </section>
)

export default ChatPanel
