"use client"

import { useState, useMemo } from "react"
import { users } from "@/lib/mock-data"
import { Search } from "lucide-react"

interface UserListProps {
  selectedUserId: string | null
  onSelectUser: (userId: string) => void
  collapsed?: boolean
}

export function UserList({ selectedUserId, onSelectUser, collapsed }: UserListProps) {
  const [search, setSearch] = useState("")

  // Filter users
  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return users

    return users.filter((u) =>
      u.name.toLowerCase().includes(query) ||
      u.lastMessage.toLowerCase().includes(query)
    )
  }, [search])

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-sidebar">
      
      {/* Search */}
      {!collapsed && (
        <div className="p-3 border-b border-sidebar-border bg-sidebar/60 backdrop-blur-sm">
          <div className="relative">
            <Search className="absolute max-sm:left-17 left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="max-sm:ml-14 w-full max-sm:w-[170px] pl-9 pr-3 py-2 max-sm:pt-2 max-sm:pb-2.5 text-sm bg-input border border-sidebar-border 
              text-foreground placeholder-muted-foreground rounded-md
              focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>
      )}

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">No contacts found</div>
        ) : (
          filteredUsers.map((user) => {
            const active = selectedUserId === user.id

            return (
              <button
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={`
                  w-full px-3 md:px-4 py-3 text-left flex items-center gap-3 border-b border-sidebar-border 
                  transition-all cursor-pointer
                  ${active 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                  }
                `}
              >
                {/* Avatar */}
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm
                    ${active ? "bg-primary-foreground/20" : "bg-card border border-border"}
                  `}
                >
                  {user.avatar}
                </div>

                {/* Detail */}
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                    <p
                      className={`text-xs truncate ${
                        active ? "text-primary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {user.lastMessage}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    user.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                />
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}