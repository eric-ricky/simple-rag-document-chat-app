import { Loader } from "lucide-react";

const DahsboardLoading = () => {
  return (
    <div className="min-h-[75vh] grid place-items-center">
      <Loader className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
};

export default DahsboardLoading;
