import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";

interface DisplayUserChatsProps {
  date: firebase.firestore.Timestamp;
  lastMessage: {
    text: string;
  };
  userInfo: {
    photourl: string;
    uid: string;
    displayName: string;
  };
}
interface User {
  userInfo: {
    photourl: string;
    uid: string;
    displayName: string;
  };
}

interface Props {
  chats: DisplayUserChatsProps;
  handleOpenChat: (Id: string, userInfo: User) => void;
  id: string;
  chatIsOpen: boolean;
}
const DisplayUserChats: React.FC<Props> = ({
  chats,
  handleOpenChat,
  id,
  chatIsOpen,
}) => {
  let ref = useRef<HTMLDivElement>(null);
  let time = "";
  if (chats.date) {
    time = chats.date.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return (
    <Box
      ref={ref}
      onClick={() => {
        handleOpenChat(id, { userInfo: chats.userInfo });
      }}
      sx={{
        cursor: "pointer",
        height: "100%",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "12px", // Add padding for a more comfortable feel
        borderRadius: "8px", // Add rounded corners for a softer look
        mb: 1,
      }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 60, // Set a minimum height
          maxHeight: 100, // Set a maximum height or adjust as needed
          alignItems: "center",
          padding: "10px",
          backgroundColor: chatIsOpen ? "#5267DB" : "white",
          ":hover": {
            backgroundColor: chatIsOpen ? "#5267DB" : "rgba(32, 40, 77, 0.3)",
          },
          borderRadius: "8px", // Add rounded corners for a softer look
          // border: "none",
          boxShadow: chatIsOpen ? "0px 4px 8px rgba(0, 0, 0, 0.1)" : "none",
          // transition: "background-color 0.3s, box-shadow 0.3s",
          // padding: "12px", // Add padding for a more comfortable feel
        }}
      >
        <Avatar
          sx={{ marginRight: "auto" }}
          src={chats.userInfo.photourl}
          alt={chats.userInfo.displayName}
          style={{ margin: "10px" }}
        />
        <CardContent sx={{ marginRight: "auto", height: "100%" }}>
          <Typography variant="h5">{chats.userInfo.displayName}</Typography>
          <Typography variant="h5">{chats.lastMessage?.text}</Typography>
        </CardContent>
        <Typography
          sx={{ marginLeft: "auto", alignSelf: "flex-start" }}
          variant="h6"
        >
          {time}
        </Typography>
      </Card>
    </Box>
  );
};

export default DisplayUserChats;
