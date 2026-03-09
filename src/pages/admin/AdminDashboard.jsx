import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';

export default function AdminDashboard() {
    const { supabase, profile } = useAuth();
    const [users, setUsers] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'listings'

    const isSuperAdmin = profile?.role === 'superadmin';

    useEffect(() => {
        fetchData();
    }, [supabase]);

    const fetchData = async () => {
        setLoading(true);
        const { data: profiles, error: pError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        const { data: listings, error: lError } = await supabase
            .from('listings')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });

        if (!pError) setUsers(profiles);
        if (!lError) setAllListings(listings);
        setLoading(false);
    };

    const toggleVerification = async (userId, currentState) => {
        if (!isSuperAdmin) return;
        const { error } = await supabase
            .from('profiles')
            .update({ is_verified: !currentState })
            .eq('id', userId);

        if (!error) fetchData();
    };

    const toggleCertification = async (listingId, currentState) => {
        if (!isSuperAdmin) return;
        const { error } = await supabase
            .from('listings')
            .update({ is_certified: !currentState })
            .eq('id', listingId);

        if (!error) fetchData();
    };

    const changeRole = async (userId, newRole) => {
        if (!isSuperAdmin) return;
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (!error) fetchData();
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 uppercase tracking-widest font-black text-gray-400">
            Cargando centro de mando...
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* HEAD SECTION */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200">
                                {profile?.role}
                            </span>
                            <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Panel de Control Global</span>
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Administración Habitech</h1>
                    </div>

                    <div className="flex bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 flex-none self-start">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            Gestión Usuarios
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                        >
                            Certificación Lotes
                        </button>
                    </div>
                </div>

                {/* STATS PREVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform hover:scale-105 transition-all">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Usuarios</p>
                        <h4 className="text-4xl font-black text-gray-900">{users.length}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform hover:scale-105 transition-all">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Activos en Mapa</p>
                        <h4 className="text-4xl font-black text-orange-600">{allListings.length}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform hover:scale-105 transition-all">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Verificados</p>
                        <h4 className="text-4xl font-black text-blue-600">{users.filter(u => u.is_verified).length}</h4>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 transform hover:scale-105 transition-all">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Certificados</p>
                        <h4 className="text-4xl font-black text-emerald-600">{allListings.filter(l => l.is_certified).length}</h4>
                    </div>
                </div>

                {/* MAIN CONTENT TABLE */}
                <div className="bg-white rounded-[3.5rem] shadow-2xl border border-gray-100 overflow-hidden">
                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Identidad</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Estatus de Poder</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Insignia Real</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center font-black text-orange-600 text-xl shadow-inner">
                                                        {u.full_name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 text-base">{u.full_name || u.username}</p>
                                                        <p className="text-xs text-gray-400 font-bold">{u.id.substring(0, 18)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'superadmin' ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : u.role === 'admin' ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'bg-gray-100 text-gray-400'}`}>
                                                        {u.role}
                                                    </span>
                                                    {isSuperAdmin && u.id !== profile.id && (
                                                        <select
                                                            className="text-[10px] font-black border-none bg-gray-50 rounded-lg p-1 uppercase focus:ring-orange-500 cursor-pointer"
                                                            value={u.role}
                                                            onChange={(e) => changeRole(u.id, e.target.value)}
                                                        >
                                                            <option value="user">USER</option>
                                                            <option value="admin">ADMIN</option>
                                                            <option value="superadmin">SUPER</option>
                                                        </select>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button
                                                    onClick={() => toggleVerification(u.id, u.is_verified)}
                                                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${u.is_verified ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-50 text-gray-300 hover:text-gray-500 hover:bg-gray-100'}`}
                                                >
                                                    {u.is_verified ? (
                                                        <>
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L9.03 1.28a2.462 2.462 0 011.94 0l6.865 3.62A2.462 2.462 0 0119.25 7.07V15.5a2.462 2.462 0 01-1.415 2.23l-6.865 3.62a2.462 2.462 0 01-1.94 0l-6.865-3.62A2.462 2.462 0 01.75 15.5V7.07A2.462 2.462 0 012.166 4.9zm13.12 2.39a1.231 1.231 0 10-1.741-1.742l-5.6 5.6-2.583-2.584a1.231 1.231 0 10-1.741 1.741l3.454 3.454a1.231 1.231 0 001.742 0l6.47-6.47z" /></svg>
                                                            Verificado
                                                        </>
                                                    ) : 'Dar Insignia'}
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                                                    Suspender
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Lote / Propiedad</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest">Publicado por</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">Certificación IT</th>
                                        <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {allListings.map(l => (
                                        <tr key={l.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <img src={l.images?.[0] || '/placeholder.jpg'} className="w-14 h-14 rounded-2xl object-cover shadow-md" />
                                                    <div>
                                                        <p className="font-black text-gray-900 text-base capitalize truncate max-w-[200px]">{l.title}</p>
                                                        <p className="text-[14px] text-orange-600 font-black">${l.price?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <p className="font-bold text-gray-500 text-sm">{l.profiles?.full_name || 'Vendedor VIP'}</p>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <button
                                                    onClick={() => toggleCertification(l.id, l.is_certified)}
                                                    className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${l.is_certified ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-gray-50 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50'}`}
                                                >
                                                    {l.is_certified ? (
                                                        <>
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                                                            Certificado
                                                        </>
                                                    ) : 'Certificar Ítem'}
                                                </button>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="text-[10px] font-black text-gray-400 hover:text-orange-600 uppercase tracking-widest transition-colors mr-6">
                                                    Editar
                                                </button>
                                                <button className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">
                                                    Bajar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
