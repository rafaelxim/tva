import React from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIllustration from "../../assets/login_illustration.svg";
import LogoTVA from "../../assets/logo_tva.svg";
import "./styles.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="login">
      <div className="login__left">
        <img className="login__logo" src={LogoTVA} alt="logo" />
        <img
          className="login__illustration"
          src={LoginIllustration}
          alt="login_ilustration"
        />
      </div>
      <div className="login__right">
        <form onSubmit={(e) => submitLogin(e)} className="login__formContainer">
          <h3 className="login__title">TvaNetPlay</h3>
          <p className="login__subtitle">Faça seu login</p>
          <TextField
            className="login__input"
            id="outlined-search"
            label="E-mail"
            type="text"
            fullWidth
            size="small"
          />

          <TextField
            className="login__input"
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            size="small"
          />

          <Button
            className="login__button"
            fullWidth
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
