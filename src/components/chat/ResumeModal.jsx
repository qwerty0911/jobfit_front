import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const ResumeModal = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isOpen) return undefined

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, isSubmitting, onClose])

    if (!isOpen) return null

    const handleSubmit = async (event) => {
        event.preventDefault()

        const trimmedTitle = title.trim()
        const trimmedContent = content.trim()
        if (!trimmedTitle || !trimmedContent) return

        setIsSubmitting(true)
        setError('')

        try {
            await onSave({ title: trimmedTitle, content: trimmedContent })
            setTitle('')
            setContent('')
            onClose()
        } catch (requestError) {
            setError(requestError.message || '이력서 저장에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
            onClose()
        }
    }

    return createPortal(
        <div className="modal-backdrop" onMouseDown={handleBackdropClick}>
            <section
                className="resume-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="resume-modal-title"
            >
                <header className="resume-modal-header">
                    <div>
                        <span className="eyebrow">NEW RESUME</span>
                        <h2 id="resume-modal-title">새 이력서 작성</h2>
                    </div>
                    <button
                        type="button"
                        className="modal-close-button"
                        aria-label="모달 닫기"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        ×
                    </button>
                </header>

                <form className="resume-form" onSubmit={handleSubmit}>
                    <label htmlFor="resume-title">제목</label>
                    <input
                        id="resume-title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="예: 프론트엔드 개발자 이력서"
                        disabled={isSubmitting}
                        autoFocus
                    />

                    <label htmlFor="resume-content">내용</label>
                    <textarea
                        id="resume-content"
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="경력, 프로젝트, 강점 등을 입력하세요."
                        rows="12"
                        disabled={isSubmitting}
                    />

                    {error && <p className="resume-form-error" role="alert">{error}</p>}

                    <div className="resume-modal-actions">
                        <button
                            type="button"
                            className="resume-cancel-button"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="resume-save-button"
                            disabled={isSubmitting || !title.trim() || !content.trim()}
                        >
                            {isSubmitting ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </section>
        </div>,
        document.body,
    )
}

export default ResumeModal
