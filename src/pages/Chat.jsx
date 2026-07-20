import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChatPanel from '../components/chat/ChatPanel'
import SidePanel from '../components/chat/SidePanel'
import { clearUserUuid, getUserUuid } from '../utils/auth'
import './Chat.css'

const API_URL = 'http://localhost:8000'

const Chat = () => {
    const navigate = useNavigate()
    const [userUuid] = useState(() => getUserUuid())
    const [sidePanelTab, setSidePanelTab] = useState('profile')
    const [profile, setProfile] = useState(null)
    const [recommendedJobs, setRecommendedJobs] = useState([])
    const [isProfileLoading, setIsProfileLoading] = useState(true)
    const [profileError, setProfileError] = useState('')
    const [isJobsLoading, setIsJobsLoading] = useState(true)
    const [jobsError, setJobsError] = useState('')
    const [message, setMessage] = useState('')
    const [isChatLoading, setIsChatLoading] = useState(false)
    const [chatError, setChatError] = useState('')
    const [messages, setMessages] = useState([
        { id: 1, sender: 'assistant', text: '안녕하세요! \n저는 당신의 취업 파트너 jobfit입니다. \n저의 목적은 크게 두가지입니다. 당신에게 안맞는 채용 공고를 검색하고 공고의 자격 요건 등을 사용자에게 얼마나 적절한지 확인합니다.' },
    ])

    const displayName = profile?.name || '사용자'

    const fetchRecommendedJobs = useCallback(async (signal) => {
        if (!userUuid) {
            setIsJobsLoading(false)
            return
        }

        setIsJobsLoading(true)
        setJobsError('')

        try {
            const response = await fetch(
                `${API_URL}/postings/${encodeURIComponent(userUuid)}`,
                { signal },
            )

            if (!response.ok) {
                throw new Error(`추천 공고를 불러오지 못했습니다. (${response.status})`)
            }

            const postings = await response.json()

            if (!Array.isArray(postings)) {
                throw new Error('추천 공고 응답 형식이 올바르지 않습니다.')
            }

            setRecommendedJobs(postings.map((posting) => ({
                id: posting.id,
                company: posting.company_name,
                title: posting.job_title,
                location: posting.location,
            })))
        } catch (requestError) {
            if (requestError.name !== 'AbortError') {
                setJobsError(
                    requestError instanceof TypeError
                        ? '추천 공고 서버에 연결할 수 없습니다.'
                        : requestError.message,
                )
            }
        } finally {
            if (!signal?.aborted) {
                setIsJobsLoading(false)
            }
        }
    }, [userUuid])

    useEffect(() => {
        if (!userUuid) {
            setIsProfileLoading(false)
            navigate('/', { replace: true })
            return undefined
        }

        const controller = new AbortController()

        const fetchProfile = async () => {
            setIsProfileLoading(true)
            setProfileError('')

            try {
                const response = await fetch(
                    `${API_URL}/profile/${encodeURIComponent(userUuid)}`,
                    { signal: controller.signal },
                )

                if (!response.ok) {
                    throw new Error(`프로필을 불러오지 못했습니다. (${response.status})`)
                }

                const profileData = await response.json()
                setProfile(profileData)
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setProfileError(
                        requestError instanceof TypeError
                            ? '프로필 서버에 연결할 수 없습니다.'
                            : requestError.message,
                    )
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsProfileLoading(false)
                }
            }
        }

        fetchProfile()

        return () => controller.abort()
    }, [navigate, userUuid])

    useEffect(() => {
        const controller = new AbortController()

        fetchRecommendedJobs(controller.signal)

        return () => controller.abort()
    }, [fetchRecommendedJobs])

    const handleLogout = () => {
        clearUserUuid()
        navigate('/', { replace: true })
    }

    const handleAddSkill = async (skill) => {
        if (!userUuid) {
            throw new Error('로그인 정보가 없습니다.')
        }

        const response = await fetch(`${API_URL}/profile/add_skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_uuid: userUuid,
                skill,
            }),
        })

        if (!response.ok) {
            let errorMessage = `스킬 추가에 실패했습니다. (${response.status})`

            try {
                const errorData = await response.json()
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail
                }
            } catch {
                // JSON 응답이 아니면 기본 오류 메시지를 사용한다.
            }

            throw new Error(errorMessage)
        }

        setProfile((currentProfile) => ({
            ...currentProfile,
            skills: [...(currentProfile?.skills ?? []), skill],
        }))
    }

    const handleAddResume = async (resume) => {
        const response = await fetch(`${API_URL}/profile/documents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_uuid: userUuid,
                title: resume.title,
                content: resume.content,
            }),
        })

        if (!response.ok) {
            let errorMessage = `이력서 저장에 실패했습니다. (${response.status})`

            try {
                const errorData = await response.json()
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail
                }
            } catch {
                // JSON 응답이 아니면 기본 오류 메시지를 사용한다.
            }

            throw new Error(errorMessage)
        }

        setProfile((currentProfile) => ({
            ...currentProfile,
            cover_letters: [...(currentProfile?.cover_letters ?? []), resume],
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const trimmedMessage = message.trim()
        if (!trimmedMessage || isChatLoading) return

        if (!userUuid) {
            setChatError('로그인 정보가 없습니다.')
            return
        }

        setMessages((currentMessages) => [
            ...currentMessages,
            { id: crypto.randomUUID(), sender: 'user', text: trimmedMessage },
        ])
        setMessage('')
        setIsChatLoading(true)
        setChatError('')

        try {
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_uuid: userUuid,
                    message: trimmedMessage,
                }),
            })

            if (!response.ok) {
                let errorMessage = `메시지 전송에 실패했습니다. (${response.status})`

                try {
                    const errorData = await response.json()
                    if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail
                    }
                } catch {
                    // JSON 응답이 아니면 기본 오류 메시지를 사용한다.
                }

                throw new Error(errorMessage)
            }

            const contentType = response.headers.get('content-type') ?? ''
            const responseData = contentType.includes('application/json')
                ? await response.json()
                : await response.text()

            const assistantMessage = typeof responseData === 'string'
                ? responseData
                : responseData.message
                    ?? responseData.response
                    ?? responseData.answer
                    ?? responseData.content

            if (typeof assistantMessage !== 'string') {
                throw new Error('채팅 응답에서 메시지를 찾을 수 없습니다.')
            }

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    id: crypto.randomUUID(),
                    sender: 'assistant',
                    text: assistantMessage,
                },
            ])

            void fetchRecommendedJobs()
        } catch (requestError) {
            setChatError(
                requestError instanceof TypeError
                    ? '채팅 서버에 연결할 수 없습니다.'
                    : requestError.message,
            )
        } finally {
            setIsChatLoading(false)
        }
    }

    return (
        <main className="chat-page">
            <ChatPanel
                userId={displayName}
                messages={messages}
                message={message}
                onMessageChange={setMessage}
                onSubmit={handleSubmit}
                onLogout={handleLogout}
                isLoading={isChatLoading}
                error={chatError}
            />
            <SidePanel
                userId={displayName}
                activeTab={sidePanelTab}
                onTabChange={setSidePanelTab}
                profile={profile}
                recommendedJobs={recommendedJobs}
                isLoading={isProfileLoading}
                error={profileError}
                isJobsLoading={isJobsLoading}
                jobsError={jobsError}
                onAddSkill={handleAddSkill}
                onAddResume={handleAddResume}
            />
        </main>
    )
}

export default Chat
