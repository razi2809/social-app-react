import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "../REDUX/bigpie";
import firebase from "firebase/compat/app";
import LoaderComponent from "../layout/LoaderComponent";

interface Props {
  message: {
    date: firebase.firestore.Timestamp;
    text: string;
    senderId: string;
    id: string;
    Image?: string;
  };
  didISend: boolean;
}
const MessageTamplate: FC<Props> = ({ message, didISend }) => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);

  console.log("message", message, "didISend", didISend);

  if (chatBuddy.user) {
    return (
      <Grid container>
        <Grid item container md={4}>
          {" "}
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
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
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {message.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  } else {
    return null;
  }
};

export default MessageTamplate;
