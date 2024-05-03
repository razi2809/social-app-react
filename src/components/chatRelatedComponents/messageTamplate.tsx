import { Avatar, Box, Tooltip, Typography } from "@mui/material";
import React, { FC } from "react";
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
          <Tooltip title={chatBuddy.user.displayName}>
            <Avatar
              sx={{ marginRight: "10px" }}
              src={
                !didISend ? chatBuddy.user?.photourl || undefined : undefined
              }
            />
          </Tooltip>
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
                    height: "100px", // Set a max-height for images
                    display: "block", // This removes bottom space under the image
                    marginBottom: "10px", // Add space between the image and the text
                  }}
                  alt=""
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
          <Tooltip title={user?.displayName}>
            <Avatar
              sx={{ marginLeft: "10px" }}
              src={didISend ? user?.photoURL || undefined : undefined}
            />
          </Tooltip>
        )}
      </Box>
    );
  } else {
    return null;
  }
};

export default MessageTemplate;
