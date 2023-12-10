import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../layout/LoaderComponent";
import { ArrowRightAlt } from "@mui/icons-material";
interface Props {
  message: {
    date: firebase.firestore.Timestamp;
    text: string;
    senderId: string;
    id: string;
    Image?: string;
  };
  didISend: boolean;
  user: firebase.User | null;
}
const MessageTamplate: FC<Props> = ({ message, didISend, user }) => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const time = message.date.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (chatBuddy.user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: didISend ? "flex-end" : "flex-start",
          alignItems: "center",
          marginRight: didISend ? "1em" : "0px",
          marginLeft: !didISend ? "1em" : "0px",
        }}
      >
        {!didISend && (
          <Avatar
            sx={{ marginRight: "10px" }}
            src={!didISend ? chatBuddy.user?.photourl || undefined : undefined}
          />
        )}
        <Box>
          <Box
            sx={{
              padding: "10px",
              paddingRight: didISend ? "10px" : "35px",
              paddingLeft: didISend ? "35px" : "10px",
              margin: "10px 0",
              marginBottom: "0px",
              backgroundColor: didISend ? "lightgreen" : "lightblue",
              borderRadius: "10px",
              position: "relative",
            }}
          >
            <Typography variant="body1" color="textSecondary" component="p">
              {message.text}
            </Typography>
          </Box>{" "}
          <Typography variant="caption" color="textSecondary" component="p">
            {time}
          </Typography>
        </Box>
        {didISend && (
          <Avatar
            sx={{ marginLeft: "10px" }}
            src={didISend ? user?.photoURL || undefined : undefined}
          />
        )}
      </Box>
    );
  } else {
    return null;
  }
};

export default MessageTamplate;
{
  /* <Tooltip title="Arrow pointing right">
  <Box
    sx={{
      position: "absolute",
      bottom: 100,
      right: 0,
      transform: "rotate(-45deg)",
      backgroundColor: didISend ? "lightgreen" : "lightblue",
      height: "20px",
      width: "20px",
    }}
  >
    {/* <ArrowRightAlt /> 
  </Box>
</Tooltip> */
}

/*         <CardHeader
          avatar={
            <Avatar
              src={
                didISend
                  ? user.user?.photoURL || undefined
                  : chatBuddy.user?.photourl || undefined
              }
            />
          }
          title={
            didISend
              ? user.user?.displayName || undefined
              : chatBuddy.user?.displayName || undefined
          }
          sx={{ p: 1 }}
        />
        <CardContent>
          <Typography variant="h6" color="textSecondary" component="p">
            {didISend
              ? user.user?.displayName || undefined
              : chatBuddy.user?.displayName || undefined}
          </Typography> */
