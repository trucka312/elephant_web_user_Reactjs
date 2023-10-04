import { Avatar } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { MessageList } from "react-chat-elements";
import Scrollbars from "react-custom-scrollbars";
import { io } from "socket.io-client";
import SendIcon from "../../assets/icons/SendIcon";
import { useChatStore } from "../../store/chatStore";
import { alerts } from "../../utils/alerts";
import { handleShowTime } from "../../utils/date";
import "./index.css";
import { constants } from "../../constants";

export default function MessageListBox({ selectedChatBox }) {
  const {
    getMessageListById,
    loadingMessage,
    messages,
    sendMessageToCustomer,
    handleSendMessage,
  } = useChatStore();
  const profile = JSON.parse(localStorage.getItem("profile"));

  const messageListRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef();
  const [inputMessage, setInputMessage] = useState("");

  // scroll to bottom
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // get message list
  useEffect(() => {
    if (selectedChatBox?.customer_id) {
      inputRef.current.focus();
      const onSuccess = () => {};
      const onFail = (err) => {
        alerts.error(err);
      };
      getMessageListById(selectedChatBox?.customer_id, onSuccess, onFail);
    }
  }, [selectedChatBox?.customer_id]);

  //Listen server
  useEffect(() => {
    socketRef.current = io(constants.HOST_SOCKET);
    if (profile && selectedChatBox?.customer_id) {
      socketRef.current.on(
        `chat:message_from_store_to_customer:${profile.id}:${selectedChatBox?.customer_id}`,
        (messages) => {
          if (messages?.id) {
            handleSendMessage(messages, selectedChatBox?.customer_id);
            inputRef.current.focus();
          }
        }
      );
    }

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedChatBox]);

  const convertDataMessage = () => {
    if (!messages || !messages.length) return [];
    const newMessageList = [...messages];
    newMessageList.reverse();
    return newMessageList.map((item) => {
      const { content, is_user, created_at } = item;
      return {
        position: is_user ? "right" : "left",
        type: "text",
        text: content,
        date: new Date(),
        dateString: handleShowTime(new Date(created_at)),
      };
    });
  };

  const handleEnterInputMessage = (e) => {
    if (e.keyCode !== 13) return;
    event.preventDefault();
    inputRef.current.focus();
    onSendMessage();
  };

  const onSendMessage = () => {
    if (!inputMessage) return;
    sendMessageToCustomer(selectedChatBox?.customer_id, {
      content: inputMessage,
      link_images: "",
      product_id: null,
    });
    setInputMessage("");
  };

  const renderMessageList = () => {
    if (loadingMessage)
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-100 opacity-90"></div>
      );
    if (!messages || !messages.length)
      return (
        <p className="text-center text-[#ccc] mt-4 text-[16px]">
          Chưa có tin nhắn nào!
        </p>
      );
    return (
      <Scrollbars
        style={{ height: "100%", width: "100%", overflowX: "hidden" }}
        autoHide
      >
        <div className="px-10 pt-10 pb-5 overflow-x-hidden ">
          <MessageList
            className="message-list overflow-x-hidden"
            dataSource={convertDataMessage()}
            height="100%"
            width="100%"
            replyButton={true}
            style={{ overflowX: "hidden" }}
            toBottomHeight={"100%"}
            removeButton={true}
            downButton={true}
          />
          <div ref={messageListRef} />
        </div>
      </Scrollbars>
    );
  };

  const { title, avatar } = selectedChatBox;

  return (
    <div className="w-full h-[calc(100vh-94px)] flex flex-col gap-1 relative overflow-x-hidden bg-slate-100">
      {messages.length ? (
        <div className="flex gap-2 items-center px-5 py-2 bg-white border-b-[1px] border-solid border-[#f5f5f5] border-l-0 border-r-0 border-t-0">
          <Avatar src={avatar} size="large" width={50} height={50} />
          <span className="font-medium">{title}</span>
        </div>
      ) : (
        <div className="h-[56px] flex gap-2 items-center px-5 py-2 bg-white border-b-[1px] border-solid border-[#f5f5f5] border-l-0 border-r-0 border-t-0"></div>
      )}
      <div className="flex-1 overflow-x-hidden message-list-box">
        {renderMessageList()}
      </div>
      <div className="flex w-full px-[58px] gap-4 pt-2">
        <input
          ref={inputRef}
          placeholder="Message"
          onChange={(e) => setInputMessage(e.target.value)}
          value={inputMessage}
          onKeyDown={handleEnterInputMessage}
          className="outline-none px-5 py-2 rounded-[10px] border-[1px] border-solid border-[#f5f5f5] w-full"
        />
        <div
          onClick={() => onSendMessage()}
          title="Send"
          className="bg-white rounded-full w-[63px] cursor-pointer h-[56px] m-0 flex items-center justify-center group hover:bg-[#3390EC]  transition duration-300"
        >
          <SendIcon className="ml-[2px] w-[20px] h-[20px] group-hover:text-white text-[#3390EC] transition duration-300" />
        </div>
      </div>
    </div>
  );
}

MessageListBox.propTypes = {
  selectedChatBox: PropTypes.object,
};
