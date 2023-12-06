import React, { useEffect, useState } from "react";
import instagramPic from "../../assets/instgram.png";
import { Grid, Button } from "@mui/material";
import LogInPop from "../../components/logInPop";
import SignUpPop from "../../components/SignUpPop";
import { auth } from "../../firebase";
import NewPost from "../../components/newPost";
import { RootState, useAppSelector } from "../../REDUX/bigpie";

const Header = () => {
  const [isHeWantToLog, setIsHeWantToLog] = useState<boolean>(false);
  const [isHeWantToSignUp, setisHeWantToSignUp] = useState<boolean>(false);
  const [isHeWantToPost, setIsHeWantToPost] = useState<boolean>(false);
  const [done, setDonet] = useState(false);
  const user = useAppSelector((bigPie: RootState) => bigPie.authReducer);
  console.log("user", user);
  useEffect(() => {
    if (user.isLoggedIn) {
      setDonet(true);
    } else return;
  }, [user.isLoggedIn]);
  return (
    <>
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
                onClick={() => auth.signOut()}
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
          {done && !user.isLoggedIn && (
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
        <SignUpPop setIsOpen={setisHeWantToSignUp} isOpen={isHeWantToSignUp} />
      )}
      {isHeWantToPost && (
        <NewPost setIsOpen={setIsHeWantToPost} isOpen={isHeWantToPost} />
      )}
    </>
  );
};

export default Header;
