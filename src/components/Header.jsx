import React, { useState } from "react";
import instagramPic from "../assets/instgram.png";
import { Grid, Button } from "@mui/material";
import LogInPop from "./logInPop";
import SignUpPop from "./SignUpPop";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import NewPost from "./newPost";

const Header = () => {
  const [isHeWantToLog, setIsHeWantToLog] = useState(false);
  const [isHeWantToSignUp, setisHeWantToSignUp] = useState(false);
  const [isHeWantToPost, setIsHeWantToPost] = useState(false);
  const user = useSelector((bigPie) => bigPie.authReducer);
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
          {user.isLoggedIn ? (
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
          ) : (
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
