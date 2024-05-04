import {
  Avatar,
  Box,
  Card,
  CardContent,
  Tooltip,
  Typography,
} from "@mui/material";
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
const DisplayUserChatsSmallScreen: React.FC<Props> = ({
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
        m: 1,
      }}
    >
      {" "}
      <Tooltip title={chats.userInfo.displayName}>
        <Avatar
          sx={{
            marginRight: "auto",
            position: "static",
          }}
          src={chats.userInfo.photourl}
          alt={chats.userInfo.displayName}
        />
      </Tooltip>
    </Box>
  );
};

export default DisplayUserChatsSmallScreen;
