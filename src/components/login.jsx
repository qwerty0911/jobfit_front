import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveUserUuid } from '../utils/auth';

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

            const loginData = await response.json();

            if (!loginData.user_uuid) {
                throw new Error('로그인 응답에 user_uuid가 없습니다.');
            }

            saveUserUuid(loginData.user_uuid);
            navigate('/chat');
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
        <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
                <label htmlFor="user-id">아이디</label>
                <input
                    id="user-id"
                    value={userId}
                    onChange={(event) => {
                        setUserId(event.target.value);
                        setError('');
                    }}
                    placeholder="아이디를 입력하세요"
                    autoComplete="username"
                    disabled={isLoading}
                    autoFocus
                />
            </div>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button
                className="login-submit-button"
                type="submit"
                disabled={isLoading || !userId.trim()}
            >
                <span>{isLoading ? '로그인 중...' : '시작하기'}</span>
                {!isLoading && <span aria-hidden="true">→</span>}
            </button>
        </form>
    )

}

export default Login
