import {
  Avatar,
  Box,
  Card,
  CardContent,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { memo } from "react";

interface User {
  avatar: string;
  displayName: string;
  uid: string;
}

interface DisplayUserSmallScreenProps {
  user: User;
  display: Boolean;
  handleOpenChat: (user: User) => void;
}

const DisplayUserSmallScreen: React.FC<DisplayUserSmallScreenProps> = ({
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
          m: 1,
        }}
      >
        {" "}
        <Tooltip title={user?.displayName}>
          <Avatar
            sx={{
              position: "static",
            }}
            src={user.avatar}
            alt={user.displayName}
          />
        </Tooltip>
      </Box>
    );
  } else return null;
};

export default memo(DisplayUserSmallScreen);
