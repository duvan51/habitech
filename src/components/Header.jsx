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
  const [showSettings, setShowSettings] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);

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
          <Link to="/" className="flex items-center gap-4 group">
            <div className="h-16 w-auto overflow-hidden">
               <img 
                 src="/logoHabitech.png" 
                 alt="Habitech Logo" 
                 className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
               />
            </div>
            <div className="hidden sm:flex flex-col border-l border-white/20 pl-3">
              <span className="text-white font-bold tracking-tight text-lg leading-tight uppercase">
                HABITECH
              </span>
              <span className="text-white text-[10px] opacity-70 uppercase tracking-widest font-medium">
                 Casas & Terrenos
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex gap-6 text-sm items-center">
            <Link to="/" className="text-white hover:text-orange-300 font-medium">Marketplace</Link>
            <Link to="/constructora" className="text-white hover:text-orange-300 font-medium">Constructora</Link>
            <Link to="/portafolio" className="text-white hover:text-orange-300 font-medium">Portafolio</Link>
            <Link to="/nosotros" className="text-white hover:text-orange-300 font-medium">Nosotros</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4 font-bold text-sm tracking-tight">
            {user && (
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
                  <div className="absolute right-0 mt-3 w-auto md:w-80 bg-white rounded-[2rem] md:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[999] animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Centro de Avisos</span>
                      {unreadCount > 0 && <span className="text-[8px] bg-orange-600 text-white px-2 py-1 rounded-full font-black animate-pulse shadow-lg shadow-orange-100 uppercase">Nuevas Alertas</span>}
                    </div>
                    <div className="max-h-[60vh] md:max-h-96 overflow-y-auto scrollbar-none">
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
            )}

            {/* Menu Bar / Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-white hover:bg-white/10 rounded-full transition-all active:scale-90"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[999] animate-in fade-in zoom-in duration-200">
                  <div className="p-4 space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Navegación</p>
                    <div className="space-y-1">
                      <Link 
                        to="/portafolio" 
                        onClick={() => setShowSettings(false)}
                        className="w-full flex items-center gap-2 p-2.5 hover:bg-orange-50 rounded-2xl transition-colors group text-gray-700 hover:text-orange-600"
                      >
                        <span className="text-xs font-bold">💼 Portafolio & Cotizador</span>
                      </Link>
                      {(profile?.role === 'superadmin' || user?.email === 'duvanaponteramirez@gmail.com') && (
                        <Link 
                          to="/dashboard/superadmin" 
                          onClick={() => setShowSettings(false)}
                          className="w-full flex items-center gap-2 p-2.5 bg-orange-50 hover:bg-orange-100 rounded-2xl transition-colors group text-orange-700 font-extrabold"
                        >
                          <span className="text-xs">🔑 Panel Superadmin</span>
                        </Link>
                      )}
                    </div>
                    <div className="h-px bg-gray-100 mx-2"></div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Configuración</p>
                    
                    <button 
                      onClick={() => {
                        setDarkMode(!darkMode);
                        document.documentElement.classList.toggle('dark');
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors group"
                    >
                      <span className="text-xs font-bold text-gray-700">{darkMode ? "Modo Claro" : "Modo Noche"}</span>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${darkMode ? 'bg-orange-600' : 'bg-gray-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'left-6' : 'left-1'}`}></div>
                      </div>
                    </button>

                    <div className="h-px bg-gray-100 mx-2"></div>

                    {user ? (
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-2xl transition-colors group"
                      >
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-xs font-black uppercase tracking-widest">Cerrar Sesión</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <Link to="/login" className="block w-full text-center p-3 text-xs font-black text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors uppercase tracking-widest">Entrar</Link>
                        <Link to="/register" className="block w-full text-center p-3 text-xs font-black text-white bg-orange-600 rounded-2xl shadow-lg shadow-orange-100 transition-transform active:scale-95 uppercase tracking-widest">Registrarse</Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-2 pb-safe-area-inset-bottom">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          {/* Marketplace */}
          <Link to="/" className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95 text-gray-400 hover:text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-tight">Ventas</span>
          </Link>

          {/* Constructora */}
          <Link to="/constructora" className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95 text-gray-400 hover:text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-tight">Obras</span>
          </Link>

          {/* Nosotros */}
          <Link to="/nosotros" className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95 text-gray-400 hover:text-orange-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-tight">Nosotros</span>
          </Link>

          {/* Mensajes (Sólo si está logueado) */}
          {user && (
            <Link to="/mensajes" className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95 text-gray-400 hover:text-orange-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-tight">Chats</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-1/4 h-2 w-2 bg-orange-600 rounded-full animate-pulse border border-white"></span>
              )}
            </Link>
          )}

          {/* Perfil / Login */}
          <Link 
            to={user ? (profile?.role === 'admin' || profile?.role === 'superadmin' ? "/admin" : "/dashboard") : "/login"} 
            className="flex flex-col items-center gap-1 flex-1 transition-all active:scale-95 text-gray-400 hover:text-orange-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-tight">{user ? "Cuenta" : "Perfil"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
