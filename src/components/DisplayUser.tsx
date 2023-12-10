import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import React, { memo } from "react";

interface User {
  avatar: string;
  displayName: string;
  uid: string;
}

interface DisplayUserProps {
  user: User;
  display: Boolean;
  handleOpenChat: (user: User) => void;
}

const DisplayUser: React.FC<DisplayUserProps> = ({
  user,
  display,
  handleOpenChat,
}) => {
  if (display) {
    return (
      <Box
        onClick={() => {
          handleOpenChat(user);
        }}
        sx={{
          cursor: "pointer",
          height: "100%",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          padding: "12px", // Add padding for a more comfortable feel
          borderRadius: "8px", // Add rounded corners for a softer look
          mb: 1,
        }}
      >
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-between",
            minHeight: 60, // Set a minimum height
            maxHeight: 100, // Set a maximum height or adjust as needed
            alignItems: "center",
            padding: "10px", // Add padding for a more comfortable feel
            ":hover": {
              backgroundColor: "rgba(32, 40, 77, 0.3)",
            },
            borderRadius: "8px", // Add rounded corners for a softer look
            // border: "none",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            // transition: "background-color 0.3s, box-shadow 0.3s",
            // padding: "12px", // Add padding for a more comfortable feel
          }}
        >
          <Avatar
            src={user.avatar}
            alt={user.displayName}
            style={{ margin: "10px" }}
          />
          <CardContent>
            <Typography variant="h5">{user.displayName}</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  } else return null;
};

export default memo(DisplayUser);
