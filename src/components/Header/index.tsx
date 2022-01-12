import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Logo from "../../assets/logo_tva.svg";
import User from "../../assets/user.jpg";
import NotificationIcon from "../../assets/notification.svg";
import "./styles.scss";
import { StoreState } from "../../actions/types";

type Props = Record<string, never>;

const Header: React.FC<Props> = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const { user } = useSelector((store: StoreState) => store.authReducer);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "logout-popper" : undefined;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="header">
      <div className="header__logo">
        <img src={Logo} alt="logo" />
      </div>
      <div
        aria-describedby={id}
        onClick={handleClick}
        className="header__userBox"
      >
        <div className="header__notifications">
          <img src={NotificationIcon} alt="notification" />
        </div>
        <div className="header__userData">
          <p className="header__userName">{`${user?.first_name} ${user?.last_name}`}</p>
          <p className="header__status">Disponível</p>
        </div>
        <div className="header__userPic">
          <img src={User} alt="userPic" />
        </div>
      </div>
      <Popper
        placement="bottom-end"
        onClick={() => handleLogout()}
        id={id}
        open={open}
        anchorEl={anchorEl}
      >
        <Box sx={{ border: 1, p: 1, bgcolor: "background.paper" }}>LOGOUT</Box>
      </Popper>
    </div>
  );
};

export default Header;
