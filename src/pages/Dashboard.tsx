
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Area, AreaChart, Bar, BarChart, Line, LineChart,
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Cell
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractNumberFromCurrency } from "@/utils/format";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  LineChart as LineChartIcon, Calendar, DollarSign, Briefcase, Users, 
  Activity, BarChart as BarChartIcon, TrendingUp, ChevronUp, ChevronDown,
  Check, X, Moon, Package, Filter, ArrowUpRight, MoreVertical
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";

// Helper function to format currency
const formatCurrency = (value: number) => {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedPeriod, setSelectedPeriod] = useState("30");

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
        value: monthRevenue,
        mobile: monthRevenue * 0.4,  // Example secondary data for area chart
        desktop: monthRevenue * 0.6   // Example secondary data for area chart
      };
    });

    return monthlyRevenue;
  }, [clientesData, selectedYear]);

  // Generate credit usage data (example data similar to the image)
  const creditUsageData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      name: month,
      current: Math.floor(Math.random() * 5000) + 2000,
      previous: Math.floor(Math.random() * 4000) + 1000,
    }));
  }, []);

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
    
    // Previous month metrics for percentage calculation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthYearlyRevenue = yearlyRevenue * 0.8; // Example for demonstration
    const lastMonthClosedContracts = Math.floor(closedContracts * 0.9); // Example
    const lastMonthActiveCustomers = Math.floor(activeCustomers * 0.88); // Example
    
    const percentageChangeRevenue = lastMonthYearlyRevenue ? 
      ((yearlyRevenue - lastMonthYearlyRevenue) / lastMonthYearlyRevenue) * 100 : 0;
    const percentageChangeContracts = lastMonthClosedContracts ? 
      ((closedContracts - lastMonthClosedContracts) / lastMonthClosedContracts) * 100 : 0;
    const percentageChangeCustomers = lastMonthActiveCustomers ? 
      ((activeCustomers - lastMonthActiveCustomers) / lastMonthActiveCustomers) * 100 : 0;
    
    return { 
      yearlyRevenue, 
      closedContracts, 
      activeCustomers,
      percentageChangeRevenue: percentageChangeRevenue.toFixed(1),
      percentageChangeContracts: percentageChangeContracts.toFixed(1),
      percentageChangeCustomers: percentageChangeCustomers.toFixed(1)
    };
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
      case "fechado": return "bg-emerald-500";
      case "negociacao": return "bg-violet-500";
      case "qualificado": return "bg-blue-500";
      case "lead": return "bg-slate-500";
      case "perdido": return "bg-rose-500";
      case "desqualificado": return "bg-amber-500";
      case "novo": return "bg-teal-500";
      default: return "bg-slate-500";
    }
  };

  // Mock user data for the table (similar to the reference image)
  const usersData = useMemo(() => [
    { email: "cliente1@exemplo.com", provider: "Google", created: "06 Jun, 2023 11:33", lastSign: "16 Jun, 2023 11:33", userId: "f3f42fc419-ce32-49fc-92df..." },
    { email: "cliente2@exemplo.com", provider: "Google", created: "06 Jun, 2023 11:29", lastSign: "15 Jun, 2023 11:29", userId: "f3f42fc419-ce32-49fc-92df..." },
    { email: "cliente3@exemplo.com", provider: "Email", created: "06 Jun, 2023 11:21", lastSign: "14 Jun, 2023 11:21", userId: "f3f42fc419-ce32-49fc-92df..." },
    { email: "cliente4@exemplo.com", provider: "Google", created: "06 Jun, 2023 11:18", lastSign: "13 Jun, 2023 11:18", userId: "f3f42fc419-ce32-49fc-92df..." },
  ], []);

  return (
    <div className="space-y-6 animate-fade-in max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <span>Pages</span>
            <span>/</span>
            <span className="font-medium text-foreground">Main Dashboard</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Main Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Moon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
          <div className="bg-background rounded-full h-8 w-8 flex items-center justify-center border">
            <span className="text-sm font-medium">AP</span>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <BarChartIcon className="h-4 w-4 text-slate-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Total Credits Used
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                {formatCurrency(summaryMetrics.yearlyRevenue).replace('R$', '')}
              </div>
              <p className="text-xs text-emerald-600 flex items-center">
                +{summaryMetrics.percentageChangeRevenue}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-slate-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Total Users
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                {summaryMetrics.activeCustomers.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 flex items-center">
                +{summaryMetrics.percentageChangeCustomers}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <Package className="h-4 w-4 text-slate-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Credits Available
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                100,000
              </div>
              <p className="text-xs text-muted-foreground">
                Annual quota
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-slate-600" />
              </div>
              <CardTitle className="text-sm font-medium">
                Current Plan
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="px-6">
            <div className="flex flex-col">
              <div className="text-2xl font-bold">
                Expert+
              </div>
              <Button variant="outline" className="text-xs mt-1 h-8" size="sm">
                Manage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Charts Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Area Chart - Similar to reference design */}
        <Card className="border rounded-xl overflow-hidden lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">149,758</span>
              </div>
              <CardDescription>
                Credits usage in the last year
              </CardDescription>
            </div>
            
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-[150px] h-8 text-xs">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pl-2 pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={revenueData} 
                  margin={{ 
                    top: 5, 
                    right: 30, 
                    left: 0, 
                    bottom: 30 
                  }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 12}}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{fontSize: 12}}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    tickFormatter={(value) => `${value}`}
                  />
                  <CartesianGrid vertical={false} stroke="#f0f0f0" />
                  <Tooltip 
                    formatter={(value) => [`${value}`, "Value"]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-xs text-muted-foreground">Mobile</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs text-muted-foreground">Desktop</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Credit Usage Chart */}
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="pb-1 px-6">
            <CardTitle className="text-lg">Credit usage</CardTitle>
            <CardDescription className="text-xs">January - June 2024</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pt-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={creditUsageData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
                  barGap={8}
                >
                  <CartesianGrid vertical={false} stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    hide={true}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Credits"]}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="current" fill="#4A5FC1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="previous" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-col">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                  <span>+20.4% from last month</span>
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Showing credits usage for the last 6 months
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales Pipeline */}
      <Card className="border rounded-xl overflow-hidden">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Sales Pipeline</CardTitle>
              <CardDescription>Distribution of clients by sales stage</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={pipelineData} 
                layout="vertical"
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: isMobile ? 50 : 80, 
                  bottom: 10
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`} 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={80}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value, name) => [`${value} clientes`, "Quantidade"]} 
                  labelFormatter={(label) => `Status: ${label}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
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
      <Card className="border rounded-xl overflow-hidden">
        <CardHeader className="px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Annual Revenue</CardTitle>
              <CardDescription>Monthly revenue by closed client</CardDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Select 
                value={selectedYear} 
                onValueChange={setSelectedYear}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
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
        <CardContent className="px-4">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={revenueData} 
                margin={{ 
                  top: 10, 
                  right: 30, 
                  left: 0, 
                  bottom: 20
                }}
              >
                <defs>
                  <linearGradient id="colorMonthlyRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A5FC1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4A5FC1" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => 
                    `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                  }
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Faturamento"]}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  name="Valor"
                  fill="url(#colorMonthlyRevenue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Client Revenue Chart */}
      <Card className="border rounded-xl overflow-hidden">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue by Client</CardTitle>
              <CardDescription>Estimated value per client</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="h-[280px]">
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
                  axisLine={false}
                  tickLine={false} 
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={isMobile ? 90 : 120}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Valor"]}
                  labelFormatter={(label) => `Cliente: ${label}`}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
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
      
      {/* Recent Activities and Users Table */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>Latest client interactions</CardDescription>
          </CardHeader>
          <CardContent className="px-6">
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No recent activities found
                </p>
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 rounded-md border p-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">Company: {activity.company}</p>
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
        
        {/* Users Table - Similar to reference design */}
        <Card className="border rounded-xl overflow-hidden">
          <CardHeader className="px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Users</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  <span>Select All</span>
                </Button>
                <span className="text-xs text-muted-foreground">
                  0 of {usersData.length} selected
                </span>
              </div>
            </div>
            <CardDescription>Manage user accounts</CardDescription>
          </CardHeader>
          <CardContent className="px-4 py-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30px]">
                      <input type="checkbox" className="rounded border-gray-200" />
                    </TableHead>
                    <TableHead>EMAIL ADDRESS</TableHead>
                    <TableHead>PROVIDER</TableHead>
                    <TableHead>CREATED</TableHead>
                    <TableHead>LAST SIGN IN</TableHead>
                    <TableHead>USER ID</TableHead>
                    <TableHead className="w-[30px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-200" />
                      </TableCell>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.provider}</TableCell>
                      <TableCell>{user.created}</TableCell>
                      <TableCell>{user.lastSign}</TableCell>
                      <TableCell>{user.userId}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-muted-foreground">
                0 of {usersData.length} row(s) selected.
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <div className="text-sm text-muted-foreground py-6 border-t mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 Azul-Roxo CRM. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">FAQs</a>
            <a href="#" className="hover:text-foreground">Privacy Policy</a>
            <a href="#" className="hover:text-foreground">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
