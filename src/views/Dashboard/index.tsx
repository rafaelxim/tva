import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthState } from "../../actions";
import { StoreState } from "../../actions/types";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Dashboard: React.FC<Props> = () => {
  const { user } = useSelector((state: StoreState) => state.authReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setAuthState({
        loading: false,
        successLogin: false,
        loginAttempts: 0,
        user,
      })
    );
  }, []);

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard__content">
        <Navigation />
        <span>Dash</span>
      </div>
    </div>
  );
};

export default Dashboard;
