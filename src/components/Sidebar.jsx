import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FiBarChart2 } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";
import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    if (onNavigate) onNavigate();
  };

  return (
    <div className="bg-zinc-900 h-full w-[300px] text-white">
      <div className="pt-10 ml-5">
        <h2>
          Bem-vindo,{" "}
          <strong className="font-bold text-purple-400">{user.name}!</strong>
        </h2>
      </div>

      <div className="flex flex-col gap-4 mt-12 ml-5">
        <div className="flex items-center gap-2">
          <CiCirclePlus className="text-2xl text-purple-400" />
          <Link to={"/transactions/new"} onClick={onNavigate}>
            <h3>Nova Transação</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FiBarChart2 className="text-2xl text-purple-400" />
          <Link to={"/"} onClick={onNavigate}>
            <h3>Visão geral</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <HiMiniArrowPathRoundedSquare className="text-2xl text-purple-400" />
          <Link to={"/transactions"} onClick={onNavigate}>
            <h3>Gerenciar Transações</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FiActivity className="text-2xl text-purple-400" />
          <Link to={"/transactions/reports"} onClick={onNavigate}>
            <h3>Relátorio Comparativo</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FiActivity className="text-2xl text-purple-400" />
          <Link to={"/transactions/import"} onClick={onNavigate}>
            <h3>Importar transações via CSV</h3>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <TbLogout2 className="text-2xl text-purple-400" />
          <button onClick={handleLogout} className="cursor-pointer">
            <h3>Sair</h3>
          </button>
        </div>
      </div>
    </div>
  );
}