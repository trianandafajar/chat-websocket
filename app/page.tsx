"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { ChatApp } from "@/components/chat-app"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return isLoggedIn ? <ChatApp /> : <LoginPage onLogin={handleLogin} />
}
