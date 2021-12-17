import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Customers: React.FC<Props> = () => {
  return (
    <div className="customers">
      <Header />

      <div className="customers__content">
        <Navigation />
        Clientes
      </div>
    </div>
  );
};

export default Customers;
