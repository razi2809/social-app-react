import React, { FC, useEffect, useRef, useState } from "react";
import firebase from "firebase/compat/app";
import { useAppSelector } from "../../REDUX/bigpie";
import { debounce } from "lodash";

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

const MessagessContainrtest: FC<Props> = ({ messages }) => {
  const chatBuddy = useAppSelector((bigPie) => bigPie.chatReducer);
  const user = useAppSelector((bigPie) => bigPie.authReducer);
  const [scrollToIndex, setScrollToIndex] = useState<null | number>(
    messages.length - 1
  );

  useEffect(() => {
    if (messages.length > 0) {
      setScrollToIndex(messages.length - 1);
      const timer = setTimeout(() => {
        setScrollToIndex(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);
  console.log(scrollToIndex);

  const cache = useRef(
    new CellMeasurerCache({
      defaultHeight: 100,
      fixedWidth: true,
    })
  ).current;
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
  return (
    <AutoSizer>
      {({ width, height }) => (
        <List
          width={width}
          height={height}
          rowCount={messages.length}
          rowHeight={cache.rowHeight}
          rowRenderer={rowRenderer}
          scrollToIndex={scrollToIndex ? scrollToIndex : undefined}
        />
      )}
    </AutoSizer>
  );
};

export default MessagessContainrtest;
/*     <div>
      {messages.map((message) => (
        <MessageTemplate
          key={message.id}
          message={message}
          didISend={message.senderId !== chatBuddy.user?.uid}
          user={user.user}
          onImageLoad={() => {
            // measure();
          }}
        />
      ))}
    </div> */
