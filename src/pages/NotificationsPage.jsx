import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { supabase } from '../api/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        setNotifications(data || []);
        setLoading(false);
    };

    const markAllAsRead = async () => {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user.id);
        fetchNotifications();
    };

    if (loading) return <div className="p-20 text-center font-black text-gray-400 uppercase tracking-widest">Cargando historial...</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-6 md:py-12 px-0 md:px-4">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-10 px-6 md:px-0 gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight uppercase">Centro de Avisos</h1>
                        <p className="text-gray-400 font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] mt-1 md:mt-2">Mantente al tanto de tus inversiones</p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors self-start md:self-auto bg-orange-50 md:bg-transparent px-4 py-2 md:p-0 rounded-full md:rounded-none shadow-sm md:shadow-none"
                    >
                        Marcar todo como leído
                    </button>
                </div>

                <div className="space-y-3 md:space-y-4 px-4 md:px-0">
                    {notifications.length === 0 ? (
                        <div className="bg-white p-12 md:p-20 rounded-[2.5rem] md:rounded-[3.5rem] text-center border-2 border-dashed border-gray-100 shadow-sm">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <p className="text-gray-400 font-extrabold uppercase tracking-widest text-[10px] md:text-xs">Sin notificaciones recientes</p>
                        </div>
                    ) : (
                        notifications.map(n => (
                            <div
                                key={n.id}
                                onClick={() => {
                                    if (n.type === 'message' && n.reference_id) {
                                        navigate(`/mensajes?chatId=${n.reference_id}`);
                                    } else if (n.listing_id) {
                                        navigate(`/terrenoVentas/${n.listing_id}`);
                                    }
                                }}
                                className={`bg-white p-5 md:p-7 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-gray-100 flex items-start md:items-center gap-4 md:gap-8 transition-all hover:shadow-xl active:scale-[0.98] cursor-pointer ${!n.is_read ? 'ring-2 ring-orange-500/20 bg-orange-50/10' : ''}`}
                            >
                                <div className={`w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-[2rem] flex items-center justify-center flex-none shadow-inner ${n.type === 'comment' ? 'bg-orange-100 text-orange-600' : n.type === 'message' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                    {n.type === 'comment' ? (
                                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-tight truncate">{n.type === 'comment' ? 'Comentario Inicial' : n.type === 'message' ? 'Mensaje Directo' : 'Aviso Sistema'}</h4>
                                    <p className="text-gray-500 text-[11px] md:text-sm mt-1 font-medium leading-relaxed">{n.content}</p>
                                    <div className="flex items-center gap-2 mt-4">
                                        <span className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{new Date(n.created_at).toLocaleDateString()}</span>
                                        <span className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                                {!n.is_read && <div className="w-2.5 h-2.5 bg-orange-600 rounded-full shadow-lg shadow-orange-500/20 ring-4 ring-orange-500/5 mt-2 md:mt-0"></div>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
