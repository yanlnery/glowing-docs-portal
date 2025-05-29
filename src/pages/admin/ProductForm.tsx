
import React from 'react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useProductForm } from '@/components/admin/product-form/hooks/useProductForm';
import { ProductFormFields } from '@/components/admin/product-form/ProductFormFields';
import { ProductImageManager } from '@/components/admin/product-form/ProductImageManager';
import { ProductFormActions } from '@/components/admin/product-form/ProductFormActions';

const ProductForm = () => {
  const {
    form,
    loading,
    isEditMode,
    id,
    imageList,
    setImageList,
    imageFiles,
    setImageFiles,
    imagePreviewUrls,
    setImagePreviewUrls,
    navigate,
    onSubmit,
    handleDelete,
  } = useProductForm();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      const currentImageFiles = [...imageFiles, ...filesArray];
      setImageFiles(currentImageFiles);
      
      const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviewUrls(prevUrls => [...prevUrls, ...newImageUrls]);
    }
  };

  const removeImage = (index: number) => {
    const newPreviewUrls = [...imagePreviewUrls];
    const removedPreviewUrl = newPreviewUrls.splice(index, 1)[0];
    setImagePreviewUrls(newPreviewUrls);
    
    URL.revokeObjectURL(removedPreviewUrl);
    
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);
  };

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
                  <ProductFormFields form={form} />
                  
                  <div className="pt-4 border-t">
                    <ProductImageManager
                      imageList={imageList}
                      imagePreviewUrls={imagePreviewUrls}
                      onImageChange={handleImageChange}
                      onRemoveImage={removeImage}
                      onRemoveExistingImage={removeExistingImage}
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
