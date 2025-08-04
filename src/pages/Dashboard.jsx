import { useContext } from "react";
import { AuthContext } from "../context/authContext";


export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <>
          <p>Token JWT ativo.</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Você não está autenticado.</p>
      )}
    </div>
  );
}
