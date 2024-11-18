import { create } from "zustand";

interface FileUploadModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFileUploadModal = create<FileUploadModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
