import { create } from "zustand";
import { RepositoryRemote } from "../services";

export const useChatStore = create((set, get) => ({
  chatBox: [],
  messages: [],
  loading: false,
  loadingChatBox: false,
  loadingMessage: false,
  getAllChatBox: async (onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingChatBox: true });
      const response = await RepositoryRemote.chat.getAllChatBox();
      set({ chatBox: response.data.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingChatBox: false });
  },
  getMessageListById: async (id, onSuccess = () => {}, onFail = () => {}) => {
    try {
      set({ loadingMessage: true });
      const response = await RepositoryRemote.chat.getMessageListById(id);
      set({ messages: response.data.data.data });
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi xảy ra!");
    }
    set({ loadingMessage: false });
  },
  sendMessageToCustomer: async (
    id,
    params,
    onSuccess = () => {},
    onFail = () => {}
  ) => {
    try {
      const response = await RepositoryRemote.chat.sendMessageToCustomer(
        id,
        params
      );
      onSuccess(response.data.data);
    } catch (error) {
      onFail(error?.response?.data?.msg || "Có lỗi không gửi được tin nhắn!");
    }
  },
  handleReceiveMessage: (message, cusId) => {
    const targetIndex = get().chatBox.findIndex(
      (item) => item.customer_id === message.customer_id
      // (item) => item.customer_id === cusId
    );
    if (targetIndex === -1) {
      const targetElement = {};
      targetElement.last_message.content = message.content;
      targetElement.last_message.created_at = message.created_at;
      targetElement.user_unread = message.uread;
    } else {
      const newChatBox = [...get().chatBox];
      const targetElement = newChatBox.splice(targetIndex, 1)[0];
      targetElement.last_message.content = message.content;
      targetElement.last_message.created_at = message.created_at;
      targetElement.user_unread = message.uread;
      if(cusId === message.customer_id) {
        set({ messages: [message, ...get().messages] });
        targetElement.user_unread = 0;
      }
      newChatBox.unshift(targetElement);
      set({ chatBox: newChatBox });
    }
    // set({ messages: [message, ...get().messages] });
    // const targetIndex = get().chatBox.findIndex(
    //   (item) => item.customer_id === cusId
    // );
    // const newChatBox = [...get().chatBox];
    // if (targetIndex !== -1) {
    //   const targetElement = newChatBox.splice(targetIndex, 1)[0];
    //   targetElement.last_message.content = message.content;
    //   targetElement.last_message.created_at = message.created_at;
    //   targetElement.last_message.user_unread = message.uread;
    //   newChatBox.unshift(targetElement);
    //   set({ chatBox: newChatBox });
    // }
  },
  handleSendMessage: (message, cusId) => {
    set({ messages: [message, ...get().messages] });
    const targetIndex = get().chatBox.findIndex(
      (item) => item.customer_id === cusId
    );
    const newChatBox = [...get().chatBox];
    if (targetIndex !== -1) {
      const targetElement = newChatBox.splice(targetIndex, 1)[0];
      targetElement.last_message.content = message.content;
      targetElement.last_message.created_at = message.created_at;
      targetElement.user_unread = message.uread;
      newChatBox.unshift(targetElement);
      set({ chatBox: newChatBox });
    }
  },
  handleSelectCustomer: (id) => {
    const targetIndex = get().chatBox.findIndex(
      (item) => item.customer_id === id
      );
    const newChatBox = [...get().chatBox];
    const targetElement = newChatBox[targetIndex];
    targetElement.user_unread = 0;
    set({ chatBox: newChatBox });
  },
  
}));
