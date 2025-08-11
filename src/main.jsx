import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import NewTransaction from "./pages/newTransaction.jsx";
import TransactionDetail from "./pages/TransactionDetail.jsx";
import EditTransaction from "./pages/EditTransaction.jsx";
import Transactions from "./pages/Transactions.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <TransactionsProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<App />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/transactions/new" element={<NewTransaction />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
            <Route path="/transactions/edit/:id" element={<EditTransaction />} />
          </Route>
        </Routes>
      </TransactionsProvider>
    </AuthProvider>
  </BrowserRouter>
);
