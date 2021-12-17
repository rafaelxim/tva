import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Packages: React.FC<Props> = () => {
  return (
    <div className="packages">
      <Header />

      <div className="packages__content">
        <Navigation />
        Pacotes
      </div>
    </div>
  );
};

export default Packages;
