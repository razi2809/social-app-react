import { Box, Grid } from "@mui/material";
import React, { Fragment, memo } from "react";
import { useSearchParams } from "react-router-dom";
import ChatSideBar from "./ChatSidebBar";
import ChatTemplat from "./chatTemplat";
import ChatInput from "./ChatInput";

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const chatId: string = searchParams.get("uid")!;
  const MemoChatInput = memo(ChatInput);

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        item
        sm={4}
        xs={12}
        md={3}
        sx={{
          bgcolor: "divider",
        }}
      >
        {" "}
        <ChatSideBar chatId={chatId} />
      </Grid>
      <Grid
        item
        sm={8}
        xs={12}
        md={9}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          bgcolor: "divider",
        }}
      >
        {" "}
        {chatId && (
          <Fragment>
            <Box
              sx={{
                // overflowY: "auto",
                flexGrow: 1,
              }}
            >
              <ChatTemplat />
            </Box>
            {/*  <Box>
              <MemoChatInput />
            </Box>{" "} */}
          </Fragment>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatInterface;
