import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Trash2, Upload, X } from "lucide-react";

const categories = [
  "Straight", "Curly", "Body Wave", "Bob", "Braided", 
  "Bundles", "Fringe", "Pixie", "Kinky Straight", "Kinky Curly", 
  "HD Lace", "Wavy", "Afro"
];

const densityOptions = ["180%", "200%", "300%"];

interface ProductVariant {
  id?: string;
  lace_size: string;
  inch: string;
  density: string;
  colour: string;
  style: string;
  price: number;
  quantity: number;
}

interface MediaFile {
  file: File;
  type: 'image' | 'video';
  preview: string;
}

export default function ProductForm() {
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const isEditing = !!productId;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    is_featured: false,
    is_active: true
  });

  const [variants, setVariants] = useState<ProductVariant[]>([{
    lace_size: "",
    inch: "",
    density: "",
    colour: "",
    style: "",
    price: 0,
    quantity: 0
  }]);

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load existing product data when editing
  useEffect(() => {
    if (isEditing && productId) {
      const loadProduct = async () => {
        setIsLoading(true);
        try {
          const { data: product, error } = await supabase
            .from("products")
            .select(`
              *,
              product_media(*),
              product_variants(*)
            `)
            .eq("id", productId)
            .single();

          if (error) throw error;

          setFormData({
            name: product.name,
            description: product.description || "",
            category: product.category,
            is_featured: product.is_featured,
            is_active: product.is_active
          });

          setVariants(product.product_variants.map((v: any) => ({
            id: v.id,
            lace_size: v.lace_size || "",
            inch: v.inch || "",
            density: v.density || "",
            colour: v.colour || "",
            style: v.style || "",
            price: v.price,
            quantity: v.quantity
          })));

          // Note: We don't load existing media files for editing
          // This would require additional implementation for existing media management
        } catch (error) {
          console.error("Error loading product:", error);
          toast({
            title: "Error",
            description: "Failed to load product data.",
            variant: "destructive",
          });
          navigate("/admin/products");
        } finally {
          setIsLoading(false);
        }
      };

      loadProduct();
    }
  }, [isEditing, productId, navigate, toast]);

  const saveProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      let product;
      
      if (isEditing && productId) {
        // Update existing product
        const { data: updatedProduct, error: productError } = await supabase
          .from("products")
          .update({
            name: productData.name,
            description: productData.description,
            category: productData.category,
            is_featured: productData.is_featured,
            is_active: productData.is_active
          })
          .eq("id", productId)
          .select()
          .single();

        if (productError) throw productError;
        product = updatedProduct;

        // Delete existing variants and create new ones
        await supabase
          .from("product_variants")
          .delete()
          .eq("product_id", productId);
      } else {
        // Create new product
        const { data: newProduct, error: productError } = await supabase
          .from("products")
          .insert({
            name: productData.name,
            description: productData.description,
            category: productData.category,
            is_featured: productData.is_featured,
            is_active: productData.is_active
          })
          .select()
          .single();

        if (productError) throw productError;
        product = newProduct;
      }

      // Upload media files (only for new files)
      if (mediaFiles.length > 0) {
        const mediaPromises = mediaFiles.map(async (media, index) => {
          const fileExt = media.file.name.split('.').pop();
          const fileName = `${product.id}/${Date.now()}-${index}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('product-media')
            .upload(fileName, media.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-media')
            .getPublicUrl(fileName);

          return {
            product_id: product.id,
            media_url: publicUrl,
            media_type: media.type,
            display_order: index
          };
        });

        const mediaData = await Promise.all(mediaPromises);
        
        const { error: mediaError } = await supabase
          .from("product_media")
          .insert(mediaData);

        if (mediaError) throw mediaError;
      }

      // Create variants
      const variantData = variants.map(variant => ({
        product_id: product.id,
        lace_size: variant.lace_size,
        inch: variant.inch,
        density: variant.density,
        colour: variant.colour,
        style: variant.style,
        price: variant.price,
        quantity: variant.quantity
      }));

      const { error: variantError } = await supabase
        .from("product_variants")
        .insert(variantData);

      if (variantError) throw variantError;

      return product;
    },
    onSuccess: () => {
      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: isEditing 
          ? "The product has been updated successfully."
          : "The product has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      navigate("/admin/products");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: isEditing 
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again.",
        variant: "destructive",
      });
      console.error(`Error ${isEditing ? 'updating' : 'creating'} product:`, error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (variants.some(v => !v.price || v.price <= 0)) {
      toast({
        title: "Validation Error",
        description: "All variants must have a valid price.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    saveProductMutation.mutate(formData);
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    Array.from(e.target.files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isImage && !isVideo) {
        toast({
          title: "Invalid file type",
          description: "Only images and videos are allowed.",
          variant: "destructive",
        });
        return;
      }

      const preview = URL.createObjectURL(file);
      setMediaFiles(prev => [...prev, {
        file,
        type: isVideo ? 'video' : 'image',
        preview
      }]);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      lace_size: "",
      inch: "",
      density: "",
      colour: "",
      style: "",
      price: 0,
      quantity: 0
    }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => prev.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin/products")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update the product information" : "Create a new wig product for the catalog"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Product Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_featured">Featured Product</Label>
                <p className="text-sm text-muted-foreground">Show this product on the homepage</p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Product Visibility</Label>
                <p className="text-sm text-muted-foreground">Make this product visible to customers</p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Product Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="media">Upload Images & Videos</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="media"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative group">
                    {media.type === 'image' ? (
                      <img 
                        src={media.preview} 
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                    ) : (
                      <video 
                        src={media.preview}
                        className="w-full h-24 object-cover rounded border"
                        controls
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Variants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Product Variants</CardTitle>
            <Button type="button" variant="outline" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {variants.map((variant, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Variant {index + 1}</h4>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Lace Size</Label>
                    <Input
                      value={variant.lace_size}
                      onChange={(e) => updateVariant(index, 'lace_size', e.target.value)}
                      placeholder="e.g. 13x4, 4x4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Length (Inch)</Label>
                    <Input
                      value={variant.inch}
                      onChange={(e) => updateVariant(index, 'inch', e.target.value)}
                      placeholder="e.g. 12, 14, 16"
                    />
                  </div>

                   <div className="space-y-2">
                     <Label>Density</Label>
                     <Input
                       value={variant.density}
                       onChange={(e) => updateVariant(index, 'density', e.target.value)}
                       placeholder="e.g. 180%, 200%, 300%"
                     />
                   </div>

                  <div className="space-y-2">
                    <Label>Colour</Label>
                    <Input
                      value={variant.colour}
                      onChange={(e) => updateVariant(index, 'colour', e.target.value)}
                      placeholder="e.g. Black, Brown, Blonde"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Style</Label>
                    <Input
                      value={variant.style}
                      onChange={(e) => updateVariant(index, 'style', e.target.value)}
                      placeholder="e.g. Straight, Wavy"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Price (KSh) *</Label>
                    <Input
                      type="number"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={variant.quantity}
                      onChange={(e) => updateVariant(index, 'quantity', Number(e.target.value))}
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Product" : "Create Product")}
          </Button>
        </div>
      </form>
    </div>
  );
}