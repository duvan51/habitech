-- 1. Crear la tabla para guardar las configuraciones globales del portafolio
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  hero_video TEXT,
  reels JSONB,
  projects JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar la seguridad a nivel de fila (RLS)
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir que todo el mundo lea los datos
CREATE POLICY "Permitir lectura pública de portafolio" 
ON public.portfolio_settings 
FOR SELECT 
USING (true);

-- 4. Crear política para permitir que usuarios autenticados gestionen los datos
CREATE POLICY "Permitir gestión a usuarios autenticados" 
ON public.portfolio_settings 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Insertar el registro semilla inicial
INSERT INTO public.portfolio_settings (id, hero_video, reels, projects)
VALUES (
  'global',
  'https://player.vimeo.com/external/459389137.sd.mp4?s=8720e517a1d939bce56a84f32ab0a457&profile_id=165&oauth2_token_id=57447761',
  '[]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
