import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TimelineIcon from "@mui/icons-material/Timeline";
import GroupsIcon from "@mui/icons-material/Groups";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import TvIcon from "@mui/icons-material/Tv";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import "./styles.scss";

type Props = Record<string, never>;

const Navigation: React.FC<Props> = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="navigation">
      <div
        className={`navigation__item ${location.pathname === "/" && "active"}`}
        onClick={() => navigate("/")}
      >
        <TimelineIcon className="navigation__icon" />
        <p className="navigation__label">Dashboard</p>
      </div>

      <div
        className={`navigation__item ${
          location.pathname === "/users" && "active"
        }`}
        onClick={() => navigate("/users")}
      >
        <GroupsIcon className="navigation__icon" />
        <p className="navigation__label">Usuários</p>
      </div>

      <div
        className={`navigation__item ${
          location.pathname === "/companies" && "active"
        }`}
        onClick={() => navigate("/companies")}
      >
        <CorporateFareIcon className="navigation__icon" />
        <p className="navigation__label">Empresas</p>
      </div>

      <div
        className={`navigation__item ${
          location.pathname === "/packages" && "active"
        }`}
        onClick={() => navigate("/packages")}
      >
        <AutoAwesomeMotionIcon className="navigation__icon" />
        <p className="navigation__label">Pacotes</p>
      </div>

      <div
        className={`navigation__item ${
          location.pathname === "/channels" && "active"
        }`}
        onClick={() => navigate("/channels")}
      >
        <TvIcon className="navigation__icon" />
        <p className="navigation__label">Canais</p>
      </div>

      <div
        className={`navigation__item ${
          location.pathname === "/customers" && "active"
        }`}
        onClick={() => navigate("/customers")}
      >
        <EmojiPeopleIcon className="navigation__icon" />
        <p className="navigation__label">Clientes</p>
      </div>
    </div>
  );
};

export default Navigation;
