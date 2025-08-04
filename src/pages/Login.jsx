import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password , setPassword ] = useState("");
    const [error, setError ] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/auth/login", { email, password });
            const { token } = response.data;

            login(token);

            navigate("/dashboard");
        } catch (error) {
            console.error(error)
            setError("Inválid email, or password.")
        }
    };

    return (
        <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
    )
}