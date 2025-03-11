'use client';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: { roomId: string } }) {
  const { BACKEND_URI } = process.env;

  const [roomData, setRoomData] = useState<any>(null);
  const [logContent, setLogContent] = useState<string>('');
  const [feedbackData, setFeedbackData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRoomData() {
      try {
        const response = await fetch(`${BACKEND_URI}/calls/${params.roomId}`);
        const data = await response.json();
        setRoomData(data);

        console.log("call data", data)

        // Find the .log file and fetch its content
        const logFile = data.files.find((file: any) => file.file_name.endsWith('.log'));
        if (logFile) {
          const logResponse = await fetch(logFile.signed_url);
          const logText = await logResponse.text();
          setLogContent(logText);

          // Fetch the analysis for the log
          const analysisResponse = await fetch(`${BACKEND_URI}/calls/${params.roomId}/analyze-log`, {
            headers: { accept: 'application/json' },
          });
          const analysisData = await analysisResponse.json();
          console.log(analysisData)
          if (Array.isArray(analysisData.feedback_report)) {
            setFeedbackData(analysisData.feedback_report);
          } else {
            console.error('Unexpected feedback report format.');
          }
        }
        else{
          console.log('no log file found for the recorded room')
          setFeedbackData([]

          )
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    }

    fetchRoomData();
  }, [params.roomId]);

  if (!roomData) {
    return <p>Loading...</p>;
  }

  const videoFile = roomData.files.find((file: any) => file.file_name.endsWith('.mp4'));

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Video Section */}
      <div style={{ flex: 1, backgroundColor: '#111', padding: '1rem' }}>
        <h2>{roomData.room.name || 'Interview Video'}</h2>
        {videoFile ? (
          <video controls src={videoFile.signed_url} style={{ width: '100%', height: 'auto' }} />
        ) : (
          <p>No video file found for this room.</p>
        )}
      </div>

      {/* Log File and Feedback Section */}
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', borderLeft: '1px solid #ddd' }}>
        {/* <h2>Log File Content</h2>
        <pre style={{ backgroundColor: '#111', color: '#fff', padding: '1rem', borderRadius: '4px' }}>
          {logContent || 'No log file found or content is empty.'}
        </pre> */}
        <h2>Feedback Analysis</h2>
        {feedbackData.length > 0 ? (
          <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '4px' }}>
            {feedbackData.map((feedback, index) => (
              <div key={index} style={{ marginBottom: '1rem' }}>
                <h4>Question:</h4>
                <p>{feedback.question}</p>
                <h4>Response:</h4>
                <p>{feedback.answer}</p>
                <h4>Feedback:</h4>
                <p>{feedback.feedback}</p>
                
                <h4>Overall Feedback:</h4>
                <p>{feedback.overall_feedback}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading feedback data... or feedback data not found please check logs</p>
        )}
      </div>
    </div>
  );
}
