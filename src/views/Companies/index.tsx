import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Companies: React.FC<Props> = () => {
  return (
    <div className="companies">
      <Header />

      <div className="companies__content">
        <Navigation />
        Empresas
      </div>
    </div>
  );
};

export default Companies;
