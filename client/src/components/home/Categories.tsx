import { useLocation } from "wouter";
import { 
  Briefcase, BookOpen, Camera, Heart, Globe, Drill, Trash2, ChevronRight, Loader2 
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface CategoriesProps {
  categories: Category[];
  isLoading: boolean;
}

export default function Categories({ categories, isLoading }: CategoriesProps) {
  const [, setLocation] = useLocation();

  // Map category icons to Lucide icons
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-8 w-8 text-primary-600" };
    
    switch (iconName) {
      case "Trash2":
        return <Trash2 {...iconProps} />;
      case "Drill":
        return <Drill {...iconProps} />;
      case "Heart":
        return <Heart {...iconProps} />;
      case "Globe":
        return <Globe {...iconProps} />;
      case "Camera":
        return <Camera {...iconProps} />;
      case "BookOpen":
        return <BookOpen {...iconProps} />;
      default:
        return <Briefcase {...iconProps} />;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/servicios?categoria=${categoryId}`);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
            Explora por categorías
          </h2>
          <p className="text-gray-600 mt-2">
            Encuentra el servicio que necesitas entre nuestras categorías principales
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-center transition duration-200 group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="w-16 h-16 mx-auto bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200">
                  {getIcon(category.icon)}
                </div>
                <h3 className="mt-4 font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.count} servicios</p>
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => setLocation("/servicios")}
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            Ver todas las categorías
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
