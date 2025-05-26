// client/src/pages/ChatRoom.jsx

import React, { useEffect, useState } from 'react';
import { useParams }               from 'react-router-dom';
import Navbar                      from '../components/NavBar';
import { useAuth }                 from '../context/AuthContext';

// import the db and the RTDB helpers directly
import { db }                      from '../firebase';
import { ref, onChildAdded, push } from 'firebase/database';

export default function ChatRoom() {
  const { projectId } = useParams();
  const { user }      = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg]     = useState('');

  useEffect(() => {
    const chatRef = ref(db, `chats/${projectId}`);
    const unsub = onChildAdded(chatRef, snap => {
      setMessages(prev => [...prev, snap.val()]);
    });

    // optional: return an unsubscribe if you switch rooms
    return () => unsub && unsub();
  }, [projectId]);

  const send = async () => {
    if (!newMsg) return;
    const chatRef = ref(db, `chats/${projectId}`);
    await push(chatRef, {
      userId:    user.id,
      text:      newMsg,
      timestamp: Date.now(),
    });
    setNewMsg('');
  };

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl mb-4">Project Chat</h1>
        <div className="h-80 overflow-auto border p-4 mb-4 space-y-2">
          {messages.map((m, i) => (
            <div key={i} className="p-2 bg-gray-100 rounded">
              <strong>{m.userId}:</strong> {m.text}
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Type a message"
            className="border p-2 flex-grow"
          />
          <button
            onClick={send}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
