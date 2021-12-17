import React from "react";
import Logo from "../../assets/logo_tva.svg";
import User from "../../assets/user.jpg";
import NotificationIcon from "../../assets/notification.svg";
import "./styles.scss";

const Header = () => {
  return (
    <div className="header">
      <div className="header__logo">
        <img src={Logo} alt="logo" />
      </div>
      <div className="header__userBox">
        <div className="header__notifications">
          <img src={NotificationIcon} alt="notification" />
        </div>
        <div className="header__userData">
          <p className="header__userName">Ronaldinho Gaúcho</p>
          <p className="header__status">Disponível</p>
        </div>
        <div className="header__userPic">
          <img src={User} alt="userPic" />
        </div>
      </div>
    </div>
  );
};

export default Header;
