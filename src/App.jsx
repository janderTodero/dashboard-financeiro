import { Outlet } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";


export default function App() {
  return (
    <PrivateRoute>
      <div className="app">
        <Outlet />
      </div>
    </PrivateRoute>
  );
}
