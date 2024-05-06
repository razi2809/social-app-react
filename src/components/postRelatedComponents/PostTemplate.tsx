// Instagram Post Template
import React, { FC, memo, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  Tooltip,
  Grid,
  CardActions,
  Button,
  IconButton,
  TextField,
  Box,
  Checkbox,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CommentIcon from "@mui/icons-material/Comment";
import { db } from "../../firebase";
import firebase from "firebase/compat/app";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentsTamplate from "./CommentsTamplate";
import EditIcon from "@mui/icons-material/Edit";
import { useAppSelector } from "../../REDUX/bigpie";
import { IComment, IPost } from "../../@types/postRelated";
import { arrayRemove, arrayUnion } from "firebase/firestore";
interface Props {
  post: IPost;
  setSelectedPost: (postId: string) => void;
}

const PostTemplate: FC<Props> = ({ post, setSelectedPost }) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<IComment[]>([]);
  const [editPost, setEditPost] = useState(false);
  const [editText, setEditText] = useState(post.post.title);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const image = post.post.imgurl;
  const avatar = post.post.avatar;
  const caption = post.post.title;
  const who = post.post.username;
  const like = post.post.userLikes.includes(user.user?.uid?.toString() ?? "");
  const userUid = post.post.userCrated;
  useEffect(() => {
    db.collection(`posts`)
      .doc(post.id)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            comment: {
              comment: doc.data().comment,
              timestamp: doc.data().timestamp,
              userName: doc.data().userName,
              avatar: doc.data().avatar,
              edited: doc.data().edited,
              userCrated: doc.data().userCrated,
            },
          }))
        );
      });
  }, []);
  const handleGoUserProfile = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    console.log(userUid);
  };
  const showPost = () => {
    console.log(post.id);
    setSelectedPost(post.id);
  };
  useEffect(() => {
    if (post.post.timestamp == null) return;
    const when = post.post.timestamp.toDate();
    let time = formatDistanceToNow(when, { addSuffix: true });
    time = time.replace("about ", "");
    setTimeAgo(time);
  }, [post.post.timestamp]);
  const handleComment = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();

    if (!comment) return;
    db.collection("posts").doc(post.id).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      comment: comment,
      userName: user.user?.displayName,
      edited: false,
      avatar: user.user?.photoURL,
      userCrated: post.post.userCrated,
    });
    setComment("");
  };
  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    setEditPost(true);
  };
  const handleProductLike = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (!like) {
      db.collection("posts")
        .doc(post.id)
        .update({
          userLikes: arrayUnion(user.user?.uid),
        });
      return;
    }

    db.collection("posts")
      .doc(post.id)
      .update({
        userLikes: arrayRemove(user.user?.uid),
      });
  };
  const handleUpdate = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    db.collection("posts").doc(post.id).update({
      title: editText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      edited: true,
    });
    setEditPost(false);
  };
  console.log(post);

  return (
    <Card
      sx={{ borderRadius: 2, bgcolor: "divider", mb: 3, pb: 2 }}
      onClick={() => showPost()}
    >
      <Grid container>
        <Grid item container md={12}>
          <CardHeader
            avatar={<Avatar src={avatar} />}
            title={who}
            onClick={(e) => handleGoUserProfile(e)}
            sx={{ p: 1, cursor: "pointer" }}
          />
        </Grid>
        <Grid item md={12}>
          <CardMedia
            component="img"
            alt="Instagram Post Image"
            image={image}
            sx={{ width: "100%" }}
          />
        </Grid>
        <CardContent sx={{ width: "100%" }}>
          {/*             <Typography variant="h6" color="textSecondary" component="p">
              {post.post.username}
            </Typography> */}
          {!editPost ? (
            <Typography color="initial" sx={{ width: "100%" }}>
              {caption}
            </Typography>
          ) : (
            <TextField
              variant="standard"
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
                // e.stopPropagation();
              }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </CardContent>
        <Box
          sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          {post.post.edited && (
            <Typography
              variant="body2"
              color="initial"
              sx={{ textAlign: "end", mr: 1 }}
            >
              edited
            </Typography>
          )}
          <Typography
            variant="body2"
            color="initial"
            sx={{ textAlign: "end", pr: 1 }}
          >
            {timeAgo}
          </Typography>
        </Box>

        <CardActions sx={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          <Button size="small">view all comments</Button>
          <Button size="small">Share</Button>
          {user.user?.uid && (
            <Tooltip title="like">
              <Checkbox
                inputProps={{
                  "aria-label": "like",
                }}
                checked={like}
                onClick={(e) => handleProductLike(e)}
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
              />
            </Tooltip>
          )}
        </CardActions>
        {comments.length ? (
          comments.map((comment) => (
            <CommentsTamplate
              key={comment.id}
              comment={comment}
              postId={post.id}
            />
          ))
        ) : (
          <Typography
            variant="h6"
            color="textSecondary"
            component="p"
            sx={{ pl: 2 }}
          >
            no comments yet
          </Typography>
        )}
        {user.isLoggedIn && (
          <Box
            sx={{ display: "flex", alignItems: "flex-end" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar
              src={user.user?.photoURL ?? undefined}
              alt={user.user?.displayName || "User"}
              sx={{ height: 30, width: 30, m: 1 }}
            />
            <TextField
              id={`${post.id}-comment`}
              label="make a comment"
              variant="standard"
              placeholder="add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Box>
        )}

        <CardActions>
          {user.isLoggedIn && (
            <Tooltip title="add comment">
              <IconButton
                onClick={(e) => handleComment(e)}
                aria-label="comment"
              >
                <CommentIcon />
              </IconButton>
            </Tooltip>
          )}
          {user.isLoggedIn && user.user?.displayName == who && (
            <Tooltip title="delete post">
              <IconButton
                onClick={() => {
                  db.collection("posts").doc(post.id).delete();
                }}
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
          {user.isLoggedIn && user.user?.displayName == who && !editPost && (
            <Tooltip title="edit post">
              <IconButton onClick={(e) => handleEdit(e)} aria-label="edit">
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {user.isLoggedIn && user.user?.displayName == who && editPost && (
            <Tooltip title="save">
              <IconButton onClick={(e) => handleUpdate(e)} aria-label="save">
                <SaveIcon />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      </Grid>
    </Card>
  );
};

export default memo(PostTemplate);
