import { useState, useCallback, useEffect } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2, Search, Loader2, Upload, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema, type Product } from "@shared/schema";
import { z } from "zod";
import { useDropzone } from "react-dropzone";

// Admin page needs to verify auth
export default function AdminDashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  
  if (isAuthLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!user) {
    window.location.href = "/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b py-8 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-display text-slate-900">PRODUCT MANAGEMENT</h1>
          <p className="text-slate-500">Manage your catalog and specifications.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <ProductManager />
      </div>
    </div>
  );
}

function ProductManager() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts({ search });
  const deleteProduct = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10 bg-white" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => { setEditingProduct(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.images[0] || ""} className="w-12 h-12 rounded object-cover bg-slate-100" alt="thumb" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                  {Object.keys(product.specs as object).join(", ")}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        product={editingProduct} 
      />
    </div>
  );
}

// Separate form component for cleaner code
function ProductDialog({ open, onOpenChange, product }: { open: boolean, onOpenChange: (open: boolean) => void, product: Product | null }) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  // Extend schema to handle array of specs for the form UI (then convert to object)
  const formSchema = z.object({
    name: z.string().min(1),
    category: z.string().min(1),
    description: z.string().min(1),
    images: z.string(), // comma separated string for simple input
    specs: z.array(z.object({ key: z.string(), value: z.string() })),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      images: "",
      specs: [{ key: "Material", value: "" }, { key: "Capacity", value: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "specs"
  });

  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          category: product.category,
          description: product.description,
          images: product.images.join(", "),
          specs: Object.entries(product.specs as Record<string, string>).map(([key, value]) => ({ key, value }))
        });
      } else {
        form.reset({
          name: "",
          category: "",
          description: "",
          images: "",
          specs: [{ key: "Material", value: "" }, { key: "Capacity", value: "" }]
        });
      }
    }
  }, [open, product, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Transform specs array back to object
    const specsObject = data.specs.reduce((acc, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      ...data,
      images: data.images.split(",").map(s => s.trim()).filter(Boolean),
      specs: specsObject,
      whatsappEnabled: true
    };

    if (product) {
      updateProduct.mutate({ id: product.id, ...payload }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createProduct.mutate(payload, {
        onSuccess: () => onOpenChange(false)
      });
    }
  };

  const isPending = createProduct.isPending || updateProduct.isPending;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // In a real app, you'd upload these to a server. 
    // For this demo, we'll convert to base64 or object URLs
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const currentImages = form.getValues("images");
        form.setValue("images", currentImages ? `${currentImages}, ${base64}` : base64);
      };
      reader.readAsDataURL(file);
    });
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] }
  });

  const removeImage = (index: number) => {
    const images = form.getValues("images").split(",").map(s => s.trim()).filter(Boolean);
    images.splice(index, 1);
    form.setValue("images", images.join(", "));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input {...form.register("category")} placeholder="e.g. Containers" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...form.register("description")} />
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                {isDragActive ? "Drop images here..." : "Drag & drop images here, or click to select"}
              </p>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-2">
              {form.watch("images")?.split(",").map(s => s.trim()).filter(Boolean).map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded overflow-hidden border">
                  <img src={img} className="w-full h-full object-cover" alt={`preview-${idx}`} />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-2">
              <Label className="text-xs text-slate-500">Manual URLs (Comma separated)</Label>
              <Input {...form.register("images")} placeholder="https://..." className="mt-1 h-8 text-xs" />
            </div>
          </div>

          <div className="space-y-2 border p-4 rounded bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <Label>Specifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ key: "", value: "" })}>
                <Plus className="h-3 w-3 mr-1" /> Add Spec
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input {...form.register(`specs.${index}.key`)} placeholder="Key (e.g. Color)" className="w-1/3" />
                <Input {...form.register(`specs.${index}.value`)} placeholder="Value (e.g. White)" className="w-full" />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : (product ? "Save Changes" : "Create Product")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
