import Button from "@mui/material/Button";
import React from "react";
import { useNavigate } from "react-router-dom";
import GirlImage from "../../assets/girl-pc.svg";
import "./styles.scss";

type Props = Record<string, never>;
const PermissionDenied: React.FC<Props> = () => {
  const navigate = useNavigate();

  return (
    <div className="denied">
      <div className="denied__image">
        <img src={GirlImage} alt="girlonpc" />
      </div>
      <div className="denied__title">Nos desculpe...</div>
      <div className="denied__text">
        <p>A página que você está tentando acessar possui acesso restrito.</p>
        <p>Consulte o administrador do sistema.</p>
      </div>
      <div className="denied__actions">
        <Button onClick={() => navigate("/")} type="button" variant="contained">
          Retornar ao Sistema
        </Button>
      </div>
    </div>
  );
};

export default PermissionDenied;
