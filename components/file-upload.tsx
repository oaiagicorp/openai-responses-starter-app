"use client";
import React, { useCallback, useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FilePlus2, Plus, Trash2, CircleX } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FileUploadProps {
  vectorStoreId?: string;
  vectorStoreName?: string;
  onAddStore: (id: string) => void;
  onUnlinkStore: () => void;
}

export default function FileUpload({
  vectorStoreId,
  onAddStore,
  onUnlinkStore,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [newStoreName, setNewStoreName] = useState<string>("Default store");
  const [uploading, setUploading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const acceptedFileTypes = {
    "text/x-c": [".c"],
    "text/x-c++": [".cpp"],
    "text/x-csharp": [".cs"],
    "text/css": [".css"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "text/x-golang": [".go"],
    "text/html": [".html"],
    "text/x-java": [".java"],
    "text/javascript": [".js"],
    "application/json": [".json"],
    "text/markdown": [".md"],
    "application/pdf": [".pdf"],
    "text/x-php": [".php"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "text/x-python": [".py"],
    "text/x-script.python": [".py"],
    "text/x-ruby": [".rb"],
    "application/x-sh": [".sh"],
    "text/x-tex": [".tex"],
    "application/typescript": [".ts"],
    "text/plain": [".txt"],
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: acceptedFileTypes,
  });

  const removeFile = () => {
    setFile(null);
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setUploading(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const base64Content = arrayBufferToBase64(arrayBuffer);
      const fileObject = {
        name: file.name,
        content: base64Content,
      };

      // 1. Upload file
      const uploadResponse = await fetch("/api/vector_stores/upload_file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileObject,
        }),
      });
      if (!uploadResponse.ok) {
        throw new Error("Error uploading file");
      }
      const uploadData = await uploadResponse.json();
      const fileId = uploadData.id;
      if (!fileId) {
        throw new Error("Error getting file ID");
      }
      console.log("Uploaded file:", uploadData);

      let finalVectorStoreId = vectorStoreId;

      // 2. If no vector store is linked, create one
      if (!vectorStoreId || vectorStoreId === "") {
        const createResponse = await fetch("/api/vector_stores/create_store", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storeName: newStoreName,
          }),
        });
        if (!createResponse.ok) {
          throw new Error("Error creating vector store");
        }
        const createData = await createResponse.json();
        finalVectorStoreId = createData.id;
      }

      if (!finalVectorStoreId) {
        throw new Error("Error getting vector store ID");
      }

      onAddStore(finalVectorStoreId);

      // 3. Add file to vector store
      const addFileResponse = await fetch("/api/vector_stores/add_file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId,
          vectorStoreId: finalVectorStoreId,
        }),
      });
      if (!addFileResponse.ok) {
        throw new Error("Error adding file to vector store");
      }
      const addFileData = await addFileResponse.json();
      console.log("Added file to vector store:", addFileData);
      setFile(null);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error during file upload process:", error);
      alert("There was an error processing your file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center justify-center gap-1 rounded-full border border-border bg-card py-1 px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <Plus size={16} />
          Upload
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] max-h-[80vh] overflow-y-scrollfrtdtd">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add files to your vector store</DialogTitle>
          </DialogHeader>
          <div className="my-6">
            {!vectorStoreId || vectorStoreId === "" ? (
              <div className="flex items-start gap-2 text-sm text-foreground">
                <label className="font-medium w-72" htmlFor="storeName">
                  New vector store name
                  <div className="text-xs text-muted-foreground">
                    A new store will be created when you upload a file.
                  </div>
                </label>
                <Input
                  id="storeName"
                  type="text"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  className="rounded p-2"
                />
              </div>
            ) : (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-sm font-medium w-24 text-nowrap">
                    Vector store
                  </div>
                  <div className="text-xs font-mono text-muted-foreground flex-1 text-ellipsis truncate">
                    {vectorStoreId}
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CircleX
                          onClick={() => onUnlinkStore()}
                          size={16}
                          className="mb-0.5 mt-0.5 shrink-0 cursor-pointer text-muted-foreground transition-all hover:text-foreground"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Unlink vector store</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4 flex h-[200px] items-center justify-center">
            {file ? (
              <div className="flex flex-col items-start text-foreground">
                <div className="text-muted-foreground">Loaded file</div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2">{file.name}</div>

                  <Trash2
                    onClick={removeFile}
                    size={16}
                    className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div
                  {...getRootProps()}
                  className="relative flex items-center justify-center p-6 focus-visible:outline-0"
                >
                  <input {...getInputProps()} />
                  <div
                    className={`absolute rounded-full transition-all duration-300 ${
                      isDragActive
                        ? "h-56 w-56 bg-accent"
                        : "h-0 w-0 bg-transparent"
                    }`}
                  ></div>
                  <div className="z-10 flex cursor-pointer flex-col items-center text-center text-muted-foreground">
                    <FilePlus2 className="mb-4 size-8" />
                    <div>Upload a file</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
