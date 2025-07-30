import { User } from "@prisma/client";
import { create } from "zustand";

interface UsersStore {
  isOpen: boolean;
  selectedUser: User;
  refetchUsers: () => void;
  openDialog: (user: User) => void;
  closeDialog: () => void;
  setRefetch: (fn: () => void) => void;
}

export const useUsersStore = create<UsersStore>((set) => ({
  isOpen: false,
  selectedUser: {} as User,
  refetchUsers: () => {},
  openDialog: (user) => set({ isOpen: true, selectedUser: user }),
  closeDialog: () => set({ isOpen: false, selectedUser: {} as User }),
  setRefetch: (fn) => set({ refetchUsers: fn }),
}));
