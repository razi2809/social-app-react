import React, { Fragment, useEffect, useState } from "react";
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
import {
  DocumentReference,
  DocumentData,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useNavigate, useSearchParams } from "react-router-dom";
import { chatActions } from "../REDUX/chatSlice";
import { useAppDispatch, useAppSelector } from "../REDUX/bigpie";
import LoaderComponent from "../layout/LoaderComponent";
import DisplayUser from "./DisplayUser";
import DisplayUserChats from "./DisplayUserChats";

interface ChatUser {
  displayName: string | null;
  photourl: string | null;
  uid: string;
}
interface User {
  avatar: string;
  displayName: string;
  uid: string;
}

type ChatInfo = {
  date: firebase.firestore.Timestamp;
  lastMessage: {
    text: string;
  };
  userInfo: {
    photourl: string;
    uid: string;
    displayName: string;
  };
};
const ChatSideBar = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<ChatInfo[]>([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const dispatch = useAppDispatch();
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
    const getChat = async () => {
      const userUid = user.user?.uid;
      if (userUid) {
        const unsub = onSnapshot(
          doc(db, "userchats", userUid) as DocumentReference<DocumentData>,
          (doc) => {
            setChats(doc.data() as ChatInfo[]);
            console.log(doc.data());
            setDone(true);
          }
        );
        return () => {
          unsub();
        };
      }
    };

    if (user.isLoggedIn) {
      user.user?.uid && getChat();
    }
  }, [user.isLoggedIn]);
  const handleClick = async (userBuddy: User) => {
    console.log("handleClick");

    const userUid = user.user?.uid;
    if (userUid && userBuddy.uid === userUid) return;
    //check whether the group is already created or not, if not create
    if (user.user && userUid) {
      const combinedUsersId =
        userUid > userBuddy.uid
          ? userUid + userBuddy.uid
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
            [combinedUsersId + ".lastMessage"]: {
              text: "",
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
            [combinedUsersId + ".lastMessage"]: {
              text: "",
            },
          });
        }
        navigate(`/chat/chatuid?uid=${combinedUsersId}`);
        dispatch(
          chatActions.selectedUser({
            displayName: userBuddy.displayName,
            photourl: userBuddy.avatar,
            uid: userBuddy.uid,
          })
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const openChat = (chatId: string, userBuddy: ChatUser) => {
    dispatch(chatActions.selectedUser(userBuddy));
    navigate(`/chat/chatuid?uid=${chatId}`);
  };

  if (done) {
    return (
      <Box>
        {users.map((userExist) => {
          const doesHeHaveChat = Object.entries(chats).some(
            (chat) => chat[1].userInfo.uid === userExist.uid
          );
          return (
            <DisplayUser
              key={userExist.uid}
              user={userExist}
              display={userExist.uid !== user.user?.uid}
              handleOpenChat={() => handleClick(userExist)}
              doesHeHaveChat={doesHeHaveChat}
            />
          );
        })}
        {chats &&
          Object.entries(chats).map((chat) => (
            <DisplayUserChats
              chats={chat}
              key={chat[0]}
              handleOpenChat={() => openChat(chat[0], chat[1].userInfo)}
            />
          ))}
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default ChatSideBar;
/*      <Card sx={{ borderRadius: 2 }} >
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
                    <Typography
                      variant="h6"
                      color="textSecondary"
                      component="p"
                    >
                      {chat[1].lastMessage
                        ? chat[1].lastMessage.text
                        : "no message"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {chat[1].lastMessage
                        ? chat[1].lastMessage.text
                        : "no message"}
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
            </Card> */
