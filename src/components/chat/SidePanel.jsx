import { useState } from 'react'
import ResumeModal from './ResumeModal'

const SidePanel = ({
    userId,
    activeTab,
    onTabChange,
    profile,
    recommendedJobs,
    isLoading,
    error,
    isJobsLoading,
    jobsError,
    onAddSkill,
    onAddResume,
}) => {
    const [isAddingSkill, setIsAddingSkill] = useState(false)
    const [isSkillSubmitting, setIsSkillSubmitting] = useState(false)
    const [newSkill, setNewSkill] = useState('')
    const [skillError, setSkillError] = useState('')
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
    const skills = profile?.skills ?? []
    const resumes = profile?.cover_letters ?? []

    const closeSkillInput = () => {
        setIsAddingSkill(false)
        setNewSkill('')
        setSkillError('')
    }

    const handleAddSkill = async (event) => {
        event.preventDefault()

        const trimmedSkill = newSkill.trim()
        if (!trimmedSkill) return

        const isDuplicate = skills.some(
            (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase(),
        )

        if (isDuplicate) {
            setSkillError('이미 등록된 스킬입니다.')
            return
        }

        setIsSkillSubmitting(true)
        setSkillError('')

        try {
            await onAddSkill(trimmedSkill)
            closeSkillInput()
        } catch (requestError) {
            setSkillError(
                requestError instanceof TypeError
                    ? '스킬 추가 서버에 연결할 수 없습니다.'
                    : requestError.message,
            )
        } finally {
            setIsSkillSubmitting(false)
        }
    }

    const handleSkillKeyDown = (event) => {
        if (event.key === 'Escape') {
            closeSkillInput()
        }
    }

    return (
        <aside className="side-panel">
            <div className="panel-tabs" role="tablist" aria-label="사이드 패널">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'profile'}
                    className={activeTab === 'profile' ? 'active' : ''}
                    onClick={() => onTabChange('profile')}
                >
                    프로필
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeTab === 'jobs'}
                    className={activeTab === 'jobs' ? 'active' : ''}
                    onClick={() => onTabChange('jobs')}
                >
                    추천 공고
                </button>
            </div>

            <div className="panel-content">
                {activeTab === 'profile' && isLoading ? (
                    <p role="status">프로필을 불러오는 중입니다...</p>
                ) : activeTab === 'profile' && error ? (
                    <p role="alert">{error}</p>
                ) : activeTab === 'profile' ? (
                    <section className="profile-card" role="tabpanel">
                        <div className="avatar" aria-hidden="true">
                            {userId.charAt(0).toUpperCase() || '?'}
                        </div>
                        <h2>{userId}</h2>
                        <dl>
                            <div className="skills-section">
                                <dt className="skills-heading">
                                    <span>skills</span>
                                    <button
                                        type="button"
                                        className="add-skill-button"
                                        aria-label="스킬 추가"
                                        aria-expanded={isAddingSkill}
                                        onClick={() => setIsAddingSkill(true)}
                                    >
                                        +
                                    </button>
                                </dt>
                                <dd>
                                    {skills.length > 0 ? (
                                        <div className="skill-tags">
                                            {skills.map((skill, index) => (
                                                <span key={`${skill}-${index}`} className="skill-tag">{skill}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="empty-skills">등록된 스킬이 없습니다.</span>
                                    )}

                                    {isAddingSkill && (
                                        <form className="skill-form" onSubmit={handleAddSkill}>
                                            <input
                                                value={newSkill}
                                                onChange={(event) => {
                                                    setNewSkill(event.target.value)
                                                    setSkillError('')
                                                }}
                                                onKeyDown={handleSkillKeyDown}
                                                placeholder="예: React"
                                                aria-label="새 스킬"
                                                disabled={isSkillSubmitting}
                                                autoFocus
                                            />
                                            <div className="skill-form-actions">
                                                <button
                                                    type="submit"
                                                    className="skill-submit-button"
                                                    disabled={isSkillSubmitting || !newSkill.trim()}
                                                >
                                                    {isSkillSubmitting ? '추가 중...' : '추가'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="skill-cancel-button"
                                                    onClick={closeSkillInput}
                                                    disabled={isSkillSubmitting}
                                                >
                                                    취소
                                                </button>
                                            </div>
                                            {skillError && <p role="alert">{skillError}</p>}
                                        </form>
                                    )}
                                </dd>
                            </div>
                            <div className="resumes-section">
                                <dt className="resumes-heading">
                                    <span>나의 이력서</span>
                                    <span className="resumes-heading-actions">
                                        <span className="resume-count">{resumes.length}개</span>
                                        <button
                                            type="button"
                                            className="add-resume-button"
                                            aria-label="이력서 추가"
                                            onClick={() => setIsResumeModalOpen(true)}
                                        >
                                            +
                                        </button>
                                    </span>
                                </dt>
                                <dd>
                                    {resumes.length > 0 ? (
                                        <ul className="data-list">
                                            {resumes.map((item, index) => (
                                                <li key={`${item.title}-${index}`}>
                                                    <button type="button">
                                                        <strong>{item.title}</strong>
                                                        <span>{item.content}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="empty-resumes">등록된 이력서가 없습니다.</span>
                                    )}
                                </dd>
                            </div>
                        </dl>
                    </section>
                ) : isJobsLoading ? (
                    <p role="status">추천 공고를 불러오는 중입니다...</p>
                ) : jobsError ? (
                    <p role="alert">{jobsError}</p>
                ) : (
                    <section className="recommended-jobs" role="tabpanel">
                        <div className="recommended-jobs-heading">
                            <div>
                                <h2>추천 공고</h2>
                                <p>검색된 채용 공고를 확인해 보세요.</p>
                            </div>
                            <span>{recommendedJobs.length}개</span>
                        </div>

                        {recommendedJobs.length > 0 ? (
                            <ul className="job-list">
                                {recommendedJobs.map((job, index) => (
                                    <li key={job.id ?? `${job.title}-${index}`}>
                                        <button type="button" className="job-card">
                                            <strong>{job.title}</strong>
                                            <span className="job-company">{job.company}</span>
                                            {job.location && <span>{job.location}</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="empty-jobs">
                                <span aria-hidden="true">💼</span>
                                <strong>아직 추천 공고가 없습니다.</strong>
                                <p>공고를 검색하면 이곳에 표시됩니다.</p>
                            </div>
                        )}
                    </section>
                )}
            </div>
            {isResumeModalOpen && (
                <ResumeModal
                    isOpen={isResumeModalOpen}
                    onClose={() => setIsResumeModalOpen(false)}
                    onSave={onAddResume}
                />
            )}
        </aside>
    )
}

export default SidePanel
