import { Box, Grid } from "@mui/material";
import React, { FC, Fragment, useEffect, useState } from "react";
import MessageTamplate from "./messageTamplate";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../REDUX/bigpie";
import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../firebase";

interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}
type Props = {
  messages: Message[];
};

const MessagessContainr: FC<Props> = ({ messages }) => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);

  return (
    <Box>
      {messages &&
        messages.length > 0 &&
        messages.map((message) => (
          <MessageTamplate
            message={message}
            key={message.id}
            didISend={message.senderId != chatBuddy.user?.uid ? true : false}
            user={user.user}
          />
        ))}
    </Box>
  );
};

export default MessagessContainr;
