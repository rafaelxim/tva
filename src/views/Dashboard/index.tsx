import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Dashboard: React.FC<Props> = () => {
  return (
    <div className="dashboard">
      <Header />

      <div className="dashboard__content">
        <Navigation />
        Dashboard
      </div>
    </div>
  );
};

export default Dashboard;
