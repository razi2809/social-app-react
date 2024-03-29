import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import { useAppSelector } from "../../REDUX/bigpie";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";

import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
const InputWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  padding: "1.5rem", // Increased padding for a more comfortable feel
  borderTop: "1px solid #eee",
  backgroundColor: "#fff", // White background
  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle box shadow
  borderRadius: "12px", // Rounded corners
});

const StyledTextField = styled(TextField)({
  flexGrow: 1,
  marginRight: "1.5rem", // Increased margin for better spacing
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px", // Slightly rounded input field
    // borderColor: "divider", // Darker border when focused
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "divider", // Darker border when focused
  },
});

const ChatInput: FC = () => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const [img, setImg] = useState<null | File>(null);
  const [editText, setEditText] = useState("");
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
        (snapshot) => {},
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
                  image: downloadURL,
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
    <Card
      sx={{
        borderRadius: 12,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        bgcolor: "divider",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={chatBuddy.user?.photourl ?? undefined}
            alt={chatBuddy.user?.displayName || "User"}
          />
        }
        title={chatBuddy.user?.displayName}
        sx={{ p: 1, color: "text.hover" }}
      />
      <CardContent>
        <Typography variant="h6" color="text.hover" component="p">
          {chatBuddy.user?.displayName}
        </Typography>
      </CardContent>
      <InputWrapper>
        <StyledTextField
          variant="outlined" // Outlined variant for a cleaner look
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          placeholder="Type a message..."
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: !img ? "pointer" : "default",
            borderRadius: 2,
            ":hover": {
              backgroundColor: !img ? "#eee" : "white",
            },
          }}
        >
          <label htmlFor="file-input-message">
            <span role="img" aria-label="Attach File">
              📎
            </span>
          </label>
          <input
            id="file-input-message"
            style={{ display: "none" }}
            className="file-input"
            type="file"
            onChange={(e) => handleUpload(e)}
          />
        </Box>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: img || !!editText.trim().length ? "pointer" : "default",
            borderRadius: 2,
            ":hover": {
              backgroundColor:
                img || !!editText.trim().length ? "#eee" : "white",
            },
          }}
          onClick={() => sendMessage(chatId, editText)}
        >
          <span role="img" aria-label="Attach File">
            📎
          </span>
        </Box>
      </InputWrapper>
    </Card>
  );
};

export default ChatInput;
