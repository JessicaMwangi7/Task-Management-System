import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios";
import { toast } from "react-toastify";

const Chat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [loading, setLoading] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = currentUser?.id;

    if (!currentUserId) {
        toast.error("User not found. Please log in.");
        navigate("/login");
        return null;
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat);
        }
    }, [activeChat]);

    const fetchUsers = async () => {
        try {
            const res = await API.get("/user/all");
            setUsers(res.data);
        } catch (error) {
            toast.error("Failed to load users.");
        }
    };

    const fetchMessages = async (recipientId) => {
        setLoading(true);
        try {
            const res = await API.get(`/chat/${recipientId}`);
            setMessages(res.data.map(msg => ({
                ...msg,
                isCurrentUser: msg.sender_id === currentUserId,
                sender: msg.sender_id === currentUserId ? 'You' :
                    users.find(u => u.id === msg.sender_id)?.first_name || 'Unknown'
            })));
        } catch (error) {
            toast.error("Failed to load messages.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            // Optimistically add the message to UI
            const tempId = Date.now(); // Temporary ID for optimistic update
            const newMsg = {
                id: tempId,
                sender_id: currentUserId,
                recipient_id: activeChat,
                content: newMessage,
                timestamp: new Date().toISOString(),
                isCurrentUser: true,
                sender: 'You'
            };

            setMessages(prev => [...prev, newMsg]);
            setNewMessage('');

            // Send to backend
            await API.post('/chat', {
                content: newMessage,
                recipient_id: activeChat
            });

            // Refetch messages to get the actual ID from backend
            fetchMessages(activeChat);
        } catch (error) {
            toast.error("Failed to send message.");
            // Remove the optimistic update if failed
            setMessages(prev => prev.filter(msg => msg.id !== tempId));
        }
    };

    const getActiveChatUser = () => {
        return users.find(user => user.id === activeChat);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex h-screen bg-gray-100">
                {/* Sidebar */}
                <div className="w-1/4 border-r border-gray-200 bg-white">
                    <div className="p-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-800">Messages</h1>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search conversations"
                                className="w-full p-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <svg
                                className="absolute left-3 top-3 h-4 w-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* User list */}
                    <div className="overflow-y-auto h-[calc(100vh-120px)]">
                        {users.map((user) => (
                            <div
                                key={user.id}
                                className={`flex items-center p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${activeChat === user.id ? 'bg-blue-100' : ''}`}
                                onClick={() => setActiveChat(user.id)}
                            >
                                <span className="inline-flex items-center justify-center size-11 rounded-full bg-gray-800 font-semibold text-white">
                                    {user?.first_name?.charAt(0).toUpperCase() + user?.last_name?.charAt(0).toUpperCase()}
                                </span>
                                <div className="ml-3 flex-1">
                                    <div className="flex justify-between items-center">
                                        <h5 className="font-medium text-gray-900">{user.first_name} {user.last_name}</h5>
                                    </div>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <span><small>{user.role}</small></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat header */}
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
                                <span className="inline-flex items-center justify-center size-11 rounded-full bg-gray-800 font-semibold text-white">
                                    {getActiveChatUser()?.first_name?.charAt(0).toUpperCase() + getActiveChatUser()?.last_name?.charAt(0).toUpperCase()}
                                </span>
                                <div className="ml-3">
                                    <h2 className="font-sm text-gray-900">
                                        {getActiveChatUser()?.first_name} {getActiveChatUser()?.last_name}
                                    </h2>
                                    <p className="text-xs text-gray-500">Online</p>
                                </div>
                                <div className="ml-auto flex space-x-2">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isCurrentUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
                                                >
                                                    {!message.isCurrentUser && (
                                                        <div className="font-medium text-sm mb-1">{message.sender}</div>
                                                    )}
                                                    <p>{message.content}</p>
                                                    <div className={`text-xs mt-1 ${message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Message input */}
                            <div className="p-4 border-t border-gray-200 bg-white">
                                <form onSubmit={handleSendMessage} className="flex items-center">
                                    <button type="button" className="p-2 rounded-full hover:bg-gray-100">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message"
                                        className="flex-1 mx-4 p-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center p-6">
                                <h3 className="text-lg font-medium text-gray-900">Select a chat</h3>
                                <p className="mt-1 text-sm text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;