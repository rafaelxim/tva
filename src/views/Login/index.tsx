import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoginIllustration from "../../assets/login_illustration.svg";
import LogoTVA from "../../assets/logo_tva.svg";
import { authenticate, setSnackbarAlert } from "../../actions";
import "./styles.scss";
import { StoreState } from "../../actions/types";
import Backdrop from "../../components/Backdrop";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const { successLogin, loading, loginAttempts } = useSelector(
    (state: StoreState) => state.authReducer
  );

  useEffect(() => {
    const expired = searchParams.get("msg");
    if (successLogin && expired !== "expired") {
      navigate("/");
    } else if (loginAttempts > 0 && !successLogin) {
      dispatch(
        setSnackbarAlert({
          message:
            "Não foi possível realizar o login. (teste com user: rafael / senha: rafael123)",
          isVisible: true,
          severity: "error",
        })
      );
    }
  }, [successLogin, loginAttempts]);

  const submitLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchParams({ msg: "" });
    if (user && password) {
      dispatch(authenticate({ username: user, password }));
    }
  };

  return (
    <div className="login">
      <Backdrop open={loading} />

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
            label="Usuário"
            type="text"
            fullWidth
            size="small"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />

          <TextField
            className="login__input"
            id="outlined-password-input"
            label="Password"
            type="password"
            autoComplete="current-password"
            fullWidth
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth type="submit" variant="contained">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
