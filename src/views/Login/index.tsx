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
import FormRow from "../../components/FormRow";
import FormField from "../../components/FormField";
import api from "../../services/api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [passForgotView, setPassForgotView] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const { successLogin, loading, loginAttempts } = useSelector(
    (state: StoreState) => state.authReducer
  );

  const reset_token = searchParams.get("token");

  useEffect(() => {
    const expired = searchParams.get("msg");
    if (successLogin && expired !== "expired") {
      navigate("/");
    } else if (loginAttempts > 0 && !successLogin) {
      dispatch(
        setSnackbarAlert({
          message: "Não foi possível realizar o login.",
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

  const submitPassRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      email,
    };
    if (email) {
      try {
        await api.post("/password_reset/", { payload });
        dispatch(
          setSnackbarAlert({
            message: "As instruções foram enviadas para o seu email",
            isVisible: true,
            severity: "success",
          })
        );
      } catch (err: any) {
        console.log(err);
        dispatch(
          setSnackbarAlert({
            message: "Erro ao tentar enviar o email",
            isVisible: true,
            severity: "error",
          })
        );
      }
    } else {
      dispatch(
        setSnackbarAlert({
          message: "Preencha o campo de email corretamente",
          isVisible: true,
          severity: "error",
        })
      );
    }
  };

  const submitPassRedefine = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== newPassword2) {
      dispatch(
        setSnackbarAlert({
          message: "As senhas digitadas não conferem!",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }
    if (!newPassword || !newPassword2) {
      dispatch(
        setSnackbarAlert({
          message: "O campo senha é obrigatório",
          isVisible: true,
          severity: "error",
        })
      );
      return;
    }

    try {
      await api.post("/password_reset/confirm", {
        password: newPassword,
        token: reset_token,
      });
      dispatch(
        setSnackbarAlert({
          message: "A senha foi alterada!",
          isVisible: true,
          severity: "success",
        })
      );
      setSearchParams({ token: "" });
    } catch (err: any) {
      dispatch(
        setSnackbarAlert({
          message: "Houve um erro ao tentar alterar a senha",
          isVisible: true,
          severity: "error",
        })
      );
      console.log(err);
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
        {!passForgotView && !reset_token && (
          <form
            onSubmit={(e) => submitLogin(e)}
            className="login__formContainer"
          >
            <h3 className="login__title">TvaNetPlay</h3>
            <p className="login__subtitle">Faça seu login</p>
            <FormRow>
              <FormField>
                <TextField
                  autoComplete="off"
                  className="login__input"
                  id="outlined-search"
                  label="Usuário"
                  type="text"
                  fullWidth
                  size="small"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField>
                <TextField
                  autoComplete="off"
                  className="login__input"
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  fullWidth
                  size="small"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormField>
            </FormRow>

            <Button fullWidth type="submit" variant="contained">
              Login
            </Button>
            <p onClick={() => setPassForgotView(true)} className="login__p1">
              Esqueci a minha senha
            </p>
          </form>
        )}

        {passForgotView && !reset_token && (
          <form
            onSubmit={(e) => submitPassRecovery(e)}
            className="login__formContainer"
          >
            <h3 className="login__title">TvaNetPlay</h3>
            <p className="login__subtitle">Recupere sua conta</p>

            <FormRow>
              <FormField>
                <TextField
                  autoComplete="off"
                  className="login__input"
                  id="outlined-search"
                  label="Email"
                  type="text"
                  fullWidth
                  size="small"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormField>
            </FormRow>
            <Button fullWidth type="submit" variant="contained">
              Enviar
            </Button>
            <p onClick={() => setPassForgotView(false)} className="login__p1">
              Retornar para login
            </p>
          </form>
        )}

        {reset_token && (
          <form
            onSubmit={(e) => submitPassRedefine(e)}
            className="login__formContainer"
          >
            <h3 className="login__title">TvaNetPlay</h3>
            <p className="login__subtitle">Digite a nova senha</p>
            <FormRow>
              <FormField>
                <TextField
                  autoComplete="off"
                  className="login__input"
                  id="outlined-password-input"
                  label="Senha"
                  type="password"
                  fullWidth
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormField>
            </FormRow>
            <FormRow>
              <FormField>
                <TextField
                  autoComplete="off"
                  className="login__input"
                  id="outlined-password-input"
                  label="Repita a senha"
                  type="password"
                  fullWidth
                  size="small"
                  value={newPassword2}
                  onChange={(e) => setNewPassword2(e.target.value)}
                />
              </FormField>
            </FormRow>
            <Button fullWidth type="submit" variant="contained">
              Enviar
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
