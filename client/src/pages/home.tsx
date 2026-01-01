import { Link } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, ThumbsUp } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import { type Category } from "@shared/schema";

export default function HomePage() {
  const { data: featuredProducts, isLoading } = useProducts({ search: "" });
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({ 
    queryKey: ["/api/categories"] 
  });
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] lg:h-[600px] overflow-hidden bg-slate-900 text-white flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900 z-10" />
        
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0" ref={emblaRef}>
          <div className="flex h-full">
            <div className="flex-[0_0_100%] min-w-0 relative">
               <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 scale-105" alt="Factory" />
            </div>
            <div className="flex-[0_0_100%] min-w-0 relative">
               <img src="https://images.unsplash.com/photo-1626176395349-8e50b16f195d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 scale-105" alt="Packaging" />
            </div>
          </div>
        </div>

        <div className="relative z-20 container mx-auto px-4 py-20 lg:py-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              ISO 9001:2015 Certified Manufacturer
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-[0.9] tracking-tighter">
              RITESH <span className="text-primary italic">PLASTIC</span>
            </h1>
            <p className="text-lg md:text-2xl text-slate-300 mb-10 font-light max-w-xl leading-relaxed">
              Precision-engineered pharmaceutical and industrial plastic packaging solutions. Manufacturing excellence in the heart of Baddi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 h-14 rounded-full shadow-lg shadow-primary/20">
                  Browse Catalog <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white/30 hover:bg-white/10 backdrop-blur-md text-lg px-10 h-14 rounded-full">
                  Request Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all" />
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Certified Quality</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Rigorous quality control systems ensuring pharmaceutical-grade standards for every production run.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all" />
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Rapid Logistics</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Optimized supply chain management providing reliable delivery timelines across all industrial hubs.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-10 border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all" />
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                <ThumbsUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">Direct Pricing</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Competitive wholesale factory rates with transparent volume-based discount structures.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tighter">PRODUCT CATEGORIES</h2>
              <p className="text-slate-600 text-lg">Explore our specialized range of plastic packaging solutions designed for durability and compliance.</p>
            </div>
            <div className="h-1 w-24 bg-primary rounded-full hidden md:block" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
              ))
            ) : categories?.map((cat) => (
              <Link key={cat.id} href={`/products?category=${cat.name}`}>
                <div className="group relative h-[400px] overflow-hidden cursor-pointer bg-slate-900 rounded-2xl shadow-xl border border-slate-200/50">
                  <img 
                    src={cat.image || `https://placehold.co/600x800/1e293b/ffffff?text=${cat.name}`} 
                    alt={cat.name}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-8">
                    <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tighter mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                      {cat.name}
                    </h3>
                    <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      View full range <ArrowRight className="inline h-4 w-4 ml-1" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tighter">FEATURED SOLUTIONS</h2>
              <p className="text-slate-600 text-lg max-w-xl">Our most sought-after products trusted by industry leaders across India.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="text-slate-900 border-slate-200 hover:border-primary hover:text-primary rounded-full px-8 transition-all group">
                VIEW FULL CATALOG <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[450px] bg-slate-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
