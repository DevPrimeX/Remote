import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar, Footer } from "@/components/layout";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/home";
import ProductListPage from "@/pages/product-list";
import ProductDetailPage from "@/pages/product-detail";
import LoginPage from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductListPage} />
          <Route path="/products/:id" component={ProductDetailPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          {/* Simple placeholders for non-critical pages */}
          <Route path="/about">
             <div className="container mx-auto py-20 text-center">
               <h1 className="text-4xl font-bold mb-4">About Us</h1>
               <p className="max-w-2xl mx-auto text-slate-600">We are IndustriaPack, dedicated to providing world-class packaging solutions since 1995.</p>
             </div>
          </Route>
          <Route path="/contact">
             <div className="container mx-auto py-20 text-center">
               <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
               <p className="text-slate-600">Email: sales@industriapack.com | Phone: +91 98765 43210</p>
             </div>
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
