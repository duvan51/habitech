import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { supabase } from '../api/supabaseClient';
import { createNotification } from '../api/notifications';
import { useSearchParams, Link } from 'react-router-dom';

export default function MessagesPage() {
    const { user, profile } = useAuth();
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const chatIdParam = searchParams.get('chatId');
    const scrollRef = useRef();

    useEffect(() => {
        if (user) {
            fetchChats();
        }
    }, [user]);

    useEffect(() => {
        if (chats.length > 0 && chatIdParam) {
            const chatToSelect = chats.find(c => c.id === chatIdParam);
            if (chatToSelect && activeChat?.id !== chatIdParam) {
                setActiveChat(chatToSelect);
            }
        }
    }, [chatIdParam, chats]);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id);
            // Suscribirse a nuevos mensajes en este chat
            const subscription = supabase
                .channel(`public:messages:chat_id=eq.${activeChat.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${activeChat.id}` }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            }
        }
    }, [activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchChats = async () => {
        setLoading(true);
        // Chats where user is buyer or seller
        const { data } = await supabase
            .from('chats')
            .select(`
                *,
                listings(id, title, images, price, area, location),
                buyer:buyer_id(id, full_name, avatar_url),
                seller:seller_id(id, full_name, avatar_url)
            `)
            .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
            .order('updated_at', { ascending: false });

        const fetchedChats = data || [];
        setChats(fetchedChats);

        // Auto-select if chatIdParam exists
        if (chatIdParam) {
            const chatToSelect = fetchedChats.find(c => c.id === chatIdParam);
            if (chatToSelect) setActiveChat(chatToSelect);
        }

        setLoading(false);
    };

    const fetchMessages = async (chatId) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        setMessages(data || []);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        const content = newMessage.trim();
        setNewMessage("");

        const { data, error } = await supabase
            .from('messages')
            .insert([{
                chat_id: activeChat.id,
                sender_id: user.id,
                content
            }])
            .select()
            .single();

        if (error) {
            console.error("Error sending message:", error);
            return;
        }

        // Send notification to the other person
        const recipientId = activeChat.buyer_id === user.id ? activeChat.seller_id : activeChat.buyer_id;
        await createNotification(
            recipientId,
            'message',
            `${profile?.full_name || 'Alguien'} te envió un mensaje: "${content.substring(0, 30)}..."`,
            activeChat.listing_id,
            activeChat.id // Reference the CHAT ID for proper navigation
        );

        // Update chat's updated_at
        await supabase
            .from('chats')
            .update({ updated_at: new Date() })
            .eq('id', activeChat.id);
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 uppercase tracking-widest">Iniciando encriptación...</div>;

    return (
        <div className="bg-gray-50 min-h-screen pt-4 md:pt-12">
            <div className="max-w-7xl mx-auto h-[90vh] md:h-[85vh] flex gap-0 md:gap-6 px-0 md:px-4">
                {/* LISTA DE CHATS */}
                <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-white md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex-col`}>
                    <div className="p-6 md:p-8 border-b border-gray-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight mb-1 md:mb-2 uppercase">Conversaciones</h2>
                        <p className="text-[9px] md:text-[10px] font-black opacity-40 uppercase tracking-widest text-emerald-400">Canal Seguro Habitech</p>
                    </div>
                    <div className="flex-1 overflow-y-auto scrollbar-none p-3 md:p-4 space-y-2 md:space-y-3">
                        {chats.length === 0 ? (
                            <div className="p-10 text-center opacity-30 italic font-medium text-sm">No tienes chats activos</div>
                        ) : (
                            chats.map(chat => {
                                const otherUser = chat.buyer_id === user.id ? chat.seller : chat.buyer;
                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => setActiveChat(chat)}
                                        className={`p-4 md:p-5 rounded-2xl md:rounded-3xl cursor-pointer transition-all flex items-center gap-3 md:gap-4 border ${activeChat?.id === chat.id ? 'bg-orange-50/50 border-orange-200' : 'bg-white border-transparent hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-orange-600 shadow-inner flex-none">
                                            {otherUser?.full_name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-gray-900 text-xs md:text-sm truncate uppercase tracking-tight">{otherUser?.full_name || 'Inversionista'}</p>
                                            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold truncate mt-1">{chat.listings?.title}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* VENTANA DE CHAT */}
                <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 bg-white md:rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col relative`}>
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-gray-50 bg-white flex flex-col md:flex-row md:items-center justify-between shadow-sm z-10 gap-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        className="md:hidden p-2 text-gray-400 hover:text-orange-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black shadow-xl shadow-orange-100 flex-none">
                                        {(activeChat.buyer_id === user.id ? activeChat.seller?.full_name : activeChat.buyer?.full_name)?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-sm md:text-base tracking-tight uppercase truncate max-w-[150px] md:max-w-none">
                                            {activeChat.buyer_id === user.id ? activeChat.seller?.full_name : activeChat.buyer?.full_name}
                                        </h3>
                                        <span className="text-[8px] md:text-[10px] text-emerald-500 font-extrabold flex items-center gap-1 uppercase">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Canal de Negociación Seguro
                                        </span>
                                    </div>
                                </div>

                                {activeChat.listings && (
                                    <Link
                                        to={`/terrenoVentas/${activeChat.listings.id}`}
                                        className="flex items-center gap-2 md:gap-3 bg-gray-50 p-1.5 md:p-2 pr-3 md:pr-4 rounded-xl md:rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all group"
                                    >
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl overflow-hidden shadow-sm flex-none">
                                            <img
                                                src={activeChat.listings.images?.[0] || 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&q=80'}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                alt="Propiedad"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest leading-none mb-1">PROPIEDAD</p>
                                            <p className="text-[10px] font-bold text-gray-900 truncate max-w-[120px] md:max-w-[150px]">{activeChat.listings.title}</p>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                                ${activeChat.listings.price?.toLocaleString()}
                                            </p>
                                        </div>
                                    </Link>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-4 md:space-y-6 scrollbar-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[85%] md:max-w-[70%] p-4 md:p-5 rounded-2xl md:rounded-[2rem] shadow-sm transform transition-all ${msg.sender_id === user.id ? 'bg-gray-900 text-white rounded-br-none' : 'bg-gray-50 text-gray-800 rounded-bl-none'}`}>
                                            <p className="text-xs md:text-sm font-medium leading-relaxed">{msg.content}</p>
                                            <p className={`text-[8px] md:text-[9px] mt-2 font-black uppercase opacity-40 ${msg.sender_id === user.id ? 'text-white/60' : 'text-gray-400'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            <form onSubmit={sendMessage} className="p-4 md:p-8 bg-gray-50 border-t border-gray-100 flex gap-2 md:gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="flex-1 px-5 md:px-8 py-3 md:py-5 border-none bg-white rounded-xl md:rounded-[2rem] text-xs md:text-sm font-bold shadow-inner focus:ring-4 focus:ring-orange-500/10 placeholder-gray-300"
                                />
                                <button
                                    type="submit"
                                    className="px-6 md:px-10 bg-orange-600 text-white rounded-xl md:rounded-[2rem] font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95"
                                >
                                    Enviar
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center text-gray-300">
                            <svg className="w-16 md:w-24 h-16 md:h-24 mb-6 opacity-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            <p className="font-black uppercase tracking-widest text-[10px] md:text-xs italic px-10">Selecciona una conversación para iniciar el canal seguro</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
