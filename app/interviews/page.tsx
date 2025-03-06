"use client";
import axios from "axios";
import React from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { encodePassphrase, generateRoomId, randomString } from '@/lib/client-utils';


export default function InterviewsPage() {

  const router = useRouter();

  const handleCardClick = async (title: string, description: string, duration: string, difficulty: string) => {
    
    const requestData = {
      user_id: "1", // Replace with actual user ID logic
      interview_title: title,
      description,
      duration,
      difficulty
    };
  
    try {
      // Send POST request to FastAPI
      const response = await axios.post("http://localhost:8000/calls/interviews", requestData);
  
      if (response.status === 200 || response.status === 201) {
        console.log("Interview request saved successfully:", response.data);
  
        // Redirect to the generated room
        router.push(`/rooms/${generateRoomId()}`);
      }
    } catch (error) {
      console.error("Error saving interview request:", error);
    }
    



  };

  const interviewCategories = [
    "Software",
    "Data science",
    "Finance",
    "Product",
    "Business",
    "Consulting",
    "Writing",
    "Design",
    "Legal",
    "Media",
    "Engineering",
    "Statistics",
    "Marketing",
    "Biology",
    "Security",
    "Blockchain",
  ];

  const interviewCards = [
    {
      title: "McKinsey Case Interview",
      description: "Help McKinsey analyze the launch of a new sports beverage",
      duration: "20m",
      difficulty: "Medium",
    },
    {
      title: "Stacks vs Queues",
      description: "Learn the FIFO and LIFO flows",
      duration: "5m",
      difficulty: "Medium",
    },
    {
      title: "Working Capital Case",
      description: "Explain the dynamics of working capital",
      duration: "5m",
      difficulty: "Medium",
    },
    {
      title: "Jane Street: Handshakes",
      description: "Calculate the number of handshakes",
      duration: "10m",
      difficulty: "Medium",
    },
    {
      title: "Hash Tables",
      description: "Master the magic of key-to-index storage",
      duration: "5m",
      difficulty: "Medium",
    },
    {
      title: "REST API 101",
      description: "Web APIs using HTTP methods",
      duration: "5m",
      difficulty: "Easy",
    },
    {
      title: "Distributed Ledger Case",
      description: "Design a DLT application",
      duration: "30m",
      difficulty: "Difficult",
    },
    {
      title: "Penetration Testing",
      description: "Explain your penetration testing approach",
      duration: "30m",
      difficulty: "Difficult",
    },

    {
      title: "Chemical control and coordination",
      description: "Interview about endocrine gland , harmons secreted by them, harmon action , receptor , intercellular , intracellular",
      duration: "30m",
      difficulty: "Difficult",
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
     <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <h3 style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#ffff" }}>
            Your perfect interview starts here
        </h3>
        <p style={{ fontSize: "1.2rem", color: "#ffff", maxWidth: "600px", margin: "0 auto" }}>
            Choose from <strong>100+ expert-vetted interviews</strong>, get personalized feedback on your performance, 
            and take the next step towards landing your dream job.
        </p>
    </div>

      {/* Categories Section */}
      <div style={{ margin: "2rem 0" }}>
        <h3>Categories</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {interviewCategories.map((category, index) => (
            <div
              key={index}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#1b1a1a",
                borderRadius: "8px",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* Interview Cards */}
      <h3>Popular Interviews</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" , maxHeight: "600px",   overflowY: "auto", padding: "1rem",}}>
        {interviewCards.map((card, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h4>{card.title}</h4>
            <p>{card.description}</p>
            <p>
              <strong>{card.duration}</strong> - {card.difficulty}
            </p>
            <button
              style={{
                backgroundColor: "#1b1a1a",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}

              onClick={() => handleCardClick(card.title, card.description, card.duration, card.difficulty)}
            >
              Start Interview
            </button>
            
          </div>
        ))}
      </div>
    </div>
  );
}
