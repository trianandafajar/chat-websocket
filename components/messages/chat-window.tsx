"use client"

import { Hand, PanelRightClose, PanelRightOpen, Users } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useMyProfile } from "./my-profile-context"
import { Avatar } from "./avatar"
import { TranslateButton, type TranslateResult } from "./translate-button"

interface Message {
  id: string
  text: string
  senderId?: string | null
  createdAt: string
}

interface Participant {
  id: string
  name?: string | null
  picture?: string | null
  isOnline?: boolean
  isAI?: boolean
}

interface Session {
  id: string
  title?: string | null
  isGroup?: boolean
  isAi?: boolean
  participants?: Participant[]
}

interface ChatWindowProps {
  sessionId: string
  messages: Message[]
  sessions: Session[]
  currentUserId: string
  typingUsers: string[]
  users: Participant[]
  onShowProfile: (userId: string) => void
  onShowGroupInfo: () => void
  panelOpen?: boolean
  onTogglePanel?: () => void
}

export function ChatWindow({
  sessionId,
  messages,
  sessions,
  currentUserId,
  typingUsers,
  users,
  onShowProfile,
  onShowGroupInfo,
  panelOpen,
  onTogglePanel,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { profile: myProfile } = useMyProfile()
  const [translations, setTranslations] = useState<Record<string, TranslateResult | null>>({})

  const setTranslationFor = (messageId: string, result: TranslateResult | null) => {
    setTranslations((prev) => {
      if (!result) {
        const { [messageId]: _drop, ...rest } = prev
        return rest
      }
      return { ...prev, [messageId]: result }
    })
  }

  const myName = myProfile?.name ?? ""
  const myImage = myProfile?.picture ?? ""

  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  const isGroup = session.isGroup
  const isAiChat = session.isAi

  const otherUser = !isGroup
    ? session.participants?.find((p) => p.id !== currentUserId)
    : null

  const title = isGroup
    ? session.title ?? "Group Chat"
    : otherUser?.name ?? "Unknown User"

  const isUserOnline = (id?: string | null) => {
    if (!id) return false
    if (id === currentUserId) return true
    return !!users.find((u) => u.id === id)?.isOnline
  }

  const online = !isGroup && isUserOnline(otherUser?.id)
  const onlineMembersCount = isGroup
    ? session.participants?.filter((p) => isUserOnline(p.id)).length ?? 0
    : 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingUsers])

  const typingNames = typingUsers
    .filter((userId) => userId !== currentUserId)
    .map((userId) => session.participants?.find((p) => p.id === userId)?.name)
    .filter(Boolean)

  const renderMarkdown = (text: string, tone: "default" | "muted" = "default") => {
    return (
      <div className={`markdown-body text-sm leading-relaxed ${tone === "muted" ? "text-foreground/90 italic" : ""}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ children }) => <p className="whitespace-pre-wrap break-words mb-2 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="break-words">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children, className }) => (
              <code
                className={`font-mono text-[0.9em] ${
                  className?.includes("language-")
                    ? "block overflow-x-auto rounded-lg bg-black/10 p-3 whitespace-pre-wrap"
                    : "rounded bg-black/10 px-1.5 py-0.5"
                }`}
              >
                {children}
              </code>
            ),
            pre: ({ children }) => <pre className="mb-2 last:mb-0 overflow-x-auto">{children}</pre>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-primary/40 pl-3 italic text-foreground/90 mb-2 last:mb-0">
                {children}
              </blockquote>
            ),
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    )
  }

  const renderMessageText = (message: Message, isMe: boolean, sender?: Participant | null) => {
    if (!message.text.trim()) {
      return (
        <p className="wrap-break-word text-muted-foreground italic">
          {sender?.isAI || (session.isAi && !isMe) ? "Chattie AI is thinking..." : "Typing..."}
        </p>
      )
    }

    const isMarkdown = sender?.isAI || (session.isAi && !isMe)
    if (!isMarkdown) {
      return <p className="wrap-break-word whitespace-pre-wrap">{message.text}</p>
    }

    return renderMarkdown(message.text)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-border bg-background flex items-center justify-between gap-2">
        <div className="max-sm:ml-14 flex items-center gap-3 min-w-0 flex-1">
          {!isGroup && otherUser ? (
            isAiChat ? (
              <div className="min-w-0">
                <h2 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate">
                  {title}
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground mt-1">
                  Active now
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onShowProfile(otherUser.id)}
                className="group min-w-0 text-left cursor-pointer"
                title="View profile"
              >
                <h2 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                  {title}
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground mt-1">
                  {online ? "Active now" : "Offline"}
                </p>
              </button>
            )
          ) : isGroup ? (
            <button
              type="button"
              onClick={onShowGroupInfo}
              className="group min-w-0 text-left cursor-pointer"
              title="View group info"
            >
              <h2 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate group-hover:text-primary transition-colors">
                {title}
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground mt-1">
                {session.participants?.length ?? 0} members
                {onlineMembersCount > 0 ? ` · ${onlineMembersCount} online` : ""}
              </p>
            </button>
          ) : (
            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate">
                {title}
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground">
                {online ? "Active now" : "Offline"}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isGroup && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Active
            </span>
          )}
          <button
            type="button"
            onClick={() => onShowProfile(currentUserId)}
            className="cursor-pointer flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-muted transition"
            title="Your profile"
          >
            <Avatar name={myName} picture={myImage} size={36} />
            <span className="hidden sm:inline text-sm font-medium text-foreground max-w-[120px] truncate">
              {myName || "You"}
            </span>
          </button>
          {onTogglePanel && (
            <button
              type="button"
              onClick={onTogglePanel}
              aria-pressed={panelOpen}
              aria-label={panelOpen ? "Hide details panel" : "Show details panel"}
              title={panelOpen ? "Hide details panel" : "Show details panel"}
              className={`cursor-pointer p-2 rounded-md border transition ${
                panelOpen
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-transparent border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {panelOpen ? <PanelRightClose  className="w-4 h-4" strokeWidth={1.75} /> : <PanelRightOpen  className="w-4 h-4" strokeWidth={1.75} />} 
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-background [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Hand
                className="mx-auto mb-3 h-12 w-12 text-muted-foreground"
                strokeWidth={1.75}
              />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, idx) => {
            const isMe = message.senderId === currentUserId
            const sender = !isMe
              ? session.participants?.find((p) => p.id === message.senderId)
              : null
            const prev = idx > 0 ? messages[idx - 1] : null
            const sameSenderAsPrev =
              prev && prev.senderId === message.senderId && !isMe

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"} ${sameSenderAsPrev ? "mt-1" : ""}`}
              >
                {!isMe && (
                  sender ? (
                    sameSenderAsPrev ? (
                      <div className="w-8 shrink-0" aria-hidden="true" />
                    ) : sender.isAI ? (
                      <div className="rounded-full shrink-0">
                        <Avatar
                          name={sender.name}
                          picture={sender.picture}
                          size={32}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onShowProfile(sender.id)}
                        className="rounded-full shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition"
                        title={`View ${sender.name ?? "profile"}`}
                        aria-label="View profile"
                      >
                        <Avatar
                          name={sender.name}
                          picture={sender.picture}
                          size={32}
                        />
                      </button>
                    )
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 border border-border">
                      <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                  )
                )}

                <div className="max-w-[78%] sm:max-w-[74%] min-w-0">
                  {isGroup && !isMe && sender && !sameSenderAsPrev && (
                    <p className="text-[11px] font-semibold text-foreground/70 mb-0.5 ml-1">
                      {sender.name ?? "Unknown"}
                    </p>
                  )}
                  <div
                    className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed wrap-break-word overflow-hidden ${
                      isMe
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                        : "bg-muted/60 text-foreground"
                    }`}
                  >
                    {renderMessageText(message, isMe, sender)}
                    {translations[message.id] && (
                      <div
                        className={`mt-2 pt-2 border-t ${
                          isMe ? "border-primary/20" : "border-border/60"
                        }`}
                      >
                        <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-0.5">
                          {translations[message.id]?.detectedSource
                            ? `${translations[message.id]?.detectedSource?.toUpperCase()} → ${translations[message.id]?.targetCode.toUpperCase()}`
                            : translations[message.id]?.targetCode.toUpperCase()}
                        </p>
                        {renderMarkdown(translations[message.id]?.translatedText ?? "", "muted")}
                      </div>
                    )}
                  </div>
                  <div
                    className={`mt-1 flex items-center gap-2 ${
                      isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMe && message.text.trim() && (
                      <TranslateButton
                        text={message.text}
                        align="start"
                        cached={translations[message.id] ?? null}
                        onCache={(result) => setTranslationFor(message.id, result)}
                      />
                    )}
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {isMe ? "you · " : ""}
                      {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}

        {typingNames.length > 0 && (
          <div className="flex items-center gap-2 pt-2 font-mono text-[11px] text-muted-foreground">
            <span className="flex gap-1">
              <span className="typing-dot-fast" />
              <span className="typing-dot-fast" style={{ animationDelay: "80ms" }} />
              <span className="typing-dot-fast" style={{ animationDelay: "160ms" }} />
            </span>
            {typingNames.join(", ")} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

    </div>
  )
}
