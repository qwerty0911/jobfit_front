import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGIN_URL = 'http://localhost:8000/login';

const Login = () => {
    const [userId, setUserId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        const trimmedUserId = userId.trim();
        if (!trimmedUserId) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(LOGIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: trimmedUserId }),
            });

            if (!response.ok) {
                throw new Error(`로그인 요청이 실패했습니다. (${response.status})`);
            }

            navigate(`/chat/${encodeURIComponent(trimmedUserId)}`);
        } catch (requestError) {
            setError(
                requestError instanceof TypeError
                    ? '서버에 연결할 수 없습니다. 백엔드 서버를 확인해 주세요.'
                    : requestError.message,
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>login 모달</h2>
            <p>
                <input
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="아이디를 입력하세요"
                    aria-label="아이디"
                    autoComplete="username"
                />
            </p>
            <button type="submit" disabled={isLoading || !userId.trim()}>
                {isLoading ? '로그인 중...' : 'login'}
            </button>
            {error && <p role="alert">{error}</p>}
        </form>
    )

}

export default Login
