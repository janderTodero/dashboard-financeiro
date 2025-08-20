import { Outlet } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";


export default function App() {
  return (
    <PrivateRoute>
      <div className="app min-h-[100dvh]">
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </PrivateRoute>
  );
}
