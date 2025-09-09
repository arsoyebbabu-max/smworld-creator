import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users, 
  Clock, 
  AlertTriangle,
  Star,
  MessageSquare
} from "lucide-react";
import { AdminStats as AdminStatsType } from "@/hooks/useAdminData";

interface AdminStatsProps {
  stats: AdminStatsType;
}

export function AdminStats({ stats }: AdminStatsProps) {
  const statsData = [
    {
      title: "মোট আয়",
      value: `৳${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      bgColor: "bg-green-500",
    },
    {
      title: "মোট অর্ডার", 
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      bgColor: "bg-blue-500",
    },
    {
      title: "মোট প্রোডাক্ট",
      value: stats.totalProducts.toString(), 
      icon: Package,
      bgColor: "bg-purple-500",
    },
    {
      title: "মোট ইউজার",
      value: stats.totalUsers.toString(),
      icon: Users,
      bgColor: "bg-orange-500",
    },
    {
      title: "পেন্ডিং অর্ডার",
      value: stats.pendingOrders.toString(),
      icon: Clock,
      bgColor: "bg-yellow-500",
    },
    {
      title: "কম স্টক প্রোডাক্ট",
      value: stats.lowStockProducts.toString(),
      icon: AlertTriangle,
      bgColor: "bg-red-500",
    },
    {
      title: "মোট রিভিউ",
      value: stats.totalReviews.toString(),
      icon: Star,
      bgColor: "bg-indigo-500",
    },
    {
      title: "না পড়া মেসেজ",
      value: stats.unreadMessages.toString(),
      icon: MessageSquare,
      bgColor: "bg-pink-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`${stat.bgColor} p-2 rounded-full text-white`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}