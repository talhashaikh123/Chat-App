import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // -----------------------------
  // Load sidebar users
  // -----------------------------
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // -----------------------------
  // Load chat messages
  // -----------------------------
  getMessages: async (userId) => {
    if (!userId) return;

    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // -----------------------------
  // Send a new message
  // -----------------------------
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser?._id) return;

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  // -----------------------------
  // Subscribe to WebSocket messages
  // -----------------------------
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser?._id) return;

    const socket = useAuthStore.getState().socket;

    // Socket not ready yet → skip
    if (!socket) return;

    // IMPORTANT: remove previous listeners to avoid duplicates  
    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      const currentSelected = get().selectedUser;

      // Only add message from the user we are chatting with
      if (!currentSelected) return;
      if (newMessage.senderId !== currentSelected._id) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  // -----------------------------
  // Unsubscribe on cleanup
  // -----------------------------
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  // -----------------------------
  // Select a chat user
  // -----------------------------
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
