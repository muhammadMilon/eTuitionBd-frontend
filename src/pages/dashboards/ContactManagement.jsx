import { Calendar, CheckCircle, ExternalLink, Eye, Mail, MessageSquare, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axiosInstance';
import LoadingOverlay from '../../components/LoadingOverlay';

const ContactManagement = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/contact?status=${statusFilter}`);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/api/contact/${id}/status`, { status });
      toast.success(`Message marked as ${status}`);
      fetchMessages();
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/api/contact/${id}`);
      toast.success('Message deleted');
      fetchMessages();
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: 'badge-primary',
      read: 'badge-ghost',
      replied: 'badge-success',
      archived: 'badge-neutral',
    };
    return <span className={`badge ${badges[status] || 'badge-ghost'} uppercase text-[10px] font-bold`}>{status}</span>;
  };

  if (loading && messages.length === 0) return <LoadingOverlay />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Mail className="text-primary" size={40} />
            Contact Messages
          </h1>
          <p className="text-base-content/60 mt-1 text-sm uppercase tracking-widest font-bold">Public Inquiries & Feedback</p>
        </div>

        <select 
          className="select select-bordered bg-base-200"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Messages</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-5 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="card bg-base-200 p-12 text-center">
              <MessageSquare className="mx-auto mb-4 opacity-10" size={64} />
              <p className="font-bold opacity-40 italic">No messages found for this filter.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg._id}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'new') handleUpdateStatus(msg._id, 'read');
                }}
                className={`card bg-base-200 hover:bg-base-300 transition-all cursor-pointer border-l-4 ${
                  selectedMessage?._id === msg._id ? 'border-primary bg-primary/5' : 
                  msg.status === 'new' ? 'border-success' : 'border-transparent'
                }`}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate text-white">{msg.name}</p>
                      <p className="text-xs opacity-50 truncate">{msg.email}</p>
                    </div>
                    {getStatusBadge(msg.status)}
                  </div>
                  <h3 className="text-sm font-semibold mt-2 line-clamp-1 italic text-primary">"{msg.subject}"</h3>
                  <div className="flex justify-between items-center mt-3 text-[10px] opacity-40 font-bold">
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Details */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="card bg-base-200 h-full border border-white/5 overflow-hidden">
               <div className="p-8 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-2xl">
                          {selectedMessage.name.charAt(0)}
                       </div>
                       <div>
                          <h2 className="text-2xl font-black text-white italic">{selectedMessage.name}</h2>
                          <a href={`mailto:${selectedMessage.email}`} className="text-sm text-primary flex items-center gap-1 hover:underline">
                            <Mail size={14} /> {selectedMessage.email}
                          </a>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => handleDelete(selectedMessage._id)}
                        className="btn btn-error btn-circle btn-sm btn-ghost"
                        title="Delete Message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <Calendar size={12} /> Message Context
                     </div>
                     <div className="p-4 rounded-xl bg-base-300 grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[10px] opacity-40 uppercase font-black">Subject</p>
                           <p className="font-bold text-white italic">{selectedMessage.subject}</p>
                        </div>
                        <div>
                           <p className="text-[10px] opacity-40 uppercase font-black">Received</p>
                           <p className="font-bold text-white">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 flex-1">
                     <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                        <MessageSquare size={12} /> Message Content
                     </div>
                     <div className="p-6 rounded-2xl bg-base-100 border border-white/5 min-h-[150px] leading-relaxed italic text-slate-300">
                        {selectedMessage.message}
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                     <div className="flex gap-2">
                        {selectedMessage.status !== 'replied' && (
                          <button 
                            onClick={() => handleUpdateStatus(selectedMessage._id, 'replied')}
                            className="btn btn-success btn-sm rounded-lg"
                          >
                            <CheckCircle size={16} /> Mark as Replied
                          </button>
                        )}
                        {selectedMessage.status !== 'archived' && (
                          <button 
                            onClick={() => handleUpdateStatus(selectedMessage._id, 'archived')}
                            className="btn btn-neutral btn-sm rounded-lg"
                          >
                            Archive
                          </button>
                        )}
                     </div>
                     <a 
                      href={`mailto:${selectedMessage.email}?subject=RE: ${selectedMessage.subject}`} 
                      className="btn btn-primary btn-sm rounded-lg gap-2"
                    >
                      Reply Now <ExternalLink size={14} />
                    </a>
                  </div>
               </div>
            </div>
          ) : (
            <div className="card bg-base-200 h-full border border-dashed border-white/10 flex items-center justify-center p-12 text-center opacity-40">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mx-auto">
                    <Eye size={40} />
                </div>
                <div>
                   <h3 className="text-xl font-bold">No Message Selected</h3>
                   <p className="text-sm italic">Click on a message from the list to view its contents.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManagement;
