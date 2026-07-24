import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageItemProps {
  message: {
    role: "user" | "assistant";
    content: string;
  };
  isStreaming?: boolean;
}

export function MessageItem({ message, isStreaming }: MessageItemProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-4 max-w-3xl w-full",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
          isUser
            ? "bg-secondary border-border"
            : "bg-primary/10 border-primary/20 text-primary",
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-foreground" />
        ) : (
          <Sparkles className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 space-y-1 min-w-0">
        <div
          className={cn(
            "text-xs font-semibold",
            isUser ? "text-right text-muted-foreground" : "text-primary",
          )}
        >
          {isUser ? "You" : "Semester Sync AI"}
        </div>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed break-words",
            isUser
              ? "bg-primary text-primary-foreground font-medium rounded-tr-none ml-auto w-fit max-w-[85%]"
              : "glass-card border-white/5 rounded-tl-none text-foreground w-fit max-w-[85%]",
          )}
        >
          {message.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mt-4 mb-2 text-inherit">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mt-4 mb-2 text-inherit">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-3 mb-2 text-inherit">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed whitespace-pre-wrap">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
                ),

                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 mb-3 space-y-1">
                    {children}
                  </ol>
                ),

                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),

                strong: ({ children }) => (
                  <strong className="font-semibold text-inherit">
                    {children}
                  </strong>
                ),

                em: ({ children }) => <em className="italic">{children}</em>,

                hr: () => <hr className="my-4 border-border" />,

                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-3">
                    {children}
                  </blockquote>
                ),

                code(props) {
                  const { children, className } = props;

                  const inline = !className;

                  if (inline) {
                    return (
                      <code className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-xs">
                        {children}
                      </code>
                    );
                  }

                  return (
                    <pre className="overflow-x-auto rounded-lg bg-black/20 p-4 my-3 font-mono text-xs">
                      <code className={className}>{children}</code>
                    </pre>
                  );
                },

                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table className="min-w-full border border-border rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),

                thead: ({ children }) => (
                  <thead className="bg-secondary">{children}</thead>
                ),

                tbody: ({ children }) => <tbody>{children}</tbody>,

                tr: ({ children }) => (
                  <tr className="border-b border-border">{children}</tr>
                ),

                th: ({ children }) => (
                  <th className="px-3 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),

                td: ({ children }) => <td className="px-3 py-2">{children}</td>,

                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 hover:opacity-80"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : isStreaming ? (
            <div className="flex items-center gap-1 py-1 px-1">
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-primary/70 animate-bounce" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
