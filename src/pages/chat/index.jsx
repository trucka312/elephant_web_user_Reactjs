import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { ChatList } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import Scrollbars from "react-custom-scrollbars";
import { io } from "socket.io-client";
import { styled } from "styled-components";
import { useChatStore } from "../../store/chatStore";
import { alerts } from "../../utils/alerts";
import { handleShowTime } from "../../utils/date";
import MessageListBox from "./MessageListBox";
import SkeletonChatBox from "./Skeleton";
import { constants } from "../../constants";
import DefaultImage from "../../assets/images/image-default.jpg";

const StyledChatContainer = styled.div`
  .chat-container {
    .rce-container-mlist.message-list {
      .rce-container-mbox {
        .rce-mbox {
          border-radius: 6px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          max-width: 500px;
        }
        .rce-mbox.rce-mbox-right {
          background-color: #e6efff;
        }
        .rce-mbox-right-notch {
          display: none;
        }
      }
    }
  }
`;

export default function Chat() {
  const {
    getAllChatBox,
    chatBox,
    handleReceiveMessage,
    handleSelectCustomer,
    loadingChatBox,
  } = useChatStore();
  const [selectedChatBox, setSelectedChatBox] = useState(null);
  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const socket = io(constants.HOST_SOCKET);
    if (profile) {
      socket.on(
        `chat:message_from_customer_to_store:${profile.id}`,
        (messages) => {
          if (messages?.id) {
            handleReceiveMessage(messages, selectedChatBox?.customer_id);
          }
        }
      );
    }
    return () => {
      socket.disconnect();
    };
  }, [selectedChatBox]);

  useEffect(() => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alerts.error(err);
    };
    getAllChatBox(onSuccess, onFail);
  }, []);

  const convertDataChatBox = () => {
    const newChatBox = [...chatBox];
    if (!newChatBox.length) return [];
    const result = newChatBox.map((item) => {
      const { user_unread, last_message, customer, customer_id } = item;
      const isUnRead = user_unread > 0;
      return {
        avatar: customer.avatar_image || DefaultImage,
        alt: "avatar",
        title: (
          <span className={isUnRead ? "font-medium text-black" : ""}>
            {customer.name || "Khách hàng"}
          </span>
        ),
        subtitle: (
          <span className={isUnRead ? "font-medium text-black" : ""}>
            {last_message.content}
          </span>
        ),
        date: new Date(),
        dateString: (
          <span className={isUnRead ? "font-medium text-black" : ""}>
            {handleShowTime(last_message.created_at)}
          </span>
        ),
        unread: isUnRead && user_unread,
        customer_id: customer_id,
      };
    });

    return result;
  };

  const onSelectChatBox = (item) => {
    handleSelectCustomer(item.customer_id);
    setSelectedChatBox(item);
  };

  const handleSearch = (value) => {
    // const newChatBox = [...get().chatBox];
    // console.log('newChatBox: ', newChatBox);
    // const result = newChatBox.filter((item) =>
    //   (item?.customer?.name || "Khách hàng").toLowerCase().includes(value.toLowerCase())
    // );
    // set({ chatBox: result });
  };

  const renderChatBox = () => {
    if (loadingChatBox) return <SkeletonChatBox />;
    if (!convertDataChatBox() && !convertDataChatBox().length)
      return (
        <p className="text-center text-[#bababa] mt-4 text-[16px]">
          Chưa có đoạn chat nào!
        </p>
      );
    return (
      <ChatList
        className="chat-list"
        dataSource={convertDataChatBox()}
        onClick={(item) => onSelectChatBox(item)}
      />
    );
  };

  return (
    <StyledChatContainer>
      <div className="flex relative h-[calc(100vh-140px)] chat-container">
        <div className="w-[400px] h-full">
          <div className="h-[56px] flex items-center justify-center px-6 border-[1px] border-solid border-[#d6dbe1] border-t-0 border-l-0 border-r-0">
            <div className="relative">
              <Input
                onChange={(e) => handleSearch(e.target.value)}
                className="bg-[#eaedf0] border-none w-[300px] py-[5px] pl-[30px] focus:bg-white"
                placeholder="Tìm kiếm"
              />
              <SearchOutlined className="absolute left-[10px] top-[51%] translate-y-[-50%] text-[#081c36]" />
            </div>
          </div>
          <Scrollbars style={{ height: "100%", width: "100%" }}>
            {renderChatBox()}
          </Scrollbars>
        </div>

        <div className="flex-1 h-full border-t-0 border-r-0 border-b-0 mb-0">
          {selectedChatBox ? (
            <MessageListBox selectedChatBox={selectedChatBox} />
          ) : (
            <div className="w-full h-full flex items-center justify-center border-l-[1px] border-solid border-[#d6dbe1] border-t-0 border-r-0 border-b-0">
              <p className="text-[20px] text-[#21409a] ">
                Chọn 1 khách hàng để gửi tin nhắn!
              </p>
            </div>
          )}
        </div>
      </div>
    </StyledChatContainer>
  );
}
