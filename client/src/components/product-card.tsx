import { Link } from "wouter";
import { type Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.[0] || "https://placehold.co/600x400/e2e8f0/1e293b?text=Product+Image";

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden cursor-pointer h-full hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-primary/50">
        <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
          {/* HTML Comment for Image: Product Thumbnail */}
          <img 
            src={mainImage} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider text-primary shadow-sm">
            {product.category}
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-display font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {product.description}
          </p>
          <div className="flex gap-2 flex-wrap">
             {Object.entries(product.specs as Record<string, string>).slice(0, 2).map(([key, val]) => (
               <div key={key} className="text-xs bg-slate-50 px-2 py-1 rounded border text-slate-600">
                 <span className="font-semibold capitalize">{key}:</span> {val}
               </div>
             ))}
          </div>
        </CardContent>
        <CardFooter className="p-6 pt-0 mt-auto">
          <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white transition-all">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
