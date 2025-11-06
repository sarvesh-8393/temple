"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building,
  LogOut,
  Settings,
  User,
  Menu,
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
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-30">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary mr-4">
             <Logo className="h-8 w-8 text-primary" />
            <span className="text-primary-foreground hidden sm:inline-block">TempleConnect</span>
          </Link>
          {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={`transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </Link>
            ))}
        </nav>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo className="h-8 w-8 text-primary" />
                <span className="sr-only">TempleConnect</span>
              </Link>
              {navItems.map((item) => (
                 <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                 </Link>
              ))}
              <Link href="/register-temple" className={`transition-colors hover:text-primary ${pathname === '/register-temple' ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>
                Register Temple
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

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
      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
