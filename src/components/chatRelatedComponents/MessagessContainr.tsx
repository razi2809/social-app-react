import React, { FC, useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../../REDUX/bigpie";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from "react-virtualized";

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
  const [enableSmoothScroll, setEnableSmoothScroll] = useState(false);

  const [scrollToIndex, setScrollToIndex] = useState<number>(
    messages.length - 1
  );

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
    if (messages.length > 0) {
      // Enable smooth scrolling after initial load
      setEnableSmoothScroll(true);
      setScrollToIndex(messages.length - 1);
    }
  }, [messages]);
  const listClassName = enableSmoothScroll ? "smooth-scroll" : "";

  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          className={listClassName}
          width={width}
          height={height}
          rowCount={messages.length}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={scrollToIndex}
        />
      )}
    </AutoSizer>
  );
};

export default MessagessContainr;
