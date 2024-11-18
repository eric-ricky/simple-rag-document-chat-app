import { Database } from "@/database.types";

export type Folder = Database["public"]["Tables"]["folders"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentChunk =
  Database["public"]["Tables"]["document_chunks"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Chat = Database["public"]["Tables"]["chats"]["Row"];
