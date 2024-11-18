import { createClient } from "@/lib/supabase/server";
import { openai } from "@ai-sdk/openai";
import {
  SupabaseFilterRPCCall,
  SupabaseVectorStore,
} from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Message, streamText } from "ai";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are a helpful AI assistant that helps users find information in their documents. 
Format your responses using markdown for better readability:

- Use **bold** for emphasis and important terms
- Use \`code blocks\` for technical terms, commands, or code snippets
- Use bullet points or numbered lists for multiple items
- Use tables when comparing or listing structured data
- Use ### for section headers
- Use > for important quotes or callouts
- Include syntax highlighting for code blocks using \`\`\`language\n code \`\`\`

Keep responses concise and well-structured. If you don't know the answer, say so - don't make up information.
Always ensure your markdown formatting is correct and enhances readability.`;

export async function POST(req: Request) {
  const json = await req.json();
  const { messages, file_name, document_id, user_id } = json;

  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Generate vector embeddings of the latest message
    const lastMessage = messages[messages.length - 1] as Message;
    const embeddings = new OpenAIEmbeddings({
      model: "text-embedding-ada-002",
    });
    const store = new SupabaseVectorStore(embeddings, {
      client: supabase,
      tableName: "document_chunks",
      queryName: "match_documents",
    });
    const queryFilter: SupabaseFilterRPCCall = (rpc) =>
      rpc.textSearch("metadata->>file_name", file_name, {
        config: "english",
        type: "phrase",
      });

    const queryResult = await store.similaritySearch(
      lastMessage.content,
      5,
      queryFilter
    );

    const context = queryResult
      .map((r) => r.pageContent)
      .join("\n")
      .substring(0, 3000);

    // Save the user's message to the chat_messages table
    await supabase.from("chat_messages").insert({
      user_id: session.user.id,
      content: lastMessage.content,
      role: "user",
      file_name: file_name,
    });

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      system: SYSTEM_PROMPT,
      messages: [
        { role: "system", content: `Context from documents:\n${context}` },
        ...messages,
      ],
      onFinish: async (completion) => {
        // Save the AI's response to the chat_messages table
        await supabase.from("chats").insert({
          content: completion.text,
          document_id,
          file_name,
          role: "assistant",
          user_id,
        });
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response("Error processing your request", { status: 500 });
  }
}
