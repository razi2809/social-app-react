import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import { useAppSelector } from "../REDUX/bigpie";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import firebase from "firebase/compat/app";

import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { type } from "os";
import { useSearchParams } from "react-router-dom";
interface Chat {
  date: firebase.firestore.Timestamp;
  lastMessage: {
    text: string;
  };
  userInfo: {
    displayName: string;
    photourl: string;
    uid: string;
  };
}
type Props = {
  chatInfo: Chat[];
};
const ChatInput: FC<Props> = (chatInfo) => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [img, setImg] = useState<null | File>(null);
  const [editText, setEditText] = useState("");
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);
  const [upload, setUpload] = useState(false);
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target as HTMLInputElement;
    if (inputElement.files) {
      setImg(inputElement.files[0]);
    } else {
      setImg(null);
    }
  };
  const sendMessage = async (chatId: string, message: string) => {
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
            if (user.user?.uid) {
              await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: message,
                  senderId: user.user?.uid,
                  date: Timestamp.now(),
                  Image: downloadURL,
                }),
              });
              await updateDoc(doc(db, "userchats", user.user.uid), {
                [chatId + ".lastMessage"]: {
                  text: message,
                },
                [chatId + ".date"]: serverTimestamp(),
              });
            }
            if (chatBuddy.user) {
              await updateDoc(doc(db, `userchats`, chatBuddy.user.uid), {
                [chatId + ".lastMessage"]: {
                  text: message,
                },
                [chatId + ".date"]: serverTimestamp(),
              });
            }
          });
        }
      );
    } else {
      setEditText("");
      if (user.user?.uid) {
        await updateDoc(doc(db, "chats", chatId), {
          messages: arrayUnion({
            id: uuid(),
            text: message,
            senderId: user.user.uid,
            date: Timestamp.now(),
          }),
        });
        await updateDoc(doc(db, "userchats", user.user.uid), {
          [chatId + ".lastMessage"]: {
            text: message,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
      }
      if (chatBuddy.user) {
        await updateDoc(doc(db, `userchats`, chatBuddy.user.uid), {
          [chatId + ".lastMessage"]: {
            text: message,
          },
          [chatId + ".date"]: serverTimestamp(),
        });
      }
    }
  };
  return (
    <Card sx={{ borderRadius: 2 }}>
      <CardHeader
        avatar={
          <Avatar
            src={chatBuddy.user?.photourl ?? undefined}
            alt={chatBuddy.user?.displayName || "User"}
          />
        }
        title={chatBuddy.user?.displayName}
        sx={{ p: 1 }}
      />
      <CardContent>
        <Typography variant="h6" color="textSecondary" component="p">
          {chatBuddy.user?.displayName}
        </Typography>
        {chatInfo && (
          <Typography variant="body2" color="textSecondary" component="p">
            {chatInfo.chatInfo[0]?.lastMessage.text}
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
        onChange={(e) => handleUpload(e)}
      />
      <Button variant="contained" onClick={() => sendMessage(chatId, editText)}>
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
  );
};

export default ChatInput;
