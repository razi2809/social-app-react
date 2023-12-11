import React, { Dispatch, FC, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useAppSelector } from "../REDUX/bigpie";
import CommentIcon from "@mui/icons-material/Comment";
import { MenuItem } from "@mui/material";
import ThemeSwitcher from "../layout/ThemeSwitcher";
const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];
interface Props {
  isHeWantNewChat: boolean;
  setIsHeWantNewChat: Dispatch<React.SetStateAction<boolean>>;
  isThereUserWithoutChat: boolean;
}
const ChatHeader: FC<Props> = ({
  isHeWantNewChat,
  setIsHeWantNewChat,
  isThereUserWithoutChat,
}) => {
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const HeWantNewChat = () => {
    if (!isThereUserWithoutChat) {
      setIsHeWantNewChat(true);
    } else {
      console.log("you have chat with all of the users");
    }
  };
  return (
    <AppBar position="static">
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Chats
          </Typography>{" "}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          {" "}
          {!isHeWantNewChat && (
            <Tooltip title="new chat">
              <IconButton sx={{ p: 2 }} onClick={() => HeWantNewChat()}>
                <CommentIcon />
              </IconButton>
            </Tooltip>
          )}
          {isHeWantNewChat && (
            <Tooltip title="close new chat">
              <IconButton
                sx={{ p: 2 }}
                onClick={() => setIsHeWantNewChat(!isHeWantNewChat)}
              >
                <CommentIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Open settings">
            <IconButton sx={{ p: 2 }} onClick={handleMenu}>
              <Avatar alt="user profile" src={user.user?.photoURL ?? ""} />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={anchorEl}
            id="menu-appbar"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {" "}
            <Box sx={{ display: "flex" }}>
              <Typography variant="h6" sx={{ p: 1 }}>
                theme:
              </Typography>
              <ThemeSwitcher />
            </Box>
            <MenuItem onClick={handleClose}>My account</MenuItem>
          </Menu>
        </Box>
      </Container>
    </AppBar>
  );
};
export default ChatHeader;
