import React, { useState, FormEvent } from 'react';

interface FormState {
  email: string;
  password: string;
}

const Input: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    email: '',
    password: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    console.log('폼 제출됨:', formData);

    setFormData({ email: '', password: '' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        {/* 이메일 입력 필드 */}
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="입력"
          />
        </div>

        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="입력"
            minLength={6} // 최소 길이 설정
          />
        </div>

        <button type="submit" className="submit-button">
          로그인 하기
        </button>
      </form>
    </div>
  );
};

export default Input;
