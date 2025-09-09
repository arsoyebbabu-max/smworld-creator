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
import { Star, Check, X } from "lucide-react";
import { Review } from "@/hooks/useAdminData";
import { format } from "date-fns";

interface ReviewManagementProps {
  reviews: Review[];
  onUpdateReviewStatus: (reviewId: string, isApproved: boolean) => void;
}

export function ReviewManagement({ reviews, onUpdateReviewStatus }: ReviewManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.review_text || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "approved" && review.is_approved) ||
                         (statusFilter === "pending" && !review.is_approved);
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm">{rating}/5</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>রিভিউ ম্যানেজমেন্ট</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="প্রোডাক্ট ID বা রিভিউ টেক্সট সার্চ করুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সব রিভিউ</SelectItem>
              <SelectItem value="approved">অনুমোদিত</SelectItem>
              <SelectItem value="pending">অপেক্ষমান</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>প্রোডাক্ট ID</TableHead>
                <TableHead>রেটিং</TableHead>
                <TableHead>রিভিউ</TableHead>
                <TableHead>তারিখ</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    কোন রিভিউ পাওয়া যায়নি
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">
                      {review.product_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {renderStars(review.rating)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={review.review_text}>
                        {review.review_text || 'কোন রিভিউ টেক্সট নেই'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(review.created_at), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={review.is_approved ? "default" : "secondary"}
                        className={review.is_approved 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {review.is_approved ? "অনুমোদিত" : "অপেক্ষমান"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {!review.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateReviewStatus(review.id, true)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        {review.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateReviewStatus(review.id, false)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
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