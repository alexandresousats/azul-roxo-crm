import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, Moon, Settings, User } from "lucide-react";
import { toast } from "sonner";
const Header = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // This will be replaced with actual Supabase logout after integration
    toast.success("Logout realizado com sucesso");
    navigate("/auth/login");
  };
  return <header className="sticky top-0 z-30 w-full bg-white border-b">
      <div className="flex h-14 items-center justify-end px-4">
        
      </div>
    </header>;
};
export default Header;