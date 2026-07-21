import Login from '../components/login'
import './Home.css'

const Home = () => (
    <main className="home-page">
        <section className="login-card" aria-labelledby="login-title">
            <header className="login-card-header">
                <div className="brand-mark" aria-hidden="true">J</div>
                <span className="brand-name">JOBFIT</span>
                <h1 id="login-title">나에게 맞는 커리어를 찾아보세요</h1>
                <p>아이디를 입력하면 맞춤 채용 공고 탐색을 시작합니다.</p>
            </header>
            <Login />
        </section>
        <p className="home-footer">AI CAREER PARTNER · JOBFIT</p>
    </main>
)

export default Home
