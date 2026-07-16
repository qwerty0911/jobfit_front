const SidePanel = ({
    userId,
    panel,
    onPanelChange,
    profile,
    dataList,
}) => (
    <aside className="side-panel">
        <div className="panel-tabs" role="tablist" aria-label="사이드 패널">
            <button
                type="button"
                role="tab"
                aria-selected={panel === 'profile'}
                className={panel === 'profile' ? 'active' : ''}
                onClick={() => onPanelChange('profile')}
            >
                프로필
            </button>
            <button
                type="button"
                role="tab"
                aria-selected={panel === 'data'}
                className={panel === 'data' ? 'active' : ''}
                onClick={() => onPanelChange('data')}
            >
                목록
            </button>
        </div>

        <div className="panel-content">
            {panel === 'profile' ? (
                <section className="profile-card" role="tabpanel">
                    <div className="avatar" aria-hidden="true">
                        {userId.charAt(0).toUpperCase() || '?'}
                    </div>
                    <h2>{userId}</h2>
                    <p className="profile-role">{profile.role}</p>
                    <dl>
                        <div>
                            <dt>skills</dt>
                            <dd>{profile.email}</dd>
                        </div>
                        <div>
                            <dt>나의 이력서</dt>
                            <dd>{profile.status}</dd>
                        </div>
                    </dl>
                </section>
            ) : (
                <section role="tabpanel">
                    <div className="list-heading">
                        <h2>내 데이터</h2>
                        <span>{dataList.length}개</span>
                    </div>
                    <ul className="data-list">
                        {dataList.map((item) => (
                            <li key={item.id}>
                                <button type="button">
                                    <strong>{item.title}</strong>
                                    <span>{item.description}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    </aside>
)

export default SidePanel
