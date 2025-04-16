
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area, AreaChart, 
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractNumberFromCurrency } from "@/utils/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { LineChart, Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Get client data for the current user
  const { data: clientesData = [], isLoading } = useQuery({
    queryKey: ['clientes', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error fetching clientes:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!user
  });

  // Prepare revenue data by year and month
  const revenueData = useMemo(() => {
    // Filter clients with closed status and for the selected year
    const closedClients = clientesData
      .filter(cliente => 
        cliente.status === 'fechado' && 
        cliente.data_fechamento && 
        new Date(cliente.data_fechamento).getFullYear() === parseInt(selectedYear)
      );

    // Group revenue by month
    const monthlyRevenue = Array(12).fill(0).map((_, monthIndex) => {
      const monthRevenue = closedClients
        .filter(cliente => {
          const closureDate = new Date(cliente.data_fechamento || '');
          return closureDate.getMonth() === monthIndex;
        })
        .reduce((total, cliente) => 
          total + extractNumberFromCurrency(cliente.valor_estimado || "R$ 0"), 
        0);

      return {
        name: new Date(2023, monthIndex).toLocaleString('pt-BR', { month: 'short' }),
        value: monthRevenue
      };
    });

    return monthlyRevenue;
  }, [clientesData, selectedYear]);

  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e desempenho
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                <span>Faturamento Anual</span>
              </CardTitle>
              <CardDescription>
                Faturamento mensal por cliente fechado
              </CardDescription>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Select 
                value={selectedYear} 
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-[120px]">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={revenueData} 
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: isMobile ? 0 : 10, 
                  bottom: 0 
                }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                  } 
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Faturamento"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366F1" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Valor"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
