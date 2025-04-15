
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-0 top-20 transform translate-x-1/2 z-10 bg-background border shadow-sm rounded-full"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">
            <span className="text-azul">Azul</span>-
            <span className="text-roxo">Roxo</span>
          </h2>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/dashboard") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <LayoutDashboard className={cn("h-5 w-5", isActive("/dashboard") ? "text-azul" : "")} />
            {!collapsed && <span>Dashboard</span>}
          </Link>
          <Link
            to="/clientes"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/clientes") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <Users className={cn("h-5 w-5", isActive("/clientes") ? "text-roxo" : "")} />
            {!collapsed && <span>Clientes</span>}
          </Link>
          <Link
            to="/tarefas"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/tarefas") 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            )}
          >
            <CheckSquare className={cn("h-5 w-5", isActive("/tarefas") ? "text-azul" : "")} />
            {!collapsed && <span>Tarefas</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
