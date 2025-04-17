
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area, AreaChart, Bar, BarChart, 
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractNumberFromCurrency } from "@/utils/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LineChart, Calendar, DollarSign, Briefcase, Users, 
  Activity, BarChart as BarChartIcon, TrendingUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

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
        name: format(new Date(2023, monthIndex), 'MMM', { locale: ptBR }),
        value: monthRevenue
      };
    });

    return monthlyRevenue;
  }, [clientesData, selectedYear]);

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const currentYear = new Date().getFullYear();
    
    // Total estimated revenue for the current year
    const yearlyRevenue = clientesData
      .filter(cliente => 
        cliente.status === 'fechado' && 
        cliente.data_fechamento && 
        new Date(cliente.data_fechamento).getFullYear() === currentYear
      )
      .reduce((total, cliente) => 
        total + extractNumberFromCurrency(cliente.valor_estimado || "R$ 0"), 
      0);
    
    // Count closed contracts for the current year
    const closedContracts = clientesData
      .filter(cliente => 
        cliente.status === 'fechado' && 
        cliente.data_fechamento && 
        new Date(cliente.data_fechamento).getFullYear() === currentYear
      ).length;
    
    // Count active customers (not lost or disqualified)
    const activeCustomers = clientesData
      .filter(cliente => 
        cliente.status !== 'perdido' && 
        cliente.status !== 'desqualificado'
      ).length;
    
    return { yearlyRevenue, closedContracts, activeCustomers };
  }, [clientesData]);

  // Prepare pipeline data
  const pipelineData = useMemo(() => {
    const statusGroups = {
      'lead': { count: 0, value: 0, color: '#9BA1A6' },
      'qualificado': { count: 0, value: 0, color: '#3498DB' },
      'negociacao': { count: 0, value: 0, color: '#9B59B6' },
      'fechado': { count: 0, value: 0, color: '#2ECC71' },
      'perdido': { count: 0, value: 0, color: '#E74C3C' },
      'novo': { count: 0, value: 0, color: '#1ABC9C' },
      'desqualificado': { count: 0, value: 0, color: '#F39C12' },
    };

    // Group by status
    clientesData.forEach(cliente => {
      const status = cliente.status as keyof typeof statusGroups;
      if (statusGroups[status]) {
        statusGroups[status].count += 1;
        statusGroups[status].value += extractNumberFromCurrency(cliente.valor_estimado || "R$ 0");
      }
    });

    // Convert to array format for chart
    return Object.entries(statusGroups).map(([status, data]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count: data.count,
      value: data.value,
      color: data.color
    }));
  }, [clientesData]);

  // Client revenue data
  const clientRevenueData = useMemo(() => {
    return clientesData
      .filter(cliente => extractNumberFromCurrency(cliente.valor_estimado || "R$ 0") > 0)
      .sort((a, b) => 
        extractNumberFromCurrency(b.valor_estimado || "R$ 0") - 
        extractNumberFromCurrency(a.valor_estimado || "R$ 0")
      )
      .slice(0, 10) // Top 10 clients
      .map(cliente => ({
        name: cliente.empresa,
        value: extractNumberFromCurrency(cliente.valor_estimado || "R$ 0")
      }));
  }, [clientesData]);

  // Recent activities
  const recentActivities = useMemo(() => {
    // Get clients with last contact date, sorted by most recent
    return clientesData
      .filter(cliente => cliente.ultimo_contato)
      .sort((a, b) => {
        const dateA = new Date(a.ultimo_contato || '').getTime();
        const dateB = new Date(b.ultimo_contato || '').getTime();
        return dateB - dateA;
      })
      .slice(0, 5) // Get 5 most recent
      .map(cliente => ({
        id: cliente.id,
        name: cliente.nome,
        company: cliente.empresa,
        date: cliente.ultimo_contato ? format(new Date(cliente.ultimo_contato), 'dd/MM/yyyy') : '',
        status: cliente.status
      }));
  }, [clientesData]);

  // Generate year options (last 5 years)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fechado": return "bg-green-500";
      case "negociacao": return "bg-purple-500";
      case "qualificado": return "bg-blue-500";
      case "lead": return "bg-gray-500";
      case "perdido": return "bg-red-500";
      case "desqualificado": return "bg-orange-500";
      case "novo": return "bg-teal-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e desempenho
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Estimado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summaryMetrics.yearlyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ano atual: {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Contratos Fechados
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.closedContracts}
            </div>
            <p className="text-xs text-muted-foreground">
              Ano atual: {new Date().getFullYear()}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Ativos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryMetrics.activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de clientes ativos
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Pipeline */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Pipeline de Vendas</span>
              </CardTitle>
              <CardDescription>
                Distribuição de clientes por etapa do funil
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pipelineData} 
                layout="vertical"
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: isMobile ? 50 : 80, 
                  bottom: 0 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" tickFormatter={(value) => `${value}`} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80} 
                />
                <Tooltip 
                  formatter={(value, name) => [`${value} clientes`, "Quantidade"]} 
                  labelFormatter={(label) => `Status: ${label}`}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Annual Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChartIcon className="h-5 w-5 text-blue-500" />
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
              <BarChart 
                data={revenueData} 
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: isMobile ? 0 : 10, 
                  bottom: 20
                }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  } 
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Faturamento"]}
                />
                <Bar 
                  dataKey="value" 
                  name="Valor"
                  fill="url(#colorRevenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Client Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                <span>Faturamento por Cliente</span>
              </CardTitle>
              <CardDescription>
                Valor estimado por cliente
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={clientRevenueData} 
                layout="vertical"
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: isMobile ? 90 : 120, 
                  bottom: 0 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => 
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  } 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={isMobile ? 90 : 120}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Valor"]}
                  labelFormatter={(label) => `Cliente: ${label}`}
                />
                <Bar 
                  dataKey="value" 
                  fill="#7E57C2" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <span>Atividades Recentes</span>
          </CardTitle>
          <CardDescription>
            Últimas interações com clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma atividade recente encontrada
              </p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 rounded-md border p-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">Empresa: {activity.company}</p>
                    <div className="flex items-center pt-1">
                      <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  </div>
                  <div className={`${getStatusColor(activity.status)} text-white text-xs px-2 py-1 rounded-full`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
