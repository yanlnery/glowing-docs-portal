import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

/**
 * Componente de redirecionamento para manter compatibilidade com URLs antigas
 * Redireciona /especies-criadas/:slug para /especies?selected=:slug
 */
export default function SpeciesDetailRedirect() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/especies" replace />;
  }

  return <Navigate to={`/especies?selected=${slug}`} replace />;
}
