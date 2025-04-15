
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, Users, CheckCircle, TrendingUp, LineChart, BarChart as LucideBarChart, Filter } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// Sample data for charts
const revenueData = [
  { name: "Jan", value: 12000 },
  { name: "Fev", value: 15000 },
  { name: "Mar", value: 10000 },
  { name: "Abr", value: 18000 },
  { name: "Mai", value: 22000 },
  { name: "Jun", value: 20000 },
  { name: "Jul", value: 25000 },
];

const clientRevenueData = [
  { name: "Cliente A", value: 25000 },
  { name: "Cliente B", value: 18000 },
  { name: "Cliente C", value: 15000 },
  { name: "Cliente D", value: 12000 },
  { name: "Cliente E", value: 8000 },
  { name: "Outros", value: 22000 },
];

const pipelineData = [
  { name: "Lead", value: 15, color: "#E5E7EB" },
  { name: "Qualificado", value: 10, color: "#93C5FD" },
  { name: "Negociação", value: 8, color: "#4A5FC1" },
  { name: "Fechado", value: 5, color: "#10B981" },
  { name: "Perdido", value: 3, color: "#EF4444" },
];

const COLORS = ["#E5E7EB", "#93C5FD", "#4A5FC1", "#10B981", "#EF4444"];

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState("mensal");

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
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contratos Fechados</CardTitle>
            <CheckCircle className="h-4 w-4 text-azul" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +4 em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-roxo" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              +3 em relação ao mês anterior
            </p>
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
