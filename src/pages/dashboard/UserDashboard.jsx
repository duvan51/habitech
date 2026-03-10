import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';
import ListingModal from './ListingModal';

export default function UserDashboard() {
    const { user, profile, supabase } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);
    const [phone, setPhone] = useState(profile?.phone || '');
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        if (profile?.phone) setPhone(profile.phone);
    }, [profile]);

    useEffect(() => {
        if (user && profile?.seller_status === 'approved') {
            fetchMyListings();
        }
    }, [user, profile]);

    const sellerStatus = profile?.seller_status || 'none'; // 'none', 'pending', 'approved', 'rejected'

    const fetchMyListings = async () => {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error) {
            setMyListings(data);
        }
        setLoading(false);
    };

    const handleSaveProfile = async () => {
        setSavingProfile(true);
        const { error } = await supabase
            .from('profiles')
            .update({ phone })
            .eq('id', user.id);

        if (error) {
            alert('Error al guardar: ' + error.message);
        } else {
            alert('Perfil actualizado con éxito');
        }
        setSavingProfile(false);
    };

    const handleEdit = (listing) => {
        setSelectedListing(listing);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedListing(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id);

            if (error) {
                alert('Error al eliminar: ' + error.message);
            } else {
                fetchMyListings();
            }
        }
    };

    // Resumen de métricas
    const stats = {
        totalListings: myListings.length,
        totalViews: myListings.reduce((acc, curr) => acc + (curr.views || 0), 0),
        totalClicks: myListings.reduce((acc, curr) => acc + (curr.clicks || 0), 0),
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Bienvenido, {profile?.full_name || user?.email}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Gestiona tus lotes, casas y proyectos aquí.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                    {sellerStatus === 'approved' && (
                        <button
                            type="button"
                            onClick={handleCreate}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all font-black uppercase tracking-widest"
                        >
                            + Nueva Publicación
                        </button>
                    )}
                </div>
            </div>

            {/* NOTIFICACIÓN DE APROBACIÓN */}
            {sellerStatus === 'approved' && (
                <div className="mb-8 bg-emerald-50 border border-emerald-100 p-6 rounded-[2rem] flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 shrink-0">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <h4 className="text-emerald-900 font-black uppercase tracking-tighter text-lg">¡Cuenta de Vendedor Activada!</h4>
                        <p className="text-emerald-700 text-xs font-bold uppercase mt-1">Has sido aprobado como vendedor oficial de Habitech. Ya puedes empezar a publicar y vender tus propiedades.</p>
                    </div>
                </div>
            )}

            {/* SECCIÓN DE VERIFICACIÓN DE VENDEDOR */}
            {sellerStatus !== 'approved' && (
                <div className="mb-12 bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-100 rounded-full">
                                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Activar Perfil Profesional</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                                    Conviértete en <span className="text-orange-600">Vendedor Certificado</span>
                                </h3>
                                <p className="text-gray-500 font-medium text-lg leading-relaxed">
                                    Para garantizar la seguridad de nuestra comunidad, necesitamos verificar tu identidad. Una vez aprobado, podrás publicar tus propiedades y recibir leads ilimitados.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">🛡️</div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 uppercase">Seguridad Real</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Verificamos cada documento</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">⚡</div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 uppercase">Respuesta Rápida</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Activación en menos de 24h</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-[400px] bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                {sellerStatus === 'pending' ? (
                                    <div className="text-center py-10 space-y-6">
                                        <div className="w-20 h-20 bg-orange-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-orange-200 rotate-12">
                                            <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 uppercase tracking-widest text-lg">Solicitud en Proceso</h4>
                                            <p className="text-xs text-gray-500 font-bold uppercase mt-2">Estamos revisando tus documentos. Recibirás una notificación en las próximas 24 horas.</p>
                                        </div>
                                        <div className="h-[2px] w-full bg-gray-200 rounded-full"></div>
                                        <p className="text-[9px] font-black text-orange-600 uppercase tracking-tighter italic">Gracias por confiar en Habitech</p>
                                    </div>
                                ) : sellerStatus === 'rejected' ? (
                                    <div className="text-center py-6 space-y-4">
                                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </div>
                                        <h4 className="font-black text-red-900 uppercase">Solicitud Rechazada</h4>
                                        <p className="text-[10px] text-gray-500 font-medium">Hubo un problema con tus documentos. Por favor, intenta de nuevo con fotos más claras.</p>
                                        <button
                                            onClick={() => {
                                                supabase.from('profiles').update({ seller_status: 'none' }).eq('id', user.id).then(() => window.location.reload());
                                            }}
                                            className="w-full py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Reintentar Solicitud
                                        </button>
                                    </div>
                                ) : (
                                    <SellerApplicationForm user={user} supabase={supabase} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Métrica de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">Total Publicaciones</span>
                    <span className="text-3xl font-bold text-gray-900 mt-2">{stats.totalListings}</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">Vistas Totales</span>
                    <span className="text-3xl font-bold text-orange-600 mt-2">{stats.totalViews}</span>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">Clicks Totales</span>
                    <span className="text-3xl font-bold text-green-600 mt-2">{stats.totalClicks}</span>
                </div>
            </div>

            {/* Configuración de Perfil */}
            <div className="bg-white shadow-sm overflow-hidden sm:rounded-[2rem] mb-10 border border-orange-100 bg-gradient-to-tr from-white to-orange-50/30 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Avisos Inmediatos por WhatsApp</h3>
                        <p className="text-xs text-gray-500 font-bold uppercase mt-1">Recibe alertas en tiempo real cuando un cliente interesado te escriba</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-3">
                        <div className="relative flex-1 md:w-64">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+</span>
                            <input
                                type="text"
                                placeholder="Ej: 573138673363"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                className="w-full pl-8 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={savingProfile}
                            className="px-6 py-3 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {savingProfile ? 'Guardando...' : 'Activar Alertas'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-sm overflow-hidden sm:rounded-md mt-8 border border-gray-100">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Mis Publicaciones</h3>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-gray-400 italic">Cargando tus datos...</div>
                ) : myListings.length === 0 ? (
                    <div className="p-12 text-center bg-gray-50">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="mt-2 text-gray-500 font-medium">Aún no tienes publicaciones.</p>
                        <p className="text-gray-400 text-sm">Empieza agregando tu primer lote o proyecto.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {myListings.map((listing) => (
                            <li key={listing.id} className="hover:bg-gray-50 transition-colors">
                                <div className="px-4 py-4 flex items-center sm:px-6">
                                    <div className="min-w-0 flex-1 flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center text-sm">
                                                <p className="font-bold text-gray-900 truncate capitalize text-base">{listing.title}</p>
                                                <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <span className="capitalize">{listing.type}</span>
                                                <span className="mx-2">&bull;</span>
                                                <span>{listing.location}</span>
                                                <span className="mx-2">&bull;</span>
                                                <span className="font-medium text-gray-700">${listing.price?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-shrink-0 items-center space-x-8 mr-10">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 uppercase font-bold">Vistas</p>
                                                <p className="text-lg font-medium text-gray-900">{listing.views || 0}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 uppercase font-bold">Clicks</p>
                                                <p className="text-lg font-medium text-gray-900">{listing.clicks || 0}</p>
                                            </div>
                                        </div>
                                        <div className="ml-5 flex-shrink-0 flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(listing)}
                                                className="text-orange-600 hover:text-orange-900 text-sm font-medium"
                                            >
                                                Editar
                                            </button>
                                            <span className="text-gray-200">|</span>
                                            <button
                                                onClick={() => handleDelete(listing.id)}
                                                className="text-red-400 hover:text-red-700 text-sm font-medium"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ListingModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedListing(null);
                }}
                user={user}
                profile={profile}
                supabase={supabase}
                onSaved={fetchMyListings}
                listing={selectedListing}
            />
        </div>
    );
}

function SellerApplicationForm({ user, supabase }) {
    const [loading, setLoading] = useState(false);
    const [docs, setDocs] = useState({ front: '', back: '', secondary: '' });

    const handleUpload = (type) => {
        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        window.cloudinary.openUploadWidget({
            cloudName,
            uploadPreset,
            sources: ["local", "camera"],
            multiple: false,
            folder: "seller_verification",
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                setDocs(prev => ({ ...prev, [type]: result.info.secure_url }));
            }
        });
    };

    const handleSubmit = async () => {
        if (!docs.front || !docs.back || !docs.secondary) {
            alert("Por favor sube todos los documentos requeridos");
            return;
        }

        setLoading(true);
        const { error } = await supabase
            .from('profiles')
            .update({
                seller_status: 'pending',
                id_card_front: docs.front,
                id_card_back: docs.back,
                secondary_document: docs.secondary,
                seller_request_date: new Date().toISOString()
            })
            .eq('id', user.id);

        if (!error) {
            window.location.reload();
        } else {
            alert("Error al enviar solicitud: " + error.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-4">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center mb-6">Documentación Requerida</h4>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleUpload('front')}
                    className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all group ${docs.front ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-300'}`}
                >
                    {docs.front ? (
                        <div className="relative w-full h-full p-2">
                            <img src={docs.front} className="w-full h-full object-cover rounded-xl" />
                        </div>
                    ) : (
                        <>
                            <span className="text-xl">💳</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase group-hover:text-orange-600">Cédula Frente</span>
                        </>
                    )}
                </button>

                <button
                    onClick={() => handleUpload('back')}
                    className={`h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all group ${docs.back ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-300'}`}
                >
                    {docs.back ? (
                        <div className="relative w-full h-full p-2">
                            <img src={docs.back} className="w-full h-full object-cover rounded-xl" />
                        </div>
                    ) : (
                        <>
                            <span className="text-xl">🔄</span>
                            <span className="text-[8px] font-black text-gray-400 uppercase group-hover:text-orange-600">Cédula Respaldo</span>
                        </>
                    )}
                </button>
            </div>

            <button
                onClick={() => handleUpload('secondary')}
                className={`w-full h-16 rounded-2xl border-2 border-dashed flex items-center justify-center gap-4 transition-all group ${docs.secondary ? 'bg-orange-50 border-orange-200' : 'border-gray-200 hover:border-orange-300'}`}
            >
                {docs.secondary ? (
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✅</span>
                        <span className="text-[10px] font-black text-gray-700 uppercase">Documento Extra cargado</span>
                    </div>
                ) : (
                    <>
                        <span className="text-xl">📄</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-orange-600">Tarjeta Profesional o Certificado</span>
                    </>
                )}
            </button>

            <div className="pt-4">
                <button
                    onClick={handleSubmit}
                    disabled={loading || !docs.front || !docs.back || !docs.secondary}
                    className="w-full py-4 bg-orange-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? 'Enviando...' : 'Solicitar Activación'}
                </button>
            </div>
        </div>
    );
}

