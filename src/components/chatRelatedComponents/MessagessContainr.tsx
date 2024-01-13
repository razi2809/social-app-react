import { Box, Grid } from "@mui/material";
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import MessageTamplate from "./messageTamplate";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../../REDUX/bigpie";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";

import { DocumentReference, doc, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { db } from "../../firebase";
import MessageTemplate from "./messageTamplate";

interface Message {
  date: firebase.firestore.Timestamp;
  id: string;
  senderId: string;
  text: string;
  Image?: string;
}
type Props = {
  messages: Message[];
};

const MessagessContainr: FC<Props> = ({ messages }) => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [shouldScrollToLast, setShouldScrollToLast] = useState(true);

  const cache = new CellMeasurerCache({
    defaultHeight: 70, // Provide a reasonable default height for messages without images
    fixedWidth: true,
  });
  const rowRenderer = ({ index, key, parent, style }: ListRowProps) => {
    const message = messages[index];

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        parent={parent}
        rowIndex={index}
      >
        {({ measure, registerChild }) => (
          <div
            ref={(el) => {
              if (registerChild && el) {
                registerChild(el);
              }
            }}
            style={style}
          >
            <MessageTemplate
              message={message}
              didISend={message.senderId !== chatBuddy.user?.uid}
              user={user.user}
              onImageLoad={() => {
                measure();
              }}
            />
          </div>
        )}
      </CellMeasurer>
    );
  };
  useEffect(() => {
    // After the initial render, allow free scrolling
    setShouldScrollToLast(false);
  }, []);

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          width={width}
          height={height}
          rowCount={messages.length}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={shouldScrollToLast ? messages.length - 1 : undefined}
          // overscanRowCount={5}
        />
      )}
    </AutoSizer>
  );
};

export default MessagessContainr;
