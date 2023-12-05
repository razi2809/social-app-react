import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Typography,
  TextField,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { auth, signInWithGoogle, LoginWithGoogle } from "../firebase";
import firebase from "firebase/compat/app";

import "firebase/compat/auth";

export default function LogInPop({ setIsOpen, isOpen }) {
  const [inputsValue, setInputsValue] = useState({
    email: "",
    password: "",
  });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleInputsChange = (e) => {
    setInputsValue((currentState) => ({
      //update the state  values
      ...currentState,
      [e.target.id]: e.target.value,
    }));
  };
  const LoginWithGoogleAuth = async () => {
    setLoading(true);
    try {
      await LoginWithGoogle();
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsOpen(false);
    }
  };
  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth.signInWithEmailAndPassword(
        inputsValue.email,
        inputsValue.password
      );
      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        {!loading ? (
          <>
            <DialogTitle>Log In</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your email and password:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                value={inputsValue.emailValue}
                onChange={handleInputsChange}
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
              />
              <TextField
                margin="dense"
                id="password"
                label="Password"
                value={inputsValue.passwordValue}
                onChange={handleInputsChange}
                type="password"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                sx={{ textDecoration: "none" }}
                onClick={LoginWithGoogleAuth}
              >
                continue with google
              </Button>

              <Button variant="contained" color="primary" onClick={handleLogin}>
                Log In
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>{" "}
          </>
        ) : (
          <Typography variant="h1" color="initial">
            hello
          </Typography>
        )}
      </Dialog>
    </div>
  );
}
