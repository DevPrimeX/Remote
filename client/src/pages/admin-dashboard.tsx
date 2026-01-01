import { useState, useEffect } from "react";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, Loader2, LayoutDashboard, Tag } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCategorySchema, type Product, type Category } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
          <h1 className="text-3xl font-bold font-display text-slate-900 uppercase tracking-tighter">Admin Dashboard</h1>
          <p className="text-slate-500">Manage products and categories.</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border p-1 h-auto">
            <TabsTrigger value="products" className="flex items-center gap-2 py-2 px-4">
              <LayoutDashboard className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 py-2 px-4">
              <Tag className="h-4 w-4" />
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManager />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CategoryManager() {
  const { data: categories, isLoading } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Category deleted" });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Category Management</h2>
        <Button onClick={() => { setEditingCategory(null); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Home Page</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <img src={cat.image || ""} className="w-12 h-12 rounded object-cover bg-slate-100" alt="thumb" />
                </TableCell>
                <TableCell className="font-medium">{cat.name}</TableCell>
                <TableCell>{cat.isHomePage ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingCategory(cat); setIsDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { if(confirm("Delete?")) deleteMutation.mutate(cat.id); }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} category={editingCategory} />
    </div>
  );
}

function CategoryDialog({ open, onOpenChange, category }: { open: boolean, onOpenChange: (open: boolean) => void, category: Category | null }) {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: { name: "", image: "", isHomePage: false }
  });

  useEffect(() => {
    if (open) {
      if (category) form.reset({ name: category.name, image: category.image || "", isHomePage: !!category.isHomePage });
      else form.reset({ name: "", image: "", isHomePage: false });
    }
  }, [open, category, form]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (category) await apiRequest("PATCH", `/api/categories/${category.id}`, data);
      else await apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      onOpenChange(false);
      toast({ title: "Success" });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input {...form.register("name")} />
          </div>
          <div className="space-y-2">
            <Label>Image URL (ImgBB)</Label>
            <Input {...form.register("image")} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.watch("isHomePage")} onCheckedChange={(v) => form.setValue("isHomePage", v)} />
            <Label>Show on Home</Label>
          </div>
          <Button type="submit" className="w-full" disabled={mutation.isPending}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProductManager() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useProducts({ search });
  const deleteProduct = useDeleteProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search products..." className="pl-10 bg-white" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
               <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img src={product.images[0] || ""} className="w-12 h-12 rounded object-cover bg-slate-100" alt="thumb" />
                </TableCell>
                <TableCell className="font-medium uppercase tracking-tight">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}>
                    <Pencil className="h-4 w-4 text-blue-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { if(confirm("Delete?")) deleteProduct.mutate(product.id); }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} product={editingProduct} />
    </div>
  );
}

interface FormValues {
  name: string;
  category: string;
  description: string;
  images: string;
  specs: { key: string; value: string; }[];
}

function ProductDialog({ open, onOpenChange, product }: { open: boolean, onOpenChange: (open: boolean) => void, product: Product | null }) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const form = useForm<FormValues>({
    defaultValues: { name: "", category: "", description: "", images: "", specs: [] }
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "specs" });

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
        form.reset({ name: "", category: "", description: "", images: "", specs: [] });
      }
    }
  }, [open, product, form]);

  const onSubmit = (data: FormValues) => {
    const specs = data.specs.reduce((acc: Record<string, string>, curr) => {
      if (curr.key && curr.value) acc[curr.key] = curr.value;
      return acc;
    }, {});
    const payload = {
      ...data,
      images: data.images.split(",").map(s => s.trim()).filter(Boolean),
      specs,
      whatsappEnabled: true
    };
    if (product) updateProduct.mutate({ id: product.id, ...payload }, { onSuccess: () => onOpenChange(false) });
    else createProduct.mutate(payload, { onSuccess: () => onOpenChange(false) });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Input {...form.register("name")} placeholder="Product Name" />
          <Input {...form.register("category")} placeholder="Category" />
          <Textarea {...form.register("description")} placeholder="Description" />
          <div className="space-y-2">
            <Label>Image URLs (ImgBB, comma-separated)</Label>
            <Input {...form.register("images")} placeholder="https://..." />
          </div>
          <div className="space-y-2 border p-4 rounded bg-slate-50">
            <div className="flex justify-between items-center mb-2">
              <Label>Specifications</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ key: "", value: "" })}>Add Spec</Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input {...form.register(`specs.${index}.key` as const)} placeholder="Key" />
                <Input {...form.register(`specs.${index}.value` as const)} placeholder="Value" />
                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={createProduct.isPending || updateProduct.isPending}>Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
