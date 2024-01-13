import React, { FC, Fragment, useEffect, useState } from "react";
import instagramPic from "../../assets/instgram.png";
import { Grid, Button } from "@mui/material";
import LogInPop from "../../components/authRelatedComponents/logInPop";
import SignUpPop from "../../components/authRelatedComponents/SignUpPop";
import { auth } from "../../firebase";
import NewPost from "../../components/postRelatedComponents/newPost";
import { RootState, useAppDispatch, useAppSelector } from "../../REDUX/bigpie";
import { authActions } from "../../REDUX/authslice";
import { useLocation } from "react-router-dom";

const Header: FC<{ done: Boolean }> = ({ done }) => {
  const [isHeWantToLog, setIsHeWantToLog] = useState<boolean>(false);
  const [isHeWantToSignUp, setisHeWantToSignUp] = useState<boolean>(false);
  const [isHeWantToPost, setIsHeWantToPost] = useState<boolean>(false);
  const { pathname } = useLocation();
  const [show, setShow] = useState(true);
  const user = useAppSelector((bigPie: RootState) => bigPie.authReducer);
  const dispatch = useAppDispatch();
  const signOut = () => {
    auth.signOut();
    dispatch(authActions.logout());
  };
  useEffect(() => {
    if (pathname === "/chat" || pathname === "/chat/chatuid") {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [pathname]);

  if (show) {
    return (
      <Fragment>
        <Grid container spacing={3} className="app_headher">
          <Grid item xs={3} sm={3} md={2} className="app_image">
            <img
              className="app_headerImage"
              src={instagramPic}
              alt="instagram logo"
              width={150}
              height={200}
            ></img>
          </Grid>
          <Grid item xs={3} sm={3} md={5} className="app_text"></Grid>
          <Grid
            container
            item
            xs={6}
            sm={6}
            md={5}
            sx={{ justifyContent: "center", alignItems: "center" }}
            className="app_text"
          >
            {user.isLoggedIn && done && (
              <>
                <Button
                  sx={{ mr: 4 }}
                  variant="contained"
                  color="primary"
                  onClick={signOut}
                >
                  log out
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsHeWantToPost(true)}
                >
                  add post
                </Button>
              </>
            )}
            {!user.isLoggedIn && done && (
              <>
                <Button
                  sx={{ mr: 4 }}
                  variant="contained"
                  color="primary"
                  onClick={() => setIsHeWantToLog(true)}
                >
                  log in
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setisHeWantToSignUp(true)}
                >
                  sign up
                </Button>
              </>
            )}
          </Grid>
        </Grid>
        {isHeWantToLog && (
          <LogInPop setIsOpen={setIsHeWantToLog} isOpen={isHeWantToLog} />
        )}
        {isHeWantToSignUp && (
          <SignUpPop
            setIsOpen={setisHeWantToSignUp}
            isOpen={isHeWantToSignUp}
          />
        )}
        {isHeWantToPost && (
          <NewPost setIsOpen={setIsHeWantToPost} isOpen={isHeWantToPost} />
        )}
      </Fragment>
    );
  }
  return null;
};

export default Header;
