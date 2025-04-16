
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, Users, CheckCircle, TrendingUp, LineChart, BarChart as LucideBarChart, Filter } from "lucide-react";
import { 
  Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, 
  Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractNumberFromCurrency } from "@/utils/format";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("mensal");
  const { user } = useAuth();
  const isMobile = useIsMobile();

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

  // Calculate dashboard metrics
  const clientesAtivos = clientesData.length;
  const contratosFechados = clientesData.filter(cliente => cliente.status === 'fechado').length;
  const valorTotal = clientesData
    .filter(cliente => cliente.status === 'fechado')
    .reduce((acc, cliente) => acc + extractNumberFromCurrency(cliente.valor_estimado || "R$ 0"), 0);

  // Prepare pipeline data
  const pipelineData = useMemo(() => [
    { name: "Lead", value: clientesData.filter(c => c.status === 'lead').length, color: "#E5E7EB" },
    { name: "Qualificado", value: clientesData.filter(c => c.status === 'qualificado').length, color: "#93C5FD" },
    { name: "Negociação", value: clientesData.filter(c => c.status === 'negociacao').length, color: "#6366F1" },
    { name: "Fechado", value: clientesData.filter(c => c.status === 'fechado').length, color: "#10B981" },
    { name: "Perdido", value: clientesData.filter(c => c.status === 'perdido').length, color: "#EF4444" },
  ], [clientesData]);

  // Create sample monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    // Get current month
    const currentMonth = new Date().getMonth();
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    
    // Generate sample data based on current month
    return monthNames.map((month, index) => {
      // For months in the past including current month, generate random revenue
      if (index <= currentMonth) {
        const baseValue = Math.floor(Math.random() * 50000) + 10000;
        return { name: month, value: baseValue };
      }
      // For future months, set zero
      return { name: month, value: 0 };
    });
  }, []);

  // Client revenue data - calculate for real clients
  const clientRevenueData = useMemo(() => {
    return clientesData
      .filter(cliente => cliente.status === 'fechado' && cliente.valor_estimado)
      .slice(0, 5)
      .map(cliente => ({
        name: cliente.empresa || cliente.nome,
        value: extractNumberFromCurrency(cliente.valor_estimado || "R$ 0")
      }));
  }, [clientesData]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio e desempenho
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projeção de Ganhos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">Total de contratos fechados</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Fechados</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contratosFechados}</div>
            <p className="text-xs text-muted-foreground">Total de contratos</p>
          </CardContent>
        </Card>
        
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
            <p className="text-xs text-muted-foreground">Total de clientes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faturamento" className="space-y-4">
        <div className={`flex ${isMobile ? 'flex-col' : ''} items-center justify-between gap-4`}>
          <TabsList className={`${isMobile ? 'w-full' : ''}`}>
            <TabsTrigger value="faturamento" className={`${isMobile ? 'flex-1' : ''}`}>Faturamento</TabsTrigger>
            <TabsTrigger value="clientes" className={`${isMobile ? 'flex-1' : ''}`}>Por Cliente</TabsTrigger>
            <TabsTrigger value="pipeline" className={`${isMobile ? 'flex-1' : ''}`}>Pipeline</TabsTrigger>
          </TabsList>
          
          <div className={`flex items-center ${isMobile ? 'w-full' : ''} space-x-2`}>
            <Button 
              variant="outline" 
              size="sm" 
              className={`${timeFilter === "semanal" ? "bg-muted" : ""} ${isMobile ? 'flex-1' : ''}`}
              onClick={() => setTimeFilter("semanal")}
            >
              Semanal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`${timeFilter === "mensal" ? "bg-muted" : ""} ${isMobile ? 'flex-1' : ''}`}
              onClick={() => setTimeFilter("mensal")}
            >
              Mensal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={`${timeFilter === "anual" ? "bg-muted" : ""} ${isMobile ? 'flex-1' : ''}`}
              onClick={() => setTimeFilter("anual")}
            >
              Anual
            </Button>
          </div>
        </div>
        
        <TabsContent value="faturamento" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                <span>Faturamento {timeFilter}</span>
              </CardTitle>
              <CardDescription>
                Evolução do faturamento ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={monthlyRevenueData} 
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
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Faturamento"]}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#6366F1" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          
        <TabsContent value="clientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LucideBarChart className="h-5 w-5 text-purple-500" />
                <span>Faturamento por Cliente</span>
              </CardTitle>
              <CardDescription>
                Distribuição do faturamento entre os principais clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={clientRevenueData.length > 0 ? clientRevenueData : [{ name: 'Sem dados', value: 0 }]}
                    margin={{ 
                      top: 10, 
                      right: 30, 
                      left: isMobile ? 0 : 10, 
                      bottom: 30 
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, "Faturamento"]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Faturamento" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
          
        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-blue-500" />
                <span>Pipeline de Clientes</span>
              </CardTitle>
              <CardDescription>
                Distribuição de clientes por estágio no pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={!isMobile}
                      outerRadius={isMobile ? 80 : 100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={isMobile ? undefined : ({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} clientes`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 mt-4">
                {pipelineData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
