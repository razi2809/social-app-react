import { Avatar, Box, Typography } from "@mui/material";
import React, { FC, useEffect, useLayoutEffect, useRef } from "react";
import { useAppSelector } from "../../REDUX/bigpie";
import firebase from "firebase/compat/app";

interface Props {
  message: {
    date: firebase.firestore.Timestamp;
    text: string;
    senderId: string;
    id: string;
    Image?: string;
    blurhash?: string;
  };
  didISend: boolean;
  user: firebase.User | null;
  onImageLoad: () => void;
}
const MessageTemplate: FC<Props> = ({
  message,
  didISend,
  user,
  onImageLoad,
}) => {
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
        // ref={!imgLoading ? (index === "last" ? lastMessageRef : null) : null}
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
              backgroundColor: didISend
                ? "rgba(25, 118, 210, 0.8)"
                : "rgba(220, 220, 220, 0.8)", // Adjust the alpha for opacity
              borderRadius: "10px",
              position: "relative",
            }}
          >
            {message.Image && (
              <Box sx={{ width: "100%", height: "auto", position: "relative" }}>
                <img
                  src={message.Image}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px", // Set a max-height for images
                    display: "block", // This removes bottom space under the image
                    marginBottom: "10px", // Add space between the image and the text
                  }}
                  alt="Sent image"
                  onLoad={onImageLoad}
                />
              </Box>
            )}
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

export default MessageTemplate;
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
