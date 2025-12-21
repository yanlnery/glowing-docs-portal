import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Plus, ArrowUp, ArrowDown, ImageIcon, Loader2 } from 'lucide-react';
import { OptimizedImage } from '@/components/ui/optimized-image';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text: string | null;
  order_index: number;
  active: boolean;
}

export default function AboutGalleryAdmin() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('about_gallery')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      toast.error('Erro ao carregar imagens');
      console.error(error);
    } else {
      setImages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `about-gallery-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('carousel_images_bucket')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('carousel_images_bucket')
        .getPublicUrl(fileName);

      const maxOrder = images.length > 0 
        ? Math.max(...images.map(img => img.order_index)) + 1 
        : 0;

      const { error: insertError } = await supabase
        .from('about_gallery')
        .insert({
          image_url: urlData.publicUrl,
          alt_text: file.name.replace(/\.[^/.]+$/, ''),
          order_index: maxOrder,
          active: true
        });

      if (insertError) throw insertError;

      toast.success('Imagem adicionada com sucesso!');
      fetchImages();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from('about_gallery')
      .update({ active })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar status');
    } else {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, active } : img
      ));
    }
  };

  const handleUpdateAltText = async (id: string, alt_text: string) => {
    const { error } = await supabase
      .from('about_gallery')
      .update({ alt_text })
      .eq('id', id);

    if (error) {
      toast.error('Erro ao atualizar descrição');
    } else {
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, alt_text } : img
      ));
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const currentImage = images[index];
    const previousImage = images[index - 1];

    await Promise.all([
      supabase.from('about_gallery').update({ order_index: previousImage.order_index }).eq('id', currentImage.id),
      supabase.from('about_gallery').update({ order_index: currentImage.order_index }).eq('id', previousImage.id)
    ]);

    fetchImages();
  };

  const handleMoveDown = async (index: number) => {
    if (index === images.length - 1) return;

    const currentImage = images[index];
    const nextImage = images[index + 1];

    await Promise.all([
      supabase.from('about_gallery').update({ order_index: nextImage.order_index }).eq('id', currentImage.id),
      supabase.from('about_gallery').update({ order_index: currentImage.order_index }).eq('id', nextImage.id)
    ]);

    fetchImages();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    const { error } = await supabase
      .from('about_gallery')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Erro ao excluir imagem');
    } else {
      toast.success('Imagem excluída');
      fetchImages();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Galeria Quem Somos</h1>
            <p className="text-muted-foreground">
              Gerencie as imagens do carrossel na página Quem Somos (mobile)
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Nova Imagem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="max-w-xs"
              />
              {isUploading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Recomendado: imagens com proporção 4:3 para melhor visualização
            </p>
          </CardContent>
        </Card>

        {/* Images List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma imagem cadastrada</p>
              <p className="text-sm text-muted-foreground">
                Adicione imagens para o carrossel da página Quem Somos
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {images.map((image, index) => (
              <Card key={image.id} className={!image.active ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-18 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                      <OptimizedImage
                        src={image.image_url}
                        alt={image.alt_text || 'Imagem'}
                        className="w-full h-full"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    {/* Alt Text */}
                    <div className="flex-1 min-w-0">
                      <Label className="text-xs text-muted-foreground">Descrição (alt text)</Label>
                      <Input
                        value={image.alt_text || ''}
                        onChange={(e) => handleUpdateAltText(image.id, e.target.value)}
                        placeholder="Descrição da imagem"
                        className="mt-1"
                      />
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-2">
                      <Label className="text-sm">Ativo</Label>
                      <Switch
                        checked={image.active}
                        onCheckedChange={(checked) => handleToggleActive(image.id, checked)}
                      />
                    </div>

                    {/* Order Buttons */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === images.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Delete */}
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-medium mb-2">Como funciona</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• As imagens ativas aparecem no carrossel da página Quem Somos (apenas mobile)</li>
              <li>• A cada 4,4 segundos a imagem troca automaticamente com transição suave</li>
              <li>• Use os botões de seta para reordenar as imagens</li>
              <li>• Desative imagens para removê-las temporariamente do carrossel</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
