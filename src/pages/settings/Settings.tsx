
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    theme: "light",
    language: "pt-BR",
    notifications: true,
    emailNotifications: true,
    desktopNotifications: false,
    autoSave: true
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Personalize o Azul-Roxo CRM de acordo com suas preferências
        </p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Personalize as configurações gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <Select
                    value={generalSettings.theme}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, theme: value })}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Selecione um tema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Claro</SelectItem>
                      <SelectItem value="dark">Escuro</SelectItem>
                      <SelectItem value="system">Sistema</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select
                    value={generalSettings.language}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, language: value })}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Selecione um idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-save"
                  checked={generalSettings.autoSave}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, autoSave: checked })}
                />
                <Label htmlFor="auto-save">Salvar automaticamente</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading}
                className="bg-azul hover:bg-azul-light"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>
                Controle como e quando você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Todas as notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar ou desativar todas as notificações
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={generalSettings.notifications}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, notifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Notificações por e-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por e-mail
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={generalSettings.emailNotifications}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, emailNotifications: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="desktop-notifications">Notificações desktop</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações no desktop
                  </p>
                </div>
                <Switch
                  id="desktop-notifications"
                  checked={generalSettings.desktopNotifications}
                  onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, desktopNotifications: checked })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSaveSettings} 
                disabled={isLoading}
                className="bg-azul hover:bg-azul-light"
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie suas configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para alterar sua senha, clique no botão abaixo e siga as instruções.
                </p>
                <Button variant="outline">Alterar senha</Button>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium">Verificação em duas etapas</p>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta.
                </p>
                <Button>Configurar verificação em duas etapas</Button>
              </div>
              
              <div className="space-y-4">
                <p className="font-medium">Sessões ativas</p>
                <p className="text-sm text-muted-foreground">
                  Estas são as sessões atualmente logadas em sua conta.
                </p>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Chrome em Windows 10</p>
                          <p className="text-sm text-muted-foreground">São Paulo, Brasil · Ativo agora</p>
                        </div>
                        <Button variant="ghost" size="sm">Encerrar</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">iPhone 13 Pro</p>
                          <p className="text-sm text-muted-foreground">São Paulo, Brasil · Última atividade: 2h atrás</p>
                        </div>
                        <Button variant="ghost" size="sm">Encerrar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
