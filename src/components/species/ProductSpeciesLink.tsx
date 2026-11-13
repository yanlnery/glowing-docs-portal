import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { speciesPath } from '@/lib/speciesGroups';

export function ProductSpeciesLink({ speciesId }: { speciesId?: string }) {
  const { data } = useQuery({
    queryKey: ['product-species-link', speciesId], enabled: Boolean(speciesId),
    queryFn: async () => {
      if (!speciesId) return null;
      const { data, error } = await supabase.from('species').select('commonname,slug,new_slug').eq('id', speciesId).maybeSingle();
      if (error) return null;
      return data;
    },
  });
  return data ? <Link className="mt-2 inline-block text-sm text-primary underline underline-offset-4" to={speciesPath(data)}>Conheça a espécie: {data.commonname}</Link> : null;
}