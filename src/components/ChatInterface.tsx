import { Box, Grid } from "@mui/material";
import React, { Fragment, memo } from "react";
import { useSearchParams } from "react-router-dom";
import ChatSideBar from "./ChatSidebBar";
import ChatTemplat from "./chatTemplat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const MemoChatInput = memo(ChatInput);

  console.log("i have rederd");

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid item sm={4} xs={12} md={4}>
        {" "}
        <ChatHeader />
        <ChatSideBar chatId={chatId} />
      </Grid>
      <Grid
        item
        sm={8}
        xs={12}
        md={8}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {" "}
        <ChatHeader />
        {chatId && (
          <Fragment>
            <Box
              sx={{
                overflowY: "auto",
                flexGrow: 1,
                "&::-webkit-scrollbar": {
                  width: "0", // Set the width to 0 to hide the scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "transparent", // Set the thumb color to transparent
                  borderRadius: "5px",
                },
                "&:hover::-webkit-scrollbar-thumb": {
                  background: "#888", // Change thumb color on hover (optional)
                },
                "&:hover::-webkit-scrollbar": {
                  width: "10px", // Show scrollbar on hover (optional)
                },
                // backgroundColor: "#f1f1f1", // Background color for the scrollbar container
              }}
            >
              <Box>
                <ChatTemplat />
              </Box>
            </Box>
            <Box>
              <MemoChatInput />
            </Box>{" "}
          </Fragment>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatInterface;
