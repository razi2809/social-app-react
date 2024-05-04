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
const DisplayUserChatsHomePage: React.FC<Props> = ({
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
        padding: "12px",
        borderRadius: "8px",
      }}
    >
      <Card
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 60,
          maxHeight: 100,
          alignItems: "center",
          // padding: "10px",
          backgroundColor: chatIsOpen ? "userChat.active" : "userChat.noActive",
          ":hover": {
            backgroundColor: chatIsOpen
              ? "userChat.active"
              : "rgba(32, 40, 77, 0.3)",
            color: "text.hover",
          },
          borderRadius: "8px",
          boxShadow: chatIsOpen ? "userChat.hover" : "none",

          color: chatIsOpen ? "text.hover" : "text.primary",
        }}
      >
        <Avatar
          sx={{
            marginRight: "auto",
            position: "static",
          }}
          src={chats.userInfo.photourl}
          alt={chats.userInfo.displayName}
          style={{ margin: "10px" }}
        />
        <CardContent sx={{ marginRight: "auto", height: "100%" }}>
          <Typography variant="h5">
            {chats.userInfo.displayName.slice(0, 20)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DisplayUserChatsHomePage;
