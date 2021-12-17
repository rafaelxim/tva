import React from "react";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import "./styles.scss";

type Props = Record<string, never>;

const Users: React.FC<Props> = () => {
  return (
    <div className="users">
      <Header />

      <div className="users__content">
        <Navigation />
        User View
      </div>
    </div>
  );
};

export default Users;
