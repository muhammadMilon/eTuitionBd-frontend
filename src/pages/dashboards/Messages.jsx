import { ArrowLeft, MessageSquare, Search, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation._id);
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => fetchMessages(activeConversation._id, true), 5000);
      return () => clearInterval(interval);
    }
  }, [activeConversation]);

  /* Automatic scrolling disabled as per user request
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/messages/user/all');
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId, isPolling = false) => {
    try {
      const { data } = await api.get(`/api/messages/${conversationId}`);
      if (!isPolling) setLoading(false);
      
      // Only update if messages changed
      if (JSON.stringify(data.messages) !== JSON.stringify(messages)) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!isPolling) toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation) return;

    try {
      setSending(true);
      const { data } = await api.post('/api/messages', {
        conversationId: activeConversation._id,
        content: newMessage
      });
      setMessages(prev => [...prev, data.message]);
      setNewMessage('');
      fetchConversations(); // Refresh last message
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = conv.participants.find(p => p._id !== currentUser._id);
    return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getOtherParticipant = (conv) => {
    return conv.participants.find(p => p._id !== currentUser._id);
  };

  if (loading && conversations.length === 0) return <LoadingOverlay />;

  return (
    <div className="w-full px-2 md:px-4 h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex items-center gap-3">
        <MessageSquare className="text-primary" size={32} />
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>

      <div className="flex-1 bg-base-200 rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl border border-base-300">
        {/* Conversations Sidebar */}
        <div className={`w-full md:w-80 border-r border-base-300 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-base-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="input input-bordered w-full pl-10 h-10 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map(conv => {
                const otherParticipant = getOtherParticipant(conv);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <button 
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-base-300 transition-colors border-b border-base-300/50 ${isActive ? 'bg-primary/10 border-r-4 border-r-primary' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-base-300 flex-shrink-0 overflow-hidden">
                      {otherParticipant?.photoUrl ? (
                        <img src={otherParticipant.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content font-bold">
                          {otherParticipant?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-bold truncate">{otherParticipant?.name}</p>
                        <span className="text-[10px] opacity-40">{conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                      </div>
                      <p className="text-sm opacity-60 truncate">
                        {conv.lastMessage?.content || 'Started a new conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center opacity-40">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className={`flex-1 flex flex-col bg-base-100 ${!activeConversation ? 'hidden md:flex items-center justify-center opacity-40' : 'flex'}`}>
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-base-300 flex items-center gap-4 bg-base-100">
                <button onClick={() => setActiveConversation(null)} className="md:hidden btn btn-ghost btn-circle btn-sm">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                   {getOtherParticipant(activeConversation)?.photoUrl ? (
                     <img src={getOtherParticipant(activeConversation).photoUrl} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-primary text-primary-content font-bold">
                       {getOtherParticipant(activeConversation)?.name?.charAt(0)}
                     </div>
                   )}
                </div>
                <div>
                  <h3 className="font-bold">{getOtherParticipant(activeConversation)?.name}</h3>
                  {activeConversation.tuitionId && (
                    <p className="text-[10px] opacity-50 uppercase tracking-widest">{activeConversation.tuitionId.subject} Tuition</p>
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/50">
                {messages.map((msg, idx) => {
                  const isMine = msg.sender === currentUser?._id;
                  return (
                    <div key={msg._id || idx} className={`chat ${isMine ? 'chat-end' : 'chat-start'}`}>
                      <div className={`chat-bubble ${isMine ? 'chat-bubble-primary' : 'bg-base-100 text-base-content border border-base-300 shadow-sm'}`}>
                        {msg.content}
                      </div>
                      <div className="chat-footer opacity-40 text-[10px] pt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 bg-base-100 border-t border-base-300">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    className="input input-bordered flex-1 rounded-2xl bg-base-200"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary btn-circle" disabled={sending || !newMessage.trim()}>
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center p-8">
              <MessageSquare size={64} className="mx-auto mb-4 opacity-10" />
              <p className="text-xl font-bold">Your Messages</p>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
