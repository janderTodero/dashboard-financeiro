import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register () {
    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const [name, setName] = useState("");
    const [email, setEmail]= useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(password !== confirmPassword) {
            setError("Password confirmation does not match")
            return
        }

        try {
            const response = await api.post("/auth/register", { name, email, password});
            const { token } = response.data;

            login(token)
            navigate("/dashboard")
        } catch (error) {
            console.error(error)

            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Erro ao registrar. Tente novamente.");
            }
        }
    };

    return(
         <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
    )
}