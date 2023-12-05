import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  Timestamp,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db, storage } from "../firebase";
import MessagessContainr from "./MessagessContainr";
import { chatActions } from "../REDUX/chatSlice";
import { set } from "date-fns";
const ChatTemplat = () => {
  const chatBuddy = useSelector((bigPie) => bigPie.chatReducer);
  const user = useSelector((bigPie) => bigPie.authReducer);
  const [editText, setEditText] = useState("");
  const [chatInfo, setChatInfo] = useState("");
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("uid");
  const [img, setImg] = useState(null);
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [upload, setUpload] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    let res = {};
    const getChat = () => {
      const unsub = onSnapshot(doc(db, "userchats", user.user.uid), (doc) => {
        for (let item of Object.entries(doc.data())) {
          if (item[0] == chatId) {
            res = item[1];
            setChatInfo(item[1]);
          }
        }
        dispatch(chatActions.selctedUser(res.userInfo));
        console.log(res);
      });
      return () => {
        unsub();
      };
    };
    user.user && user.user.uid && getChat();
  }, [user.isLoggedIn]);
  const sendMessage = async (chatId, message) => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          setUpload(true);
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          if (progress == 100) {
            setProgress(100);
            setBuffer(10);
            setUpload(false);
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        () => {
          setEditText("");
          setImg(null);
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: message,
                sendrId: user.user.uid,
                date: Timestamp.now(),
                Image: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: message,
          sendreId: user.user.uid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, `userchats`, chatBuddy.user.uid), {
        [chatId + ".lastMessage"]: {
          text: message,
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userchats", user.user.uid), {
        [chatId + ".lastMessage"]: {
          text: message,
        },
        [chatId + ".date"]: serverTimestamp(),
      });
      setEditText("");
    }
  };
  if (chatBuddy.user) {
    return (
      <Fragment>
        <Grid container>
          <Grid item container md={4}>
            {" "}
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader
                avatar={<Avatar src={chatBuddy.user.photourl} />}
                title={chatBuddy.user.displayName}
                sx={{ p: 1 }}
              />
              <CardContent>
                <Typography variant="h6" color="textSecondary" component="p">
                  {chatBuddy.user.displayName}
                </Typography>
                {chatInfo && (
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {chatInfo.lastMessage.text}
                  </Typography>
                )}
              </CardContent>{" "}
              <TextField
                variant="standard"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <input
                className="file-input"
                type="file"
                onChange={(e) => setImg(e.target.files[0])}
              />
              <Button
                variant="contained"
                onClick={() => sendMessage(chatId, editText)}
              >
                send
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
            </Card>
          </Grid>
        </Grid>{" "}
        <MessagessContainr />
      </Fragment>
    );
  } else {
    return <div>no chat buddy</div>;
  }
};

export default ChatTemplat;
