import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PostTemplate from "../components/PostTemplate";
import firebase from "firebase/compat/app";

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
  useEffect(() => {
    db.collection(`posts`).onSnapshot((snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: {
            imgurl: doc.data().imgUrl,
            avatar: doc.data().avatar,
            username: doc.data().username,
            edited: doc.data().edited,
            timestamp: doc.data().timestamp,
            title: doc.data().title,
          },
        }))
      );
    });
  }, []);
  console.log(posts);

  return (
    <>
      {posts.length ? (
        <Grid container spacing={4}>
          {posts.map(({ id, post }) => (
            <Grid key={id} container item xs={12} sm={6} md={3}>
              <PostTemplate post={post} postId={id} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="h1" color="initial">
          hello
        </Typography>
      )}
    </>
  );
};

export default PostsPage;
