"use client"

import { users } from "@/lib/mock-data"
import { Search } from "lucide-react"

interface UserListProps {
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  collapsed?: boolean
}

export function UserList({ selectedUserId, onSelectUser, collapsed }: UserListProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!collapsed && (
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-9 pr-3 py-1 text-sm bg-[#111111] border border-sidebar-border text-sidebar-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
            />
          </div>
        </div>
      )}

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className={`w-full px-4 py-3 text-left border-b border-sidebar-border transition-colors ${
              selectedUserId === user.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "hover:bg-sidebar-accent text-sidebar-foreground"
            }`}
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-white from-primary to-accent flex items-center justify-center text-sidebar-foreground font-semibold text-sm">
                {user.avatar}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                  <p className="text-xs opacity-70 truncate">{user.lastMessage}</p>
                </div>
              )}
              <div
                className={`w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-muted-foreground"}`}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
