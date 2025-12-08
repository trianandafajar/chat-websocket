"use client"

import { useState } from "react"
import { UserList } from "./user-list"
import { ChatWindow } from "./chat-window"
import { Send, LogOut, Menu, X, ChevronLeft } from "lucide-react"
import { Button } from "./ui/button"

export function ChatApp() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>("user-2")
  const [messages, setMessages] = useState<
    Record<string, Array<{ id: string; text: string; sender: "me" | "other"; timestamp: string }>>
  >({
    "user-1": [
      { id: "1", text: "Hey! How are you?", sender: "other", timestamp: "10:30 AM" },
      { id: "2", text: "I'm doing great!", sender: "me", timestamp: "10:31 AM" },
      { id: "3", text: "That's awesome!", sender: "other", timestamp: "10:32 AM" },
    ],
    "user-2": [
      { id: "1", text: "Hi there!", sender: "other", timestamp: "09:15 AM" },
      { id: "2", text: "Hello! What's up?", sender: "me", timestamp: "09:16 AM" },
    ],
    "user-3": [
      { id: "1", text: "Project looks good", sender: "other", timestamp: "08:45 AM" },
      { id: "2", text: "Thanks! I'll make those changes", sender: "me", timestamp: "08:46 AM" },
      { id: "3", text: "Perfect!", sender: "other", timestamp: "08:47 AM" },
    ],
  })
  const [inputValue, setInputValue] = useState("")
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedUserId) return

    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "me" as const,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage],
    }))
    setInputValue("")
  }
  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-sidebar-border text-foreground hover:bg-sidebar-accent transition-colors"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        title={showMobileMenu ? "Close menu" : "Open menu"}
      >
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>

      {showMobileMenu && (
        <div className="fixed inset-0 bg-black/50 md:hidden z-30" onClick={() => setShowMobileMenu(false)} />
      )}

      <div
        className={`fixed md:relative w-64 md:w-80 h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40 ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${sidebarCollapsed ? "md:w-20" : "md:w-80"}`}
      >
        <div className="flex flex-col h-full">
          <UserList
            selectedUserId={selectedUserId}
            onSelectUser={(userId) => {
              setSelectedUserId(userId)
              setShowMobileMenu(false)
            }}
            collapsed={sidebarCollapsed}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedUserId ? (
          <>
            <ChatWindow userId={selectedUserId} messages={messages[selectedUserId] || []} />

            <div className="p-4 border-t border-sidebar-border bg-card">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-[#111111] border text-sm border-sidebar-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-1 text-sm bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-colors flex items-center gap-2 font-medium"
                >
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}
