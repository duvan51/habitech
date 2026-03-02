import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';

export default function AdminDashboard() {
    const { supabase } = useAuth();
    const [users, setUsers] = useState([]);
    const [allListings, setAllListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // In a real app, you might need a service role or special RPC to list all auth users,
            // here we list from our 'profiles' table which mirrors users.
            const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
            const { data: listings, error: lError } = await supabase.from('listings').select('*, profiles(full_name)');

            if (!pError) setUsers(profiles);
            if (!lError) setAllListings(listings);
            setLoading(false);
        };

        fetchData();
    }, [supabase]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Usuarios</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Publicaciones</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{allListings.length}</dd>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Listado de Usuarios</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Act.</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((profile) => (
                            <tr key={profile.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.full_name || profile.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {profile.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(profile.updated_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
