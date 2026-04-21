import React from 'react';
import { Link } from 'react-router-dom';

export default function BeneficiosVendedor() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-0">
            {/* HERO SECTION */}
            <div className="bg-[#172c34] text-white pt-[60px] pb-16 md:pt-[100px] md:pb-24 px-4 shadow-inner relative overflow-hidden flex items-center justify-center min-h-[50vh]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/4 translate-y-1/4"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 w-full mt-10 md:mt-0">
                    <span className="inline-block px-4 py-1 rounded-full bg-orange-600/20 text-orange-400 font-bold text-xs uppercase tracking-widest mb-6 border border-orange-600/30 shadow-[0_0_15px_rgba(234,88,12,0.4)]">Alianzas Habitech</span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Vende tu Inmueble<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Más Rápido y Seguro</span></h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                        Únete a la red inmobiliaria de mayor crecimiento. Conecta directamente con compradores calificados, sin fricción y con el respaldo tecnológico de Habitech.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="w-full sm:w-auto bg-orange-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-600/30">
                            Crear Cuenta Gratis
                        </Link>
                        <Link to="/terrenoVentas" className="w-full sm:w-auto bg-white/10 text-white backdrop-blur-md px-8 py-4 rounded-xl font-bold uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
                            Explorar Mercado
                        </Link>
                    </div>
                </div>
            </div>

            {/* BENEFICIOS GRID */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-[#172c34] tracking-tight mb-4">¿Por qué elegir Habitech?</h2>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Te proveemos todas las herramientas necesarias para destacar tu propiedad en un mercado altamente competitivo.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Tarjeta 1 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-600 transition-colors duration-300">
                            <svg className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Mayor Visibilidad</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Tu inmueble destacará en nuestro buscador avanzado frente a miles de inversionistas y compradores mensuales.
                        </p>
                    </div>

                    {/* Tarjeta 2 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#172c34] transition-colors duration-300">
                            <svg className="w-8 h-8 text-[#172c34] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Verificación y Seguridad</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Certifica tu propiedad ("Habitech Certified") para triplicar la confianza y obtener contactos mucho más serios.
                        </p>
                    </div>

                    {/* Tarjeta 3 */}
                    <div className="bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 transition-transform duration-300 group">
                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-500 transition-colors duration-300">
                            <svg className="w-8 h-8 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-4">Ahorro en Comisiones</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Negocia directamente en la plataforma usando nuestro CRM gratuito para dueños. Control total de tus ganancias.
                        </p>
                    </div>
                </div>
            </div>

            {/* CALL TO ACTION BOTTOM */}
            <div className="max-w-5xl mx-auto px-4 pb-24 w-full">
                <div className="bg-gradient-to-r from-[#172c34] to-[#2a4d5a] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">¿Listo para publicar tu primer inmueble?</h2>
                        <p className="text-gray-300 mb-8 max-w-xl mx-auto font-medium">Crea tu cuenta de vendedor en menos de 2 minutos y empieza a recibir propuestas hoy mismo.</p>
                        <Link to="/register" className="inline-block bg-orange-600 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-500 hover:scale-105 transition-all shadow-xl">
                            Empieza Gratis
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
