import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import TvIcon from "@mui/icons-material/Tv";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import Paper from "@mui/material/Paper";
import { setAuthState } from "../../actions";
import { StoreState } from "../../actions/types";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import api from "../../services/api";
import "./styles.scss";

type Props = Record<string, never>;

type Report = {
  company_qty: number;
  customer_qty: number;
  package_qty: number;
  channels_qty: number;
  start_date: string;
  end_date: string;
};

const Dashboard: React.FC<Props> = () => {
  const { user } = useSelector((state: StoreState) => state.authReducer);
  const [report, setReport] = useState<Report>();
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

    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await api.get<Report>("/report/");
    setReport(data);
    console.log({ data });
  };

  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard__content">
        <Navigation />
        <div className="dashboard">
          <Paper elevation={3} className="dashboard__statisticsPaper">
            <h1 className="dashboard__statisticsTitle">Estatísticas</h1>
            <div className="dashboard__statistics">
              <div className="dashboard__stat">
                <div className="dashboard__sIcon dashboard__sIcon--red">
                  <CorporateFareIcon />
                </div>
                <div className="dashboard__sText">
                  <p className="dashboard__sTextVal">{report?.company_qty}</p>
                  <p className="dashboard__sTextLabel">Empresas</p>
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__sIcon dashboard__sIcon--purple">
                  <AutoAwesomeMotionIcon />
                </div>
                <div className="dashboard__sText">
                  <p className="dashboard__sTextVal">{report?.package_qty}</p>
                  <p className="dashboard__sTextLabel">Pacotes</p>
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__sIcon dashboard__sIcon--green">
                  <TvIcon />
                </div>
                <div className="dashboard__sText">
                  <p className="dashboard__sTextVal">{report?.channels_qty}</p>
                  <p className="dashboard__sTextLabel">Canais</p>
                </div>
              </div>

              <div className="dashboard__stat">
                <div className="dashboard__sIcon dashboard__sIcon--blue">
                  <EmojiPeopleIcon />
                </div>
                <div className="dashboard__sText">
                  <p className="dashboard__sTextVal">{report?.customer_qty}</p>
                  <p className="dashboard__sTextLabel">Clientes</p>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
