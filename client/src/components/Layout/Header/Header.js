import React, { useContext, useState } from "react";
import styles from "./Header.module.css";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../Context/UserContext";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ open, handleDrawerOpen }) => {
  const navigate = useNavigate();
  const { isLoggedIn, currentUser, signOutUser } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const redirectToHome = () => {
    navigate("/");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOutUser();
    handleClose();
  };

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        backgroundColor: "#ffffff",
        color: "#2e7d32",   // 🌿 Green theme
        boxShadow: "none",
        borderBottom: "2px solid #e8f5e9"
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* MEDISYNC Title */}
        <Typography
          variant="h4"
          noWrap
          component="div"
          onClick={redirectToHome}
          sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: 2,
            cursor: "pointer",
            color: "#2e7d32"
          }}
        >
          MEDISYNC
        </Typography>

        {isLoggedIn && (
          <div className={styles.accountIcon}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle sx={{ fontSize: 42, mr: 1 }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 18, color: "#2e7d32" }}>
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <span style={{ fontSize: 12, color: "gray" }}>
                  {currentUser?.userType}
                </span>
              </div>
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
