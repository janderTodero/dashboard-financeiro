import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { TransactionsProvider } from "./context/TransactionsContext.jsx";
import NewTransaction from "./pages/NewTransaction.jsx";
import TransactionDetail from "./pages/TransactionDetail.jsx";
import EditTransaction from "./pages/EditTransaction.jsx";
import Transactions from "./pages/Transactions.jsx";
import Reports from "./pages/Reports.jsx";
import ImportCSV from "./pages/ImportCSV.jsx";
import ImportBankStatement from "./pages/ImportBankStatement.jsx";

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
            <Route path="/transactions/reports" element={<Reports />} />
            <Route path="/transactions/import" element={<ImportCSV />} />
            <Route path="/transactions/import-bank-statement" element={<ImportBankStatement />} />
          </Route>
        </Routes>
      </TransactionsProvider>
    </AuthProvider>
  </BrowserRouter>
);
