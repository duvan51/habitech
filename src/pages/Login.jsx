import React, { useState } from 'react';
import { signIn, signInWithGoogle } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // Redirect is handled by Supabase OAuth
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 transform transition-all">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 mb-6">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 20c4.42 0 8.067-3.582 8-8.038-.063-4.456-3.75-8.156-8.25-8.156A8.5 8.5 0 003.5 12.3c0 2.25.9 4.3 2.5 5.75L12 11z" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        Bienvenido de Nuevo
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Acceso Exclusivo Habitech
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    {/* Botón de Google */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white border-2 border-gray-100 rounded-2xl text-sm font-black text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase font-black tracking-widest">
                            <span className="bg-white px-4 text-gray-300">O usa tu correo</span>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-300"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl text-gray-900 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all placeholder-gray-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-gray-200 hover:bg-orange-600 hover:shadow-orange-100 transition-all duration-300 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Validando...' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="pt-6 text-center">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="text-orange-600 hover:text-orange-500 font-black decoration-2 underline-offset-4 hover:underline">
                                Únete a la Élite
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
