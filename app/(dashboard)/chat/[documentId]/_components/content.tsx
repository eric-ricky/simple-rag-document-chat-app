"use client";

import { MarkdownMessage } from "@/components/markdown-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFetchDocumentChunks from "@/hooks/db/use-fetch-document_chunks";
import useFetchFile from "@/hooks/db/use-fetch-file";
import { createClient } from "@/lib/supabase/client";
import { Message } from "ai";
import { useChat } from "ai/react";
import { Bot, Loader, Send, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProcessDocument from "./process-document";

const suggestedPrompts = [
  {
    label: "Key points",
    prompt: "What are the key points or takeaways from this material?",
  },
  {
    label: "Create flashcards",
    prompt: "Can you turn the content into flashcards for studying?",
  },
  {
    label: "Generate a quiz",
    prompt: "Can you create a short quiz based on this document?",
  },
  {
    label: "Study plan",
    prompt: "Can you help create a study plan based on this material?",
  },
  {
    label: "Clarify instructions",
    prompt:
      "Can you clarify any instructions or tasks mentioned in this material?",
  },
];

export const ChatPageContent = ({
  params,
}: {
  params: { documentId: string };
}) => {
  const supabase = createClient();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const { file } = useFetchFile(params.documentId);
  const { chunks, isLoading: isLoadingChunks } = useFetchDocumentChunks(
    params.documentId
  );
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      if (file?.name) {
        const { data } = await supabase.storage
          .from("documents")
          .createSignedUrl(file.name, 3600); // URL valid for 1 hour

        if (data?.signedUrl) {
          setPdfUrl(data.signedUrl);
        }
      }
    };
    fetchPdfUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.name]);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    setMessages,
    setInput,
  } = useChat({
    api: "/api/chat",
    body: {
      file_name: file?.name,
      document_id: params.documentId,
      user_id: file?.user_id,
    },
    initialMessages: initialMessages,
  });

  // Custom submit handler to save messages
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file?.name) return;

    try {
      // Save the user's message
      // await supabase.from("chats").insert({
      //   content: input,
      //   document_id: params.documentId,
      //   file_name: file.name,
      //   role: "user",
      //   user_id: file.user_id,
      // });

      // Call original submit handler
      await originalHandleSubmit(e);

      // The AI's response will be saved by the API route
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!file?.name) return;

      try {
        const { data: chatHistory, error } = await supabase
          .from("chats")
          .select("*")
          .eq("file_name", file.name)
          .order("created_at", { ascending: true });

        if (error) throw error;

        const formattedMessages = chatHistory.map((msg) => ({
          id: msg.id,
          content: msg.content,
          role: msg.role as "user" | "assistant",
        }));

        setInitialMessages(formattedMessages);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadChatHistory();
  }, [file?.name, supabase, setMessages]);

  useEffect(() => {
    // scroll to bottom of the chat
    scrollAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingChunks || isLoadingHistory) {
    return (
      <div className="container mx-auto max-w-4xl h-screen py-8 flex flex-col">
        <div className="h-full flex flex-col animate-pulse space-y-4 gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-48 md:w-80 rounded bg-muted" />
            <div className="h-4 w-72 md:w-96 rounded bg-muted" />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div className="flex-1 grid place-items-center">
              <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 rounded bg-muted" />
              <div className="h-10 w-10 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        {!isLoadingChunks && !chunks.length ? (
          <ProcessDocument file={file} />
        ) : (
          <div className="h-[90vh] overflow-hidden flex flex-col justify-between p-8">
            <div className="mb-8">
              <h1 className="text-sm md:text-3xl font-bold mb-2">
                {file?.label?.split(".pdf")?.[0] || "Your document"}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base mb-4">
                Ask questions about your uploaded documents
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handlePromptClick(prompt.prompt)}
                    className="text-sm"
                  >
                    {prompt.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex-1 ">
              <ScrollArea className="h-[65vh] flex-1 pr-4 pb-10">
                <div className="hidden last:flex flex-col items-center justify-center gap-2 text-sm font-medium text-muted-foreground/80 text-center p-10">
                  <Image
                    src="/images/no_chats.png"
                    alt="No Chats"
                    width={400}
                    height={400}
                    className="z-10"
                  />

                  <p>Your chats will appear here</p>
                </div>

                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-4 mb-4 ${
                      message.role === "assistant"
                        ? "bg-muted/50 p-4 rounded-lg"
                        : ""
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-6 w-6 mt-1" />
                    ) : (
                      <User className="h-6 w-6 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">
                        {message.role === "assistant" ? "AI Assistant" : "You"}
                      </div>
                      <MarkdownMessage content={message.content} />
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-4 mb-4 bg-muted/40 p-4 rounded-lg animate-pulse">
                    <Bot className="h-6 w-6 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="h-4 w-28 rounded bg-muted" />

                      <div className="mt-2 flex flex-col gap-1">
                        <div className="h-2 w-48 md:w-72 rounded bg-muted" />
                        <div className="h-2 w-52 md:w-80 rounded bg-muted" />
                        <div className="h-2 w-52 md:w-80 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollAreaRef} />
              </ScrollArea>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-auto flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question about your documents..."
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
