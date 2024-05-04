import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { FC, useState } from "react";
import { useAppSelector } from "../../REDUX/bigpie";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";
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
    if (!img && !editText) return;
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
        sx={{ p: 2, color: "text.hover" }}
      />
      <CardContent>
        <Typography variant="h6" color="text.hover" component="p">
          {chatBuddy.user?.displayName}
        </Typography>
        {img && (
          <Box sx={{ position: "relative", margin: "auto", width: "200px" }}>
            <img src={URL.createObjectURL(img)} style={{}} alt="preview"></img>
            <Tooltip title="clear">
              <IconButton
                onClick={(e) => setImg(null)}
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <ClearIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
            <Tooltip title="attach">
              <svg
                width="30px"
                height="30px"
                viewBox="0 -0.5 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    d="M15.17 11.053L11.18 15.315C10.8416 15.6932 10.3599 15.9119 9.85236 15.9178C9.34487 15.9237 8.85821 15.7162 8.51104 15.346C7.74412 14.5454 7.757 13.2788 8.54004 12.494L13.899 6.763C14.4902 6.10491 15.3315 5.72677 16.2161 5.72163C17.1006 5.71649 17.9463 6.08482 18.545 6.736C19.8222 8.14736 19.8131 10.2995 18.524 11.7L12.842 17.771C12.0334 18.5827 10.9265 19.0261 9.78113 18.9971C8.63575 18.9682 7.55268 18.4695 6.78604 17.618C5.0337 15.6414 5.07705 12.6549 6.88604 10.73L12.253 5"
                    stroke="#000000"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>
              </svg>
            </Tooltip>
          </label>
          <input
            id="file-input-message"
            style={{ display: "none" }}
            className="file-input"
            type="file"
            accept="image/*"
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
          <Tooltip title="send message">
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </Tooltip>
        </Box>
      </InputWrapper>
    </Card>
  );
};

export default ChatInput;
