import { Link } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, ThumbsUp } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useProducts({ search: "" });
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/40 z-10" />
        
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0" ref={emblaRef}>
          <div className="flex h-full">
            <div className="flex-[0_0_100%] min-w-0 relative">
               {/* HTML Comment: Industrial Warehouse Background */}
               <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Factory" />
            </div>
            <div className="flex-[0_0_100%] min-w-0 relative">
               {/* HTML Comment: Product Quality Close-up */}
               <img src="https://images.unsplash.com/photo-1626176395349-8e50b16f195d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" alt="Packaging" />
            </div>
          </div>
        </div>

        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              PREMIUM PACKAGING <span className="text-primary">SOLUTIONS</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 font-light">
              We manufacture high-quality, durable, and sustainable packaging for the food industry.
            </p>
            <div className="flex gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 h-14 rounded-none">
                  Explore Products <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 text-lg px-8 h-14 rounded-none">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 border border-slate-100 bg-slate-50/50 hover-elevate transition-shadow group rounded-md">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Certified Quality</h3>
              <p className="text-slate-600">ISO 9001:2015 certified manufacturing process ensuring consistent top-tier quality standards for every batch.</p>
            </div>
            <div className="p-8 border border-slate-100 bg-slate-50/50 hover-elevate transition-shadow group rounded-md">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-slate-600">Efficient logistics network with real-time tracking, ensuring timely delivery across the country in 2-5 business days.</p>
            </div>
            <div className="p-8 border border-slate-100 bg-slate-50/50 hover-elevate transition-shadow group rounded-md">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <ThumbsUp className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">Wholesale Pricing</h3>
              <p className="text-slate-600">Direct-from-factory pricing tiers that scale with your volume, providing the best value and margins for your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">OUR CATEGORIES</h2>
            <div className="h-1 w-20 bg-primary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {['Containers', 'Trays', 'Foils'].map((cat) => (
              <Link key={cat} href={`/products?category=${cat}`}>
                <div className="group relative h-80 overflow-hidden cursor-pointer bg-slate-900">
                  <img 
                    src={`https://placehold.co/600x800/1e293b/ffffff?text=${cat}`} 
                    alt={cat}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-bold text-white border-4 border-white px-6 py-3 uppercase tracking-widest group-hover:bg-white group-hover:text-slate-900 transition-colors">
                      {cat}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-slate-900">FEATURED PRODUCTS</h2>
              <div className="h-1 w-20 bg-primary" />
            </div>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-96 bg-slate-100 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
