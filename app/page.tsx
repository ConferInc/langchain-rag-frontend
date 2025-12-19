"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import ChatWindow from "@/components/ChatWindow"
import "@/styles/app.css"
import axios from "axios"

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm ChatGPT Clone. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState([{ id: 1, title: "Getting Started" }])

  const handleSendMessage = async (message) => {
    // Add user message
    const userMessage = { role: "user", content: message }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/chat",
        { question: message },
        {
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: false
        }
      )

      const assistantMessage = {
        role: "assistant",
        content: response.data.answer,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = { role: "assistant", content: "Sorry, there was an error. Please try again." }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm ChatGPT Clone. How can I help you today?",
      },
    ])
  }

  return (
    <div className="app-container">
      <Sidebar conversations={conversations} onNewChat={handleNewChat} />
      <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
    </div>
  )
}
