import { supabase } from './supabaseClient';

export const getPropiedades = async () => {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error al obtener propiedades: ", err);
        throw err;
    }
};


