import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [
        { count: totalProducts },
        { count: totalOrders },
        { count: totalCustomers },
        { data: revenueData }
      ] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_confirmed", true)
      ]);

      const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      return {
        totalProducts: totalProducts || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue
      };
    },
  });

  const statsCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: Package,
      description: "Active products in catalog"
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      description: "Orders received"
    },
    {
      title: "Total Customers",
      value: stats?.totalCustomers || 0,
      icon: Users,
      description: "Registered customers"
    },
    {
      title: "Total Revenue",
      value: `KSh ${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      description: "Confirmed payments"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Timeless Strands admin panel
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card 
              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/products/new")}
            >
              <div className="flex items-center space-x-3">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Add New Product</h3>
                  <p className="text-sm text-muted-foreground">Create a new wig product</p>
                </div>
              </div>
            </Card>
            <Card 
              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/orders")}
            >
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">View Orders</h3>
                  <p className="text-sm text-muted-foreground">Manage customer orders</p>
                </div>
              </div>
            </Card>
            <Card 
              className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => navigate("/admin/customers")}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">Customers</h3>
                  <p className="text-sm text-muted-foreground">View customer list</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}