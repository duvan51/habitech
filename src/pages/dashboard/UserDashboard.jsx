import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';
import CreateListingModal from './CreateListingModal';

export default function UserDashboard() {
    const { user, profile, supabase } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchMyListings();
        }
    }, [user]);

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
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                    >
                        <span className="mr-2">+</span> Nueva Publicación
                    </button>
                </div>
            </div>

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
                                            <button className="text-orange-600 hover:text-orange-900 text-sm font-medium">
                                                Editar
                                            </button>
                                            <span className="text-gray-200">|</span>
                                            <button className="text-red-400 hover:text-red-700 text-sm font-medium">
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

            <CreateListingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                supabase={supabase}
                onCreated={fetchMyListings}
            />
        </div>
    );
}

