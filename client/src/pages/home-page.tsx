import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedServices from "@/components/home/FeaturedServices";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import PricingPlans from "@/components/home/PricingPlans";
import CTA from "@/components/home/CTA";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  // Fetch featured services
  const { data: featuredServices, isLoading: isLoadingFeatured } = useQuery({
    queryKey: ["/api/servicios/destacados"],
  });

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["/api/categorias"],
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Categories categories={categories || []} isLoading={isLoadingCategories} />
        <FeaturedServices services={featuredServices || []} isLoading={isLoadingFeatured} />
        <HowItWorks />
        <Testimonials />
        <PricingPlans />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
