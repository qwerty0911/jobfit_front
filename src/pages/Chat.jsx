import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ChatPanel from '../components/chat/ChatPanel'
import SidePanel from '../components/chat/SidePanel'
import './Chat.css'

const profile = {
    role: 'Frontend Developer',
    email: 'jobfit@example.com',
    status: '취업 준비 중',
}

const dataList = [
    { id: 1, title: '자기소개서', description: '최근 수정 2시간 전' },
    { id: 2, title: '이력서', description: '최근 수정 1일 전' },
    { id: 3, title: '면접 기록', description: '3개의 기록' },
]

const Chat = () => {
    const { userId } = useParams()
    const [panel, setPanel] = useState('profile')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([
        { id: 1, sender: 'assistant', text: '안녕하세요! 오늘은 어떤 도움이 필요하신가요?' },
    ])

    const decodedUserId = decodeURIComponent(userId ?? '')

    const handleSubmit = (event) => {
        event.preventDefault()

        const trimmedMessage = message.trim()
        if (!trimmedMessage) return

        setMessages((currentMessages) => [
            ...currentMessages,
            { id: Date.now(), sender: 'user', text: trimmedMessage },
        ])
        setMessage('')
    }

    return (
        <main className="chat-page">
            <ChatPanel
                userId={decodedUserId}
                messages={messages}
                message={message}
                onMessageChange={setMessage}
                onSubmit={handleSubmit}
            />
            <SidePanel
                userId={decodedUserId}
                panel={panel}
                onPanelChange={setPanel}
                profile={profile}
                dataList={dataList}
            />
        </main>
    )
}

export default Chat
