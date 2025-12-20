"use client"

import { LogOutIcon } from "lucide-react"
import { useEffect, useRef } from "react"
import { signOut } from 'next-auth/react'

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
}

const handleLogout = () => {
  signOut({
    redirect: true,
    callbackUrl : "/"
  })
}

export function ChatWindow({
  sessionId,
  messages,
  sessions,
  currentUserId,
  typingUsers,
  users,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  const isGroup = session.isGroup

  const otherUser = !isGroup
    ? session.participants?.find((p) => p.id !== currentUserId)
    : null

  const title = isGroup
    ? session.title ?? "Group Chat"
    : otherUser?.name ?? "Unknown User"

  const avatar = isGroup
    ? "👥"
    : otherUser?.name?.[0]?.toUpperCase() ?? "?"

  const online = !isGroup && users.find((u) => u.id === otherUser?.id)?.isOnline

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const typingNames = typingUsers
    .map((userId) => session.participants?.find((p) => p.id === userId)?.name)
    .filter(Boolean);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 md:px-6 pt-3 pb-3.5 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <div className="max-sm:ml-14 flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
            {avatar}
          </div>

          <div className="min-w-0">
            <h2 className="font-semibold text-sm truncate">{title}</h2>
            {!isGroup && (
              <p className="text-xs text-muted-foreground">
                {online ? "Active now" : "Offline"}
              </p>
            )}
          </div>
        </div>

        <LogOutIcon
          onClick={handleLogout}
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          size={18}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            No messages yet
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === currentUserId

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar kiri (lawan) */}
                {!isMe && (
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs">
                    {avatar}
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    isMe
                      ? "bg-accent text-accent-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="mt-1 text-[10px] opacity-80 text-right">
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

        {/* Typing Indicator */}
        {typingNames.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs">
              {avatar}
            </div>
            <div className="flex items-center gap-1">
              <span>{typingNames.join(", ")} is typing</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Invisible element for scrolling */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
