import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
    const { user, profile, supabase } = useAuth();
    const [myListings, setMyListings] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
                    >
                        Nueva Publicación
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md mt-8">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Mis Publicaciones</h3>
                </div>
                {loading ? (
                    <div className="p-10 text-center text-gray-400">Cargando...</div>
                ) : myListings.length === 0 ? (
                    <div className="p-10 text-center">
                        <p className="text-gray-500 mb-4">Aún no tienes publicaciones.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {myListings.map((listing) => (
                            <li key={listing.id}>
                                <div className="px-4 py-4 flex items-center sm:px-6">
                                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex text-sm">
                                                <p className="font-medium text-orange-600 truncate capitalize">{listing.title}</p>
                                                <p className="ml-1 flex-shrink-0 font-normal text-gray-500">en {listing.location}</p>
                                            </div>
                                            <div className="mt-2 flex">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <span className="capitalize">{listing.type}</span>
                                                    <span className="mx-2">&bull;</span>
                                                    <span>${listing.price?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                            <div className="flex overflow-hidden">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                    {listing.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ml-5 flex-shrink-0">
                                        <button className="text-gray-400 hover:text-gray-500">
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
