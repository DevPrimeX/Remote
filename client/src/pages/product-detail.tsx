import { useState } from "react";
import { useRoute } from "wouter";
import { useProduct } from "@/hooks/use-products";
import { useCreateInquiry } from "@/hooks/use-inquiries";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema } from "@shared/schema";

// Schema for inquiry form with validation
const formSchema = insertInquirySchema.extend({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

export default function ProductDetailPage() {
  const [match, params] = useRoute("/products/:id");
  const id = parseInt(params?.id || "0");
  const { data: product, isLoading } = useProduct(id);
  const [emblaRef] = useEmblaCarousel();
  const [open, setOpen] = useState(false);
  const WHATSAPP_NUMBER = "919876543210";

  const createInquiry = useCreateInquiry();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: id,
      productName: "",
      quantity: 100,
      unit: "Pieces",
      message: ""
    }
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (!product) return <div className="h-screen flex items-center justify-center text-xl font-bold">Product Not Found</div>;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // 1. Save to DB
    createInquiry.mutate({
      ...data,
      productId: product.id,
      productName: product.name
    }, {
      onSuccess: () => {
        // 2. Redirect to WhatsApp
        const text = `Hi, I am interested in *${product.name}*.\nQuantity: ${data.quantity} ${data.unit}\nMessage: ${data.message}`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
        setOpen(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-slate-100 aspect-[4/3]" ref={emblaRef}>
              <div className="flex">
                {product.images.length > 0 ? product.images.map((img, idx) => (
                  <div className="flex-[0_0_100%] min-w-0" key={idx}>
                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                  </div>
                )) : (
                  <div className="flex-[0_0_100%] min-w-0">
                    <img src="https://placehold.co/800x600?text=No+Image" alt="Placeholder" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 overflow-auto pb-2">
              {product.images.map((img, idx) => (
                <div key={idx} className="w-24 h-24 flex-shrink-0 rounded border overflow-hidden cursor-pointer hover:border-primary">
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {product.category}
            </div>
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">{product.name}</h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="bg-slate-50 p-6 rounded-lg border mb-8">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <CheckCircle2 className="h-5 w-5 text-primary mr-2" /> Product Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                {Object.entries(product.specs as Record<string, string>).map(([key, val]) => (
                  <div key={key}>
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">{key}</span>
                    <span className="block text-slate-900 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full md:w-auto h-14 text-lg bg-[#25D366] hover:bg-[#128C7E] text-white">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enquire on WhatsApp
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Inquiry</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" {...form.register("quantity")} />
                      {form.formState.errors.quantity && <p className="text-xs text-red-500">{form.formState.errors.quantity.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Select defaultValue="Pieces" onValueChange={(v) => form.setValue("unit", v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pieces">Pieces</SelectItem>
                          <SelectItem value="Boxes">Boxes</SelectItem>
                          <SelectItem value="Kg">Kg</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Message (Optional)</Label>
                    <Textarea 
                      placeholder="Any specific requirements?" 
                      {...form.register("message")} 
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#128C7E]" disabled={createInquiry.isPending}>
                    {createInquiry.isPending ? "Sending..." : "Continue to WhatsApp"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
