import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Button, LinearProgress, Box, Dialog } from "@mui/material";
import TextField from "@mui/material/TextField";
import { storage, db, auth } from "../firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}
const NewPost = ({ setIsOpen, isOpen }: Props) => {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState<null | File>(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [upload, setUpload] = useState(false);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;

    if (inputElement.files) {
      setImg(inputElement.files[0]);
    } else {
      setImg(null);
    }
  };
  const addPost = () => {
    console.log(auth.currentUser?.photoURL);
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
            setIsOpen(false);

            //   setUpload(false);
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
            .then((url) => {
              db.collection("posts").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                title: title,
                imgUrl: url,
                userName: auth.currentUser?.displayName,
                avatar: auth.currentUser?.photoURL,
                edited: false,
              });
            });
        }
      );
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <Grid container spacing={3} className="container_div">
        <Grid
          container
          item
          xs={6}
          sm={6}
          md={12}
          className="add_post"
          sx={{ flexDirection: "column" }}
        >
          <input
            className="file-input"
            type="file"
            onChange={(e) => handleUpload(e)}
          />
          <TextField
            id="post_title"
            label="post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={addPost}>
            add post
          </Button>

          {upload && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress
                variant="buffer"
                value={progress}
                valueBuffer={buffer}
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default NewPost;
