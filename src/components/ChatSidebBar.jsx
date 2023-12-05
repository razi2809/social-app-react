import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { chatActions } from "../REDUX/chatSlice";

const ChatSideBar = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((bigPie) => bigPie.authReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    db.collection(`users`).onSnapshot((snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          avatar: doc.data().avatar,
          displayName: doc.data().displayName,
          uid: doc.data().uid,
        }))
      );
    });
  }, []);
  const handleClick = async (userBuddy) => {
    if (userBuddy.uid == user.user.uid) return;
    //check whether the group is already created or not, if not create
    const combinedUsersId =
      user.user.uid > userBuddy.uid
        ? user.user.uid + userBuddy.uid
        : userBuddy.uid + user.user.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedUsersId));

      if (!res.exists()) {
        //create user chat group
        await setDoc(doc(db, `chats`, combinedUsersId), {
          messages: [],
        });
        await updateDoc(doc(db, `userchats`, user.user.uid), {
          [combinedUsersId + ".userInfo"]: {
            uid: userBuddy.uid,
            displayName: userBuddy.displayName,
            photourl: userBuddy.avatar,
          },
          [combinedUsersId + ".date"]:
            firebase.firestore.FieldValue.serverTimestamp(),
        });
        await updateDoc(doc(db, `userchats`, userBuddy.uid), {
          [combinedUsersId + ".userInfo"]: {
            uid: user.user.uid,
            displayName: user.user.displayName,
            photourl: user.user.photoURL,
          },
          [combinedUsersId + ".date"]:
            firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
      navigate(`/chat/chatuid?uid=${combinedUsersId}`);
      dispatch(
        chatActions.selctedUser({
          displayName: userBuddy.displayName,
          photourl: userBuddy.avatar,
          uid: userBuddy.uid,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const getChat = () => {
      const unsub = onSnapshot(doc(db, "userchats", user.user.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };

    user.user && user.user.uid && getChat();
  }, [user.isLoggedIn]);

  const openChat = (chatId, userBuddy) => {
    dispatch(chatActions.selctedUser(userBuddy));
    navigate(`/chat/chatuid?uid=${chatId}`);
  };
  return (
    <Box>
      {users.map((user) => (
        <Button
          key={user.uid}
          variant="contained"
          onClick={() => handleClick(user)}
        >
          {user.displayName}
        </Button>
      ))}
      {chats &&
        Object.entries(chats)?.map((chat) => (
          <Card sx={{ borderRadius: 2 }} key={chat[0]}>
            <Grid container>
              <Grid item container md={12}>
                <CardHeader
                  avatar={<Avatar src={chat[1].userInfo.photourl} />}
                  title={chat[1].userInfo.displayName}
                  sx={{ p: 1 }}
                />
              </Grid>

              <Grid item md={12}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" component="p">
                    {chat[1].userInfo.displayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {chat[1].lastMessage?.text}
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => openChat(chat[0], chat[1].userInfo)}
                  >
                    openChat
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}
    </Box>
  );
};

export default ChatSideBar;
