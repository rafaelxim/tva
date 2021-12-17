import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Channels: React.FC<Props> = () => {
  return (
    <div className="channels">
      <Header />

      <div className="channels__content">
        <Navigation />
        Canais
      </div>
    </div>
  );
};

export default Channels;
