import React, { Dispatch, FC, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { useAppSelector } from "../../REDUX/bigpie";
import CommentIcon from "@mui/icons-material/Comment";
import { Grid } from "@mui/material";
import UserPreferance from "../authRelatedComponents/UserPreferance";

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
  const isMenuOpen = Boolean(anchorEl);

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
    <AppBar position="static" sx={{ width: "100%", bgcolor: "divider" }}>
      <Grid container sx={{ width: "100%" }}>
        <Grid item xs={12} md={12} lg={12} xl={12}>
          {" "}
          <Container
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "flex", sm: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "text.hover",
                  textDecoration: "none",
                }}
              >
                Chats
              </Typography>{" "}
            </Box>
            <Box sx={{ display: "flex", alignContent: "center" }}>
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
                    onClick={() => setIsHeWantNewChat(!isHeWantNewChat)}
                  >
                    <CommentIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>{" "}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip
                title={
                  !isMenuOpen ? "Open user Preferance" : "close user Preferance"
                }
              >
                <IconButton
                  onClick={(e) => {
                    setAnchorEl(e.currentTarget);
                  }}
                >
                  <Avatar alt="user profile" src={user.user?.photoURL ?? ""} />
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="menu-appbar"
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{
                ".MuiPaper-root": {
                  backgroundColor: "divider",
                },
              }}
            >
              {" "}
              <Box>
                <UserPreferance />
              </Box>
            </Menu>
          </Container>
        </Grid>{" "}
      </Grid>
    </AppBar>
  );
};
export default ChatHeader;
