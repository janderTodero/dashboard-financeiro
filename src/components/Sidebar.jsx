import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { FiBarChart2 } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";
import { BsGear } from "react-icons/bs";
import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="bg-zinc-900 h-screen w-[300px] text-white">
      <div className="pt-10 ml-5">
        <h2>
          Bem-vindo,{" "}
          <strong className="font-bold text-blue-700">{user.name}!</strong>
        </h2>
      </div>

      <div className="flex flex-col gap-4 mt-12 ml-5">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="text-2xl text-blue-700" />
          <Link to={"/"}>
            <h3>Visão geral</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <FiActivity className="text-2xl text-blue-700" />
          <Link to={"/"}>
            <h3>Gráficos</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <HiMiniArrowPathRoundedSquare className="text-2xl text-blue-700" />
          <Link to={"/"}>
            <h3>Transações</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <BsGear className="text-2xl text-blue-700" />
          <Link to={"/"}>
            <h3>Configurações</h3>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <TbLogout2 className="text-2xl text-blue-700" />
          <button onClick={logout} className="cursor-pointer">
            <h3>Sair</h3>
          </button>
        </div>
      </div>
    </div>
  );
}
