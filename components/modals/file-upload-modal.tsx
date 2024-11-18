import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useFetchFolders from "@/hooks/db/use-fetch-folders";
import { useFileUploadModal } from "@/hooks/modal-state/use-file-upload-modal";
import useUser from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
import { Folder } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronsUpDown,
  FileText,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";

const FileUploadModal = () => {
  const { user } = useUser();
  const supabase = createClient();

  const { isOpen, onClose } = useFileUploadModal();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const { folders } = useFetchFolders(isOpen);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    setUploading(true);
    setProgress(0);

    try {
      if (!selectedFolder) throw new Error("No folder selected");
      if (!user) throw new Error("Not authenticated");

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${user.id}/${selectedFolder.id}/${Date.now()}-${
          file.name
        }`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("documents")
          .upload(fileName, file);
        console.log("UPLOAD ERROR", uploadError);
        if (uploadError) throw uploadError;

        // Save to documents
        const { data: savedDocument, error: saveDcoumentError } = await supabase
          .from("documents")
          .insert({
            name: fileName,
            label: file.name,
            user_id: user.id,
            folder_id: selectedFolder.id,
          });
        console.log("SAVE DOCUMENT ERROR", saveDcoumentError);
        if (saveDcoumentError) throw saveDcoumentError;
        console.log("SAVED DOCUMENT===>", savedDocument);

        setProgress(((i + 1) / files.length) * 100);
      }

      toast.success("Documents uploaded successfully");
      setFiles([]);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-screen-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upload Your File
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your PDF file to the selected folder.
          </p>
        </DialogHeader>

        <div className="mt-4">
          {/* Folder Selection Combobox */}
          <div className="mb-4">
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedFolder
                    ? folders.find((folder) => folder.id === selectedFolder.id)
                        ?.name
                    : "Select folder..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search folders..." />
                  <CommandEmpty>No folder found.</CommandEmpty>
                  <CommandGroup>
                    {folders.map((folder) => (
                      <CommandItem
                        key={folder.id}
                        onSelect={() => {
                          setSelectedFolder(
                            folder.id === selectedFolder?.id ? null : folder
                          );
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFolder?.id === folder.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {folder.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              isDragActive ? "border-primary" : "border-muted-foreground/25"
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <input {...getInputProps()} className="hidden" />
              <div className="flex items-center justify-center w-12 h-12">
                <FileText className="w-8 h-8 text-blue-400" />
                <Plus className="w-4 h-4 text-blue-400 -ml-3 mt--8" />
              </div>
              <p className="text-sm text-center text-gray-600">
                Drag and drop your PDF file here or click to browse
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
            <p>Supported formats: PDF</p>
            <p>Max size: 25MB</p>
          </div>

          {files.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-4">
              <h2 className="font-medium mb-4">Selected Files</h2>
              <ScrollArea className="max-h-[calc(20rem)] p-2">
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span className="flex-1 text-sm font-medium truncate max-w-20 md:max-w-sm">
                          {file.name}
                        </span>
                        <span className="ml-auto text-sm text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {uploading && (
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Uploading documents... {Math.round(progress)}%
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="px-4"
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={uploadFiles}
              disabled={uploading || files.length === 0 || !selectedFolder}
              className="px-6 bg-blue-500 hover:bg-blue-600"
            >
              {uploading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Upload className="size-4 mr-2" />
              )}
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
