
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, SendHorizontalIcon, FileText, Trash2 } from "lucide-react";

type MessageInputProps = {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
};

const MessageInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleFileUpload,
  isLoading = false
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      handleFileUpload(fileInputRef.current as unknown as React.ChangeEvent<HTMLInputElement>);
      setSelectedFile(null);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {selectedFile && (
        <div className="flex items-center justify-between bg-warm-700/10 p-2 rounded">
          <div className="flex items-center">
            <FileText className="h-4 w-4 text-warm-200 mr-2" />
            <span className="text-sm text-warm-200 truncate max-w-[200px]">
              {selectedFile.name}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={clearSelectedFile}
              className="h-7 w-7 p-0"
            >
              <Trash2 className="h-4 w-4 text-warm-300" />
            </Button>
            <Button 
              size="sm" 
              onClick={handleUpload}
              className="h-7 bg-warm-300 hover:bg-warm-300/90 text-xs"
              disabled={isLoading}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}
      <div className="flex space-x-2">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full hover:bg-warm-700/10"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <PaperclipIcon className="h-5 w-5 text-warm-200" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelection}
          />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 focus:ring-warm-200 focus:border-warm-200"
          disabled={isLoading}
        />
        <Button
          type="button"
          size="icon"
          className="rounded-full bg-warm-300 hover:bg-warm-300/90"
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || isLoading}
        >
          {isLoading && !selectedFile ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-warm-100 border-t-transparent" />
          ) : (
            <SendHorizontalIcon className="h-5 w-5 text-dark" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
