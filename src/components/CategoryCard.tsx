interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div 
        className="w-12 h-12 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: category.color }}
      >
        <img src={category.icon} alt={category.name} className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium text-center text-foreground">
        {category.name}
      </span>
    </div>
  );
};

export default CategoryCard;