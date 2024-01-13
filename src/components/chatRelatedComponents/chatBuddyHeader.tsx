import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
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
import { Drawer, Grid, MenuItem, Popper } from "@mui/material";
import ThemeSwitcher from "../layoutRelatedComponents/ThemeSwitcher";
import { CSSTransition } from "react-transition-group";
import UserPreferance from "../authRelatedComponents/UserPreferance";

const pages = ["Products", "Pricing", "Blog"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

interface Props {
  isHeWantNewChat: boolean;
  setIsHeWantNewChat: Dispatch<React.SetStateAction<boolean>>;
  isThereUserWithoutChat: boolean;
}
const ChatBuddyHeader: FC<Props> = ({
  isHeWantNewChat,
  setIsHeWantNewChat,
  isThereUserWithoutChat,
}) => {
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [anchorElNav, setAnchorElNav] = React.useState(false);
  const [siblingHeight, setSiblingHeight] = useState<number>(0);
  const siblingRef = useRef<HTMLDivElement>(null);

  const HeWantNewChat = () => {
    if (!isThereUserWithoutChat) {
      setIsHeWantNewChat(true);
    } else {
      console.log("you have chat with all of the users");
    }
  };

  useEffect(() => {
    const updateHeight = () => {
      if (siblingRef.current) {
        setSiblingHeight(siblingRef.current.clientHeight);
      }
    };

    updateHeight(); // Update height initially

    window.addEventListener("resize", updateHeight); // Listen for resize events

    return () => {
      window.removeEventListener("resize", updateHeight); // Clean up the event listener
    };
  }, [siblingRef.current]);

  return (
    <AppBar position="static">
      <Grid container sx={{ position: "sticky" }}>
        <Grid
          item
          xs={12}
          md={12}
          lg={12}
          xl={12}
          sx={{ position: "relative" }}
          ref={siblingRef as React.RefObject<HTMLDivElement>}
        >
          {" "}
          <Container
            maxWidth="xl"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "divider",
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
                  color: "text.hover",
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
              <Tooltip
                title={
                  !anchorElNav
                    ? "Open user Preferance"
                    : "close user Preferance"
                }
              >
                <IconButton
                  sx={{ p: 2 }}
                  onClick={(e) => {
                    // handleMenu();
                    setAnchorElNav(!anchorElNav);
                  }}
                >
                  <Avatar alt="user profile" src={user.user?.photoURL ?? ""} />
                </IconButton>
              </Tooltip>
            </Box>{" "}
          </Container>
        </Grid>{" "}
        <CSSTransition
          in={anchorElNav} // control this state to show/hide the Box
          timeout={500}
          classNames="bubble"
          unmountOnExit
        >
          <Box
            sx={{
              position: "absolute",
              top: `${siblingHeight}px`,
              left: 0,
              width: "100%",
              height: `calc(100vh - ${siblingHeight}px)`,
              zIndex: 50,
              backgroundColor: "divider", // Add this line
            }}
          >
            <Box sx={{ width: "100%", height: "100%" }}>
              <UserPreferance />
            </Box>{" "}
          </Box>
        </CSSTransition>
      </Grid>
    </AppBar>
  );
};
export default ChatBuddyHeader;

{
  /* <Box sx={{ width: "100%" }}>
  <Menu
    anchorEl={anchorEl}
    id="menu-appbar"
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    {" "}
    <Box sx={{ display: "flex", width: "100%" }}>
      <Typography variant="h6" sx={{ p: 1 }}>
        theme:
      </Typography>
      <ThemeSwitcher />
    </Box>
    <MenuItem onClick={handleClose}>My account</MenuItem>
  </Menu>
</Box> */
}
