
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useProductForm } from '@/components/admin/product-form/hooks/useProductForm';
import { ProductFormFields } from '@/components/admin/product-form/ProductFormFields';
import { ProductImageManager } from '@/components/admin/product-form/ProductImageManager';
import { ProductFormActions } from '@/components/admin/product-form/ProductFormActions';
import { toast } from '@/components/ui/use-toast';

const ProductForm = () => {
  const {
    form,
    loading,
    isEditMode,
    id,
    imageList,
    setImageList,
    handleImageUpload,
    handleImageFocusChange,
    navigate,
    onSubmit,
    handleDelete,
    speciesList,
    loadingSpecies,
    handleSpeciesSelect,
  } = useProductForm();

  const removeExistingImage = (index: number) => {
    const newImageList = [...imageList];
    newImageList.splice(index, 1);
    setImageList(newImageList);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <ProductFormActions
          isEditMode={isEditMode}
          loading={loading}
          onBack={() => navigate('/admin/products')}
          onDelete={isEditMode && id ? handleDelete : undefined}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <ProductFormFields 
                    form={form} 
                    speciesList={speciesList}
                    loadingSpecies={loadingSpecies}
                    onSpeciesSelect={handleSpeciesSelect}
                  />
                  
                  <div className="pt-4 border-t">
                    <ProductImageManager
                      imageList={imageList}
                      onRemoveExistingImage={removeExistingImage}
                      onImageUpload={handleImageUpload}
                      onImageFocusChange={handleImageFocusChange}
                      toast={toast}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ProductFormActions
              isEditMode={isEditMode}
              loading={loading}
              onBack={() => navigate('/admin/products')}
            />
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
