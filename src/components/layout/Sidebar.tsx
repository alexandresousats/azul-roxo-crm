
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ChevronRight,
  ChevronLeft,
  Settings,
  MessageSquare,
  ImageIcon,
  FileText,
  RefreshCcw,
  ListTodo,
  History,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);
  const location = useLocation();

  // Auto collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-white transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute z-10 bg-background border shadow-sm rounded-full",
          "top-20 flex items-center justify-center",
          collapsed ? "right-0 translate-x-1/2" : "right-0 translate-x-1/2"
        )}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
      
      <div className="flex h-14 items-center border-b px-4 py-6">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="bg-primary w-8 h-8 rounded-md flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h2 className="text-lg font-bold">
              Horizon AI
            </h2>
          </div>
        ) : (
          <div className="mx-auto bg-primary w-8 h-8 rounded-md flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="grid gap-1">
          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/dashboard") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            {!collapsed && <span>Main Dashboard</span>}
          </Link>
          
          <Link
            to="/clientes"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/clientes") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Users className="h-5 w-5" />
            {!collapsed && <span>AI Assistant</span>}
          </Link>
          
          <Link
            to="/tarefas"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/tarefas") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            {!collapsed && <span>AI Chat UI</span>}
          </Link>
          
          <Link
            to="/profile"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/profile") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <FileText className="h-5 w-5" />
            {!collapsed && <span>AI Text Generator</span>}
          </Link>
          
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/settings") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <ImageIcon className="h-5 w-5" />
            {!collapsed && <span>AI Image Generator</span>}
          </Link>
          
          <Link
            to="/upgrade"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/upgrade") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <FileText className="h-5 w-5" />
            {!collapsed && <span>AI Text to Speech</span>}
          </Link>
          
          <Separator className="my-4" />
          
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-slate-500 mb-2">MANAGEMENT</p>
          )}
          
          <Link
            to="/users"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/users") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Users className="h-5 w-5" />
            {!collapsed && <span>Users List</span>}
          </Link>
          
          <Link
            to="/profile-settings"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/profile-settings") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span>Profile Settings</span>}
          </Link>
          
          <Link
            to="/subscription"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/subscription") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <RefreshCcw className="h-5 w-5" />
            {!collapsed && <span>Subscription</span>}
          </Link>
          
          <Link
            to="/history"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/history") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <History className="h-5 w-5" />
            {!collapsed && <span>History</span>}
          </Link>
          
          <Link
            to="/authentication"
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              isActive("/authentication") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50"
            )}
          >
            <Lock className="h-5 w-5" />
            {!collapsed && <span>Authentication</span>}
          </Link>
        </nav>
      </div>
      
      {!collapsed && (
        <div className="border-t p-4">
          <div className="bg-slate-50 rounded-lg p-3 flex gap-3 items-center">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold">
              AP
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">PRO Member</p>
              <p className="text-xs text-slate-400">Unlimited plan active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
