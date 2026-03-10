import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { signOut } from "../api/auth";
import { supabase } from "../api/supabaseClient";

export default function Header({ config }) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = React.useState([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      fetchNotifications();
      // Suscribirse a nuevas notificaciones en tiempo real
      const subscription = supabase
        .channel('public:notifications')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, () => {
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      }
    }
  }, [user]);

  const fetchNotifications = async () => {
    const { data, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    setNotifications(data || []);

    const unread = (data || []).filter(n => !n.is_read).length;
    setUnreadCount(unread);
  };

  const markAsRead = async (id) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    fetchNotifications();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header
      className="w-full border-b-4"
      style={{ borderColor: config.primary_action_color }}
    >
      <nav className="w-full" style={{ backgroundColor: config.surface_color }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="rounded p-2 flex items-center justify-center"
              style={{ backgroundColor: config.primary_action_color }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold tracking-wide text-xl leading-tight">
                HABITECH
              </span>
              <span className="text-white text-xs opacity-80">
                Marketplace & Constructora
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-6 text-sm items-center">
            <Link to="/" className="text-white hover:text-orange-300 font-medium">Marketplace</Link>
            <Link to="/constructora" className="text-white hover:text-orange-300 font-medium">Constructora</Link>
            <Link to="/nosotros" className="text-white hover:text-orange-300 font-medium">Nosotros</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-6">
                {/* Notificaciones Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-orange-600 border-2 border-[#1a1a1a] rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-xl animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avisos Relevantes</span>
                        {unreadCount > 0 && <span className="text-[8px] bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-black">NUEVAS</span>}
                      </div>
                      <div className="max-h-96 overflow-y-auto scrollbar-none">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <p className="text-gray-300 text-xs italic font-medium">Bandeja de entrada vacía</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.type === 'message' && n.reference_id) {
                                  navigate(`/mensajes?chatId=${n.reference_id}`);
                                } else if (n.listing_id) {
                                  navigate(`/terrenoVentas/${n.listing_id}`);
                                }
                                setShowNotifications(false);
                              }}
                              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors flex gap-3 ${!n.is_read ? 'bg-orange-50/30' : ''}`}
                            >
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-none ${!n.is_read ? 'bg-orange-600 shadow-lg shadow-orange-100' : 'bg-transparent'}`}></div>
                              <div>
                                <p className="text-[12px] font-black text-gray-900 leading-tight mb-1">{n.type === 'comment' ? 'Nuevo Comentario' : n.type === 'message' ? 'Nuevo Mensaje' : 'Actualización'}</p>
                                <p className="text-[11px] text-gray-500 font-medium line-clamp-2">{n.content}</p>
                                <p className="text-[9px] text-gray-300 mt-2 font-black uppercase">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <Link to="/notificaciones" className="block text-center p-3 text-[10px] font-black text-orange-600 uppercase tracking-widest bg-gray-50 hover:bg-orange-600 hover:text-white transition-all">
                        Ver Todo el Historial
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  to={profile?.role === 'admin' || profile?.role === 'superadmin' ? "/admin" : "/dashboard"}
                  className="text-white hover:text-orange-300 font-medium text-sm"
                >
                  {profile?.role === 'admin' || profile?.role === 'superadmin' ? "Panel Control" : "Mi Cuenta"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded text-sm font-bold border border-white text-white hover:bg-white hover:text-gray-900 transition-all"
                >
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-orange-300 font-medium text-sm">Entrar</Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded font-bold shadow-lg text-sm"
                  style={{
                    backgroundColor: config.primary_action_color,
                    color: "#ffffff",
                  }}
                >
                  Regístrate
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
