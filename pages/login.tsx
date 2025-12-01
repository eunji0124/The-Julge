import { useState } from "react";
import { login } from "@/lib/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("userId", res.user.item.id);

      alert("로그인 성공!");
      window.location.href = "/notifications-demo";
    } catch (err) {
      alert("로그인 실패!");
    }
  };

  return (
    <div className="p-10 flex flex-col gap-3">
      <input
        className="border p-2"
        placeholder="이메일"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2"
        placeholder="비밀번호"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="border p-3" onClick={handleLogin}>
        로그인
      </button>
    </div>
  );
}
