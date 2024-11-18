"use client";

import { useIsMounted } from "usehooks-ts";
import FileUploadModal from "../modals/file-upload-modal";

const ModalProvider = () => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <>
      <FileUploadModal />
    </>
  );
};

export default ModalProvider;
