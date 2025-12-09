"use client"

import { users } from "@/lib/mock-data"
import { LogOutIcon } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "me" | "other"
  timestamp: string
}

interface ChatWindowProps {
  userId: string
  messages: Message[]
}

 const handleLogout = () => {
    window.location.reload()
  }

export function ChatWindow({ userId, messages }: ChatWindowProps) {
  const user = users.find((u) => u.id === userId)

  if (!user) return null

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 md:px-6 pt-2 pb-2.5 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-white from-primary to-accent flex items-center justify-center text-foreground font-semibold">
            {user.avatar}
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm text-foreground truncate">{user.name}</h2>
            <p className="text-xs text-muted-foreground">{user.status === "online" ? "Active now" : "Offline"}</p>
          </div>
        </div>
        <LogOutIcon
          onClick={handleLogout}
          className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          size={18}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-[#111111]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "me"
                    ? "bg-cyan-600 text-primary-foreground rounded-br-none"
                    : "bg-cyan-800 border border-border text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70 text-primary-foreground`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
