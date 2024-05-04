import React, { memo, useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PostTemplate from "../components/postRelatedComponents/PostTemplate";
import firebase from "firebase/compat/app";
import LoaderComponent from "../layout/LoaderComponent";
import { Box } from "@mui/material";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import DisplayUserChats from "../components/userRelatedComponents/DisplayUserChats";
import { chatActions } from "../REDUX/chatSlice";
import useGetChats from "../hooks/useGetChats";
import DisplayUserChatsHomePage from "../components/userRelatedComponents/DisplayUserChatsHomePage";
import { useAppSelector } from "../REDUX/bigpie";
import DisplayUser from "../components/userRelatedComponents/DisplayUser";
import DisplayUserChatsSmallScreen from "../components/userRelatedComponents/DisplayUserChatsSmallScreen";
import DisplayUserSmallScreen from "../components/userRelatedComponents/DisplayUserSmallScreen";

interface Post {
  id: string;
  post: {
    imgurl: string;
    avatar: string;
    username: string;
    edited: Boolean;
    timestamp: firebase.firestore.Timestamp;
    title: string;
  };
}
const PostsPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { users, chats, done, openChat, handleClick, isHeChattingWithAll } =
    useGetChats();
  const [isHeWantNewChat, setIsHeWantNewChat] = useState(false);
  const userBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const MemoDisplayUsers = memo(DisplayUser);
  useEffect(() => {
    db.collection(`posts`).onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: {
            imgurl: doc.data().imgUrl,
            avatar: doc.data().avatar,
            username: doc.data().userName,
            edited: doc.data().edited,
            timestamp: doc.data().timestamp,
            title: doc.data().title,
          },
        }))
      );
    });
  }, []);

  if (posts) {
    return (
      <Box sx={{ bgcolor: "divider" }}>
        <Grid container spacing={4}>
          <Grid
            container
            item
            xs={4}
            sm={4}
            md={3}
            sx={{ pr: 3, display: { xs: "none", md: "flex", sm: "flex" } }}
          >
            {" "}
            <Box>
              <Box
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="h6"
                  color="text.hover"
                  component="p"
                  textAlign={"center"}
                >
                  Existing Chats
                </Typography>
              </Box>{" "}
              <TransitionGroup>
                {chats &&
                  chats.map((chat) => {
                    const key = Object.keys(chat)[0];

                    return (
                      <CSSTransition key={key} timeout={500} classNames="item">
                        <DisplayUserChatsHomePage
                          chats={chat[key]}
                          chatIsOpen={false}
                          key={key}
                          id={key}
                          handleOpenChat={() =>
                            openChat(key, chat[key].userInfo)
                          }
                        />
                      </CSSTransition>
                    );
                  })}
              </TransitionGroup>
              <TransitionGroup>
                {
                  <CSSTransition timeout={500} classNames="item">
                    <Box
                      sx={{
                        width: "100%",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.hover"
                        component="p"
                        textAlign={"center"}
                      >
                        User's whom you don't have chat with
                      </Typography>
                    </Box>
                  </CSSTransition>
                }{" "}
              </TransitionGroup>
              <TransitionGroup>
                {users.map((userExist) => {
                  const doesHeHaveChat = chats.some((chat) =>
                    Object.keys(chat)[0].includes(userExist.uid)
                  );
                  const alreadyChattingWithHim =
                    userExist.uid === userBuddy.user?.uid || "";
                  if (!alreadyChattingWithHim) {
                    if (!doesHeHaveChat) {
                      return (
                        <CSSTransition
                          key={userExist.uid}
                          timeout={500}
                          classNames="item"
                        >
                          <MemoDisplayUsers
                            user={userExist}
                            display={userExist.uid !== user.user?.uid}
                            handleOpenChat={() => handleClick(userExist)}
                          />
                        </CSSTransition>
                      );
                    }
                  }
                  return null;
                })}
              </TransitionGroup>
            </Box>
          </Grid>
          <Grid
            container
            item
            xs={3}
            sm={4}
            md={3}
            sx={{
              display: { xs: "block", md: "none", sm: "none" },
            }}
          >
            {" "}
            <Box
              sx={{
                width: "100%",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: { xs: "flex", md: "none", sm: "none" },
              }}
            >
              <Typography
                variant="h6"
                color="text.hover"
                component="p"
                textAlign={"center"}
              >
                Existing Chats
              </Typography>
            </Box>
            <Box
              sx={{
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                display: { xs: "flex" },
              }}
            >
              {
                <TransitionGroup
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {chats &&
                    chats.map((chat) => {
                      const key = Object.keys(chat)[0];

                      return (
                        <CSSTransition
                          key={key}
                          timeout={500}
                          classNames="item"
                        >
                          <DisplayUserChatsSmallScreen
                            chats={chat[key]}
                            chatIsOpen={false}
                            key={key}
                            id={key}
                            handleOpenChat={() =>
                              openChat(key, chat[key].userInfo)
                            }
                          />
                        </CSSTransition>
                      );
                    })}
                </TransitionGroup>
              }
              <Box />{" "}
            </Box>
            <Box
              sx={{
                width: "100%",
                borderBottom: "1px solid rgba(0,0,0,0.1)",
                // display: { xs: "block" },
              }}
            >
              <TransitionGroup>
                {!isHeChattingWithAll && (
                  <CSSTransition timeout={500} classNames="item">
                    <Box
                      sx={{
                        width: "100%",
                        borderBottom: "1px solid rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="text.hover"
                        component="p"
                        textAlign={"center"}
                      >
                        User's whom you don't have chat with
                      </Typography>
                    </Box>
                  </CSSTransition>
                )}{" "}
              </TransitionGroup>
              <Box
                sx={{
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  display: { xs: "flex" },
                }}
              >
                <TransitionGroup
                  style={{
                    display: "flex",
                    flexGrow: 1,
                    justifyContent: "space-evenly",
                    flexWrap: "wrap",
                  }}
                >
                  {users.map((userExist) => {
                    const doesHeHaveChat = chats.some((chat) =>
                      Object.keys(chat)[0].includes(userExist.uid)
                    );
                    const alreadyChattingWithHim =
                      userExist.uid === userBuddy.user?.uid || "";
                    if (!alreadyChattingWithHim) {
                      if (!doesHeHaveChat) {
                        return (
                          <CSSTransition
                            key={userExist.uid}
                            timeout={500}
                            classNames="item"
                          >
                            <DisplayUserSmallScreen
                              user={userExist}
                              display={userExist.uid !== user.user?.uid}
                              handleOpenChat={() => handleClick(userExist)}
                            />
                          </CSSTransition>
                        );
                      }
                    }
                    return null;
                  })}
                </TransitionGroup>
              </Box>
            </Box>
          </Grid>
          {/*           <Grid
            container
            item
            xs={1}
            sm={4}
            md={3}
            sx={{ display: { xs: "flex", md: "none", sm: "none" } }}
          ></Grid> */}
          <Grid
            container
            item
            xs={9}
            sm={7}
            md={9}
            spacing={4}
            sx={{ justifyContent: "space-between" }}
          >
            {posts.map(({ id, post }) => (
              <Grid key={id} container item xs={11} sm={6} md={4}>
                <PostTemplate post={post} postId={id} />
              </Grid>
            ))}
          </Grid>
          {/* <Grid container item xs={1} sm={1} md={1}></Grid> */}
        </Grid>
      </Box>
    );
  } else {
    return <LoaderComponent />;
  }
};

export default PostsPage;
