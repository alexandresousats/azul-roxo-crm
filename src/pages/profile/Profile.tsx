
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: "Usuário Demo",
    email: "usuario@demo.com",
    jobTitle: "Gerente de Projetos",
    company: "Azul-Roxo CRM",
    phone: "(11) 99999-9999"
  });

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Perfil</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome completo
              </label>
              <Input
                id="name"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                placeholder="seu@email.com"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Para alterar seu email, entre em contato com o suporte
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-medium">
                  Cargo
                </label>
                <Input
                  id="jobTitle"
                  value={userData.jobTitle}
                  onChange={(e) => setUserData({ ...userData, jobTitle: e.target.value })}
                  placeholder="Seu cargo"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Empresa
                </label>
                <Input
                  id="company"
                  value={userData.company}
                  onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                  placeholder="Sua empresa"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Telefone
              </label>
              <Input
                id="phone"
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-azul hover:bg-azul-light"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
            <CardDescription>
              Atualize sua foto de perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-4xl bg-gradient-to-br from-azul to-roxo text-white">
                UD
              </AvatarFallback>
            </Avatar>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                Remover
              </Button>
              <Button className="bg-roxo hover:bg-roxo-light" size="sm">
                Upload
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Formatos permitidos: JPG, PNG. Tamanho máximo 1MB.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
