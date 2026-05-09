"use client"

import { Hand, Users } from "lucide-react"
import { useEffect, useRef } from "react"
import { useMyProfile } from "./my-profile-context"
import { Avatar } from "./avatar"

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
}

interface Session {
  id: string
  title?: string | null
  isGroup?: boolean
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
}

export function ChatWindow({
  sessionId,
  messages,
  sessions,
  currentUserId,
  typingUsers,
  users,
  onShowProfile,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { profile: myProfile } = useMyProfile()

  const myName = myProfile?.name ?? ""
  const myImage = myProfile?.picture ?? ""

  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  const isGroup = session.isGroup

  const otherUser = !isGroup
    ? session.participants?.find((p) => p.id !== currentUserId)
    : null

  const title = isGroup
    ? session.title ?? "Group Chat"
    : otherUser?.name ?? "Unknown User"

  const online = !isGroup && users.find((u) => u.id === otherUser?.id)?.isOnline

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typingUsers])

  const typingNames = typingUsers
    .filter((userId) => userId !== currentUserId)
    .map((userId) => session.participants?.find((p) => p.id === userId)?.name)
    .filter(Boolean)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 md:px-6 py-4 border-b border-border bg-background flex items-center justify-between">
        <div className="max-sm:ml-14 flex items-center gap-3 min-w-0">
          {!isGroup && otherUser ? (
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
          ) : (
            <div className="min-w-0">
              <h2 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate">
                {title}
              </h2>
              <p className="font-mono text-[11px] text-muted-foreground">
                {isGroup ? "4 people online" : online ? "Active now" : "Offline"}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isGroup && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary">
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
          messages.map((message) => {
            const isMe = message.senderId === currentUserId

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  isGroup ? (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 border border-border">
                      <Users className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </div>
                  ) : otherUser ? (
                    <button
                      type="button"
                      onClick={() => onShowProfile(otherUser.id)}
                      className="rounded-full shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition"
                      title="View profile"
                      aria-label="View profile"
                    >
                      <Avatar
                        name={otherUser.name}
                        picture={otherUser.picture}
                        size={32}
                      />
                    </button>
                  ) : null
                )}

                <div className="max-w-[74%]">
                  <div
                    className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                      isMe
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                        : "bg-muted/60 text-foreground"
                    }`}
                  >
                    <p className="break-words">{message.text}</p>
                  </div>
                  <p
                    className={`mt-1 font-mono text-[11px] ${
                      isMe ? "text-right text-muted-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {isMe ? "you - " : ""}
                    {new Date(message.createdAt).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
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
