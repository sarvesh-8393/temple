"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Logo } from "@/components/logo";
import { Button } from "./ui/button";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/poojas", label: "Poojas" },
  { href: "/store", label: "Store" },
  { href: "/donations", label: "Donations" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      {/* This sidebar is now only for mobile view */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 font-headline text-2xl font-bold text-primary">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-primary-foreground">TempleConnect</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                  >
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <Link href="/register-temple" legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === "/register-temple"}
                  >
                    <span>Register Temple</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Link href="/profile" legacyBehavior passHref>
            <SidebarMenuButton tooltip="Profile">
              <User />
              <span>Profile</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6 sticky top-0 z-30">
          <SidebarTrigger className="md:hidden"/>
          <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary mr-4">
             <Logo className="h-8 w-8 text-primary" />
            <span className="text-primary-foreground hidden sm:inline-block">TempleConnect</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="w-full flex-1 flex justify-end items-center gap-4">
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/register-temple">
                <Building className="mr-2 h-4 w-4" />
                Register a Temple
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 cursor-pointer">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userAvatar?.imageUrl} alt="User Avatar" data-ai-hint={userAvatar?.imageHint} />
                    <AvatarFallback>DU</AvatarFallback>
                  </Avatar>
                   <div className="text-right hidden sm:block">
                    <p className="font-semibold text-sm">Devotee User</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
