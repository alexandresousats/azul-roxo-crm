import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, Users, CheckCircle, TrendingUp, LineChart, BarChart as LucideBarChart, Filter } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { extractNumberFromCurrency } from "@/utils/format";

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("mensal");
  const { user } = useAuth();

  const { data: clientesData = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user?.id);
      return data || [];
    },
    enabled: !!user
  });

  const clientesAtivos = clientesData.length;
  const contratosFechados = clientesData.filter(cliente => cliente.status === 'fechado').length;
  const valorTotal = clientesData
    .filter(cliente => cliente.status === 'fechado')
    .reduce((acc, cliente) => acc + (extractNumberFromCurrency(cliente.valor_estimado) || 0), 0);

  const pipelineData = [
    { name: "Lead", value: clientesData.filter(c => c.status === 'lead').length, color: "#E5E7EB" },
    { name: "Qualificado", value: clientesData.filter(c => c.status === 'qualificado').length, color: "#93C5FD" },
    { name: "Negociação", value: clientesData.filter(c => c.status === 'negociacao').length, color: "#4A5FC1" },
    { name: "Fechado", value: clientesData.filter(c => c.status === 'fechado').length, color: "#10B981" },
    { name: "Perdido", value: clientesData.filter(c => c.status === 'perdido').length, color: "#EF4444" },
  ];

  const revenueData = [
    { name: "Jan", value: 0 },
    { name: "Fev", value: 0 },
    { name: "Mar", value: 0 },
    { name: "Abr", value: 0 },
    { name: "Mai", value: 0 },
    { name: "Jun", value: 0 },
    { name: "Jul", value: 0 },
    { name: "Ago", value: 0 },
    { name: "Set", value: 0 },
    { name: "Out", value: 0 },
    { name: "Nov", value: 0 },
    { name: "Dez", value: 0 },
  ];

  const clientRevenueData = clientesData
    .filter(cliente => cliente.status === 'fechado')
    .slice(0, 5)
    .map(cliente => ({
      name: cliente.empresa || cliente.nome,
      value: extractNumberFromCurrency(cliente.valor_estimado)
    }));

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
            <CheckCircle className="h-4 w-4 text-azul" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contratosFechados}</div>
            <p className="text-xs text-muted-foreground">Total de contratos</p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-roxo" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesAtivos}</div>
            <p className="text-xs text-muted-foreground">Total de clientes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="faturamento" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
            <TabsTrigger value="clientes">Faturamento por Cliente</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline de Vendas</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className={timeFilter === "semanal" ? "bg-muted" : ""}
              onClick={() => setTimeFilter("semanal")}
            >
              Semanal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={timeFilter === "mensal" ? "bg-muted" : ""}
              onClick={() => setTimeFilter("mensal")}
            >
              Mensal
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className={timeFilter === "anual" ? "bg-muted" : ""}
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
                <LineChart className="h-5 w-5 text-azul" />
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
                    data={revenueData} 
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4A5FC1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4A5FC1" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, "Faturamento"]}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4A5FC1" 
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
                <LucideBarChart className="h-5 w-5 text-roxo" />
                <span>Faturamento por Cliente</span>
              </CardTitle>
              <CardDescription>
                Distribuição do faturamento entre os principais clientes
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clientRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`R$ ${value}`, "Faturamento"]}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Faturamento" fill="#7E57C2" radius={[4, 4, 0, 0]} />
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
                <Filter className="h-5 w-5 text-azul" />
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
                      data={pipelineData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mt-4">
                {pipelineData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium">{item.name}</span>
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
