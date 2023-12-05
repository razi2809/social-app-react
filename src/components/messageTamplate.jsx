import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// interface Props {
//   date: Date;
//   text: string;
//   sendrId: string;
//   id: string;
// }
// const MessageTamplate = ( message: Props ) => {
const MessageTamplate = ({ message }) => {
  // const { date, text, sendrId, id } = message;
  const chatBuddy = useSelector((bigPie) => bigPie.chatReducer);
  const user = useSelector((bigPie) => bigPie.authReducer);

  const [didISend, setDidISend] = useState(true);
  useEffect(() => {
    if (message.sendrId == chatBuddy.user.uid) {
      setDidISend(false);
    } else return;
  }, []);

  console.log(didISend);

  if (chatBuddy.user) {
    return (
      <Grid container>
        <Grid item container md={4}>
          {" "}
          <Card sx={{ borderRadius: 2 }}>
            <CardHeader
              avatar={
                <Avatar
                  src={didISend ? user.user.photoURL : chatBuddy.user.photourl}
                />
              }
              title={
                didISend ? user.user.displayName : chatBuddy.user.displayName
              }
              sx={{ p: 1 }}
            />
            <CardContent>
              <Typography variant="h6" color="textSecondary" component="p">
                {didISend ? user.user.displayName : chatBuddy.user.displayName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {message.text}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
};

export default MessageTamplate;
