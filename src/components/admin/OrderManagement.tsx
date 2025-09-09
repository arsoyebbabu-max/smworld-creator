import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Eye, Edit } from "lucide-react";
import { Order } from "@/hooks/useAdminData";
import { format } from "date-fns";

interface OrderManagementProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800", 
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "পেন্ডিং",
  confirmed: "কনফার্ম", 
  shipped: "শিপড",
  delivered: "ডেলিভার্ড",
  cancelled: "বাতিল",
};

export function OrderManagement({ orders, onUpdateOrderStatus }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingOrder, setEditingOrder] = useState<string | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    onUpdateOrderStatus(orderId, newStatus);
    setEditingOrder(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>অর্ডার ম্যানেজমেন্ট</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="অর্ডার নম্বর বা ইউজার ID সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব অর্ডার</SelectItem>
              <SelectItem value="pending">পেন্ডিং</SelectItem>
              <SelectItem value="confirmed">কনফার্ম</SelectItem>
              <SelectItem value="shipped">শিপড</SelectItem>
              <SelectItem value="delivered">ডেলিভার্ড</SelectItem>
              <SelectItem value="cancelled">বাতিল</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>অর্ডার নম্বর</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead>মোট পরিমাণ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>পেমেন্ট পদ্ধতি</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    কোন অর্ডার পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.order_number}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>৳{order.total_amount}</TableCell>
                    <TableCell>
                      {editingOrder === order.id ? (
                        <Select
                          defaultValue={order.status}
                          onValueChange={(value) => handleStatusUpdate(order.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">পেন্ডিং</SelectItem>
                            <SelectItem value="confirmed">কনফার্ম</SelectItem>
                            <SelectItem value="shipped">শিপড</SelectItem>
                            <SelectItem value="delivered">ডেলিভার্ড</SelectItem>
                            <SelectItem value="cancelled">বাতিল</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge 
                          variant="secondary" 
                          className={statusColors[order.status as keyof typeof statusColors]}
                        >
                          {statusLabels[order.status as keyof typeof statusLabels] || order.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {order.payment_method || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* View order details */}}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm" 
                          onClick={() => setEditingOrder(order.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}