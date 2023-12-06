import { Avatar, Card, CardContent, Typography } from "@mui/material";
import React from "react";
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
  chats: [string, DisplayUserChatsProps];
  handleOpenChat: (Id: string, userInfo: User) => void;
}
const DisplayUserChats: React.FC<Props> = ({ chats, handleOpenChat }) => {
  return (
    <Card style={{ display: "flex", alignItems: "center", margin: "10px" }}>
      <Avatar
        src={chats[1].userInfo.photourl}
        alt={chats[1].userInfo.displayName}
        style={{ margin: "10px" }}
        onClick={() => {
          handleOpenChat(chats[0], { userInfo: chats[1].userInfo });
        }}
      />
      <CardContent>
        <Typography variant="h5">{chats[1].userInfo.displayName}</Typography>
        <Typography variant="h5">{chats[1].lastMessage?.text}</Typography>
      </CardContent>
    </Card>
  );
};

export default DisplayUserChats;
