import React, { FC, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { updateProfile } from "firebase/auth";
import firebase from "firebase/compat/app";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, signInWithGoogle, storage } from "../../firebase";
import { Box, LinearProgress } from "@mui/material";
import { set } from "date-fns";
interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}
const SignUpPop: FC<Props> = (Props) => {
  const [img, setImg] = useState<null | File>(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [upload, setUpload] = useState(false);
  const [inputsValue, setInputsValue] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputsValue((currentState) => ({
      //update the state  values
      ...currentState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSignUp = async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(
        inputsValue.email,
        inputsValue.password
      );
      if (img) {
        const upload = storage.ref(`images/${img.name}`).put(img);
        upload.on(
          "state_changed",
          (snapshot) => {
            setUpload(true);

            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (progress == 100) {
              setProgress(100);
              setBuffer(10);
              Props.setIsOpen(false);
            } else {
              setProgress(progress);
              setBuffer(progress + 10);
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            storage
              .ref("images")
              .child(img.name)
              .getDownloadURL()
              .then(async (url) => {
                if (auth.currentUser) {
                  await updateProfile(auth.currentUser, {
                    displayName:
                      inputsValue.firstName + " " + inputsValue.lastName,
                    photoURL: url,
                  });
                  await setDoc(doc(db, "users", auth.currentUser.uid), {
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    displayName:
                      inputsValue.firstName + " " + inputsValue.lastName,
                    avatar: url,
                    uid: auth.currentUser.uid,
                  });
                  // await setDoc(doc(db, "chats", res.user.uid), {});
                  await setDoc(doc(db, "userchats", auth.currentUser.uid), {});
                }
              });
          }
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;

    if (inputElement.files) {
      setImg(inputElement.files[0]);
    } else {
      setImg(null);
    }
  };

  const handleClose = () => {
    Props.setIsOpen(false);
  };
  return (
    <div>
      <Dialog open={Props.isOpen} onClose={handleClose}>
        <DialogTitle>sign up</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your name and email and password:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            value={inputsValue.firstName}
            onChange={handleInputsChange}
            label="first name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="lastName"
            value={inputsValue.lastName}
            onChange={handleInputsChange}
            label="last name"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="email"
            value={inputsValue.email}
            onChange={handleInputsChange}
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="password"
            value={inputsValue.password}
            onChange={handleInputsChange}
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <input
            className="file-input"
            type="file"
            onChange={(e) => handleUpload(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            sx={{ textDecoration: "none" }}
            onClick={async () => {
              await signInWithGoogle();
              Props.setIsOpen(false);
            }}
          >
            continue with google
          </Button>

          <Button variant="contained" color="primary" onClick={onSignUp}>
            sign up
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
        {upload && (
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="buffer"
              value={progress}
              valueBuffer={buffer}
            />
          </Box>
        )}
      </Dialog>
    </div>
  );
};
export default SignUpPop;
