
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const Upgrade = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Upgrade de Conta</h2>
        <p className="text-muted-foreground mt-2">
          Escolha o plano que melhor atende às suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-8">
        <Card className="border-border/50">
          <CardHeader>
            <Badge className="w-fit mb-2">Básico</Badge>
            <CardTitle className="text-2xl">Free</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">R$ 0</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <CardDescription className="mt-2">
              Perfeito para quem está começando e quer explorar as funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Até 10 clientes</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Até 20 tarefas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Dashboard básico</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>1 usuário</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Plano Atual
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-azul shadow-lg relative">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-azul rounded-t-lg" />
          <CardHeader>
            <Badge className="w-fit mb-2 bg-azul hover:bg-azul/80">Pro</Badge>
            <CardTitle className="text-2xl">Profissional</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">R$ 49</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <CardDescription className="mt-2">
              Ideal para profissionais que precisam de mais recursos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Clientes ilimitados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Tarefas ilimitadas</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Dashboard completo</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>5 usuários</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Exportação de relatórios</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Integrações com apps</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-azul hover:bg-azul-light">
              Fazer Upgrade
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-roxo shadow-lg relative">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-roxo rounded-t-lg" />
          <CardHeader>
            <Badge className="w-fit mb-2 bg-roxo hover:bg-roxo/80">Enterprise</Badge>
            <CardTitle className="text-2xl">Empresarial</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold">R$ 99</span>
              <span className="text-muted-foreground">/mês</span>
            </div>
            <CardDescription className="mt-2">
              Para empresas que precisam de funcionalidades avançadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Tudo do plano Profissional</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Usuários ilimitados</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>API dedicada</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Suporte 24/7</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Ambiente personalizado</span>
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>Treinamento da equipe</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-roxo hover:bg-roxo-light">
              Contatar Vendas
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Precisa de algo personalizado para sua empresa?{" "}
          <a href="#" className="text-azul hover:underline">
            Entre em contato
          </a>{" "}
          para uma cotação.
        </p>
      </div>
    </div>
  );
};

export default Upgrade;
