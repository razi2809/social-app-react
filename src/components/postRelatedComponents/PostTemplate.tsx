// Instagram Post Template
import React, { FC, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
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
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import { db } from "../../firebase";
import firebase from "firebase/compat/app";
import DeleteIcon from "@mui/icons-material/Delete";
import CommentsTamplate from "./CommentsTamplate";
import EditIcon from "@mui/icons-material/Edit";
import { useAppSelector } from "../../REDUX/bigpie";
interface Props {
  postId: string;
  post: {
    imgurl: string;
    avatar: string;
    username: string;
    edited: Boolean;
    timestamp: firebase.firestore.Timestamp;
    title: string;
  };
}
interface Comment {
  id: string;
  comment: {
    comment: string;
    timestamp: firebase.firestore.Timestamp;
    userName: string;
    avatar: string;
    edited: boolean;
  };
}
const PostTemplate: FC<Props> = ({ post, postId }) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [editPost, setEditPost] = useState(false);
  const [editText, setEditText] = useState(post.title);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const image = post.imgurl;
  const avatar = post.avatar;
  const caption = post.title;
  const who = post.username;
  useEffect(() => {
    db.collection(`posts`)
      .doc(postId)
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
            },
          }))
        );
      });
  }, []);

  useEffect(() => {
    if (post.timestamp == null) return;
    const when = post.timestamp.toDate();
    let time = formatDistanceToNow(when, { addSuffix: true });
    time = time.replace("about ", "");
    setTimeAgo(time);
  }, [post.timestamp]);
  const handleComment = () => {
    db.collection("posts").doc(postId).collection("comments").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      comment: comment,
      userName: user.user?.displayName,
      edited: false,
      avatar: user.user?.photoURL,
    });
    setComment("");
  };
  const handleEdit = () => {
    setEditPost(true);
  };
  const handleupdate = () => {
    db.collection("posts").doc(postId).update({
      title: editText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      edited: true,
    });
    setEditPost(false);
  };

  return (
    <Card sx={{ borderRadius: 2, bgcolor: "divider", width: "100%" }}>
      <Grid container>
        <Grid item container md={12}>
          <CardHeader
            avatar={<Avatar src={avatar} />}
            title={who}
            sx={{ p: 1 }}
          />
        </Grid>
        <Grid item md={12}>
          <CardMedia
            component="img"
            alt="Instagram Post Image"
            image={image}
            sx={{ height: 200 }}
          />
        </Grid>
        <Grid item md={12}>
          <CardContent>
            <Typography variant="h6" color="textSecondary" component="p">
              {post.username}
            </Typography>
            {!editPost ? (
              <Typography variant="body2" color="initial">
                {caption}
              </Typography>
            ) : (
              <TextField
                variant="standard"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            )}
          </CardContent>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            {post.edited && (
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
              sx={{ textAlign: "end" }}
            >
              {timeAgo}
            </Typography>
          </Box>

          <CardActions>
            <Button size="small">view all comments</Button>
            <Button size="small">Share</Button>
            <Button size="small">Report</Button>
          </CardActions>
          {comments.length ? (
            comments.map(({ id, comment }) => (
              <CommentsTamplate
                key={id}
                id={id}
                comment={comment}
                postId={postId}
              />
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" component="p">
              no comments yet
            </Typography>
          )}
          {user.isLoggedIn && (
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <Avatar
                src={user.user?.photoURL ?? undefined}
                alt={user.user?.displayName || "User"}
                sx={{ height: 30, width: 30, m: 1 }}
              />
              <TextField
                id={`${postId}-comment`}
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
              <Tooltip title="comment">
                <IconButton onClick={handleComment} aria-label="comment">
                  <CommentIcon />
                </IconButton>
              </Tooltip>
            )}
            {user.isLoggedIn && user.user?.displayName == who && (
              <Tooltip title="delete comment">
                <IconButton
                  onClick={() => {
                    db.collection("posts").doc(postId).delete();
                  }}
                  aria-label="comment"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            {user.isLoggedIn && user.user?.displayName == who && !editPost && (
              <Tooltip title="edit post">
                <IconButton onClick={handleEdit} aria-label="comment">
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {user.isLoggedIn && user.user?.displayName == who && editPost && (
              <Tooltip title="edit comment">
                <IconButton onClick={handleupdate} aria-label="comment">
                  <CommentIcon />
                </IconButton>
              </Tooltip>
            )}
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PostTemplate;
