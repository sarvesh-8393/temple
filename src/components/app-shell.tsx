
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building,
  LogOut,
  Settings,
  User,
  Menu,
  LogIn,
  UserPlus,
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
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar-1");

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/poojas", label: "Poojas" },
  { href: "/store", label: "Store" },
  { href: "/donations", label: "Donations" },
];

const publicPages = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // If loading is finished and there's no user, redirect to login page
    // unless they are already on a public page.
    if (!isUserLoading && !user && !publicPages.includes(pathname)) {
      router.push("/login");
    }
  }, [user, isUserLoading, pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };
  
  // While loading authentication state, show a simplified shell or a loading indicator.
  // This prevents a "flash" of the logged-in or logged-out UI.
  if (isUserLoading && !publicPages.includes(pathname)) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 z-30">
          <Skeleton className="h-8 w-36" />
          <div className="flex-1 flex justify-end">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-8">
            <Skeleton className="h-screen w-full"/>
        </main>
      </div>
    );
  }

  // If the user is unauthenticated and on a public page, don't render the AppShell.
  if (!user && publicPages.includes(pathname)) {
    return <>{children}</>;
  }


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
              {user && navItems.map((item) => (
                 <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={`transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'}`}>
                    {item.label}
                 </Link>
              ))}
              {user && <Link href="/register-temple" className={`transition-colors hover:text-primary ${pathname === '/register-temple' ? 'text-primary' : 'text-muted-foreground'}`} onClick={() => setIsMobileMenuOpen(false)}>
                Register Temple
              </Link>}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="w-full flex-1 flex justify-end items-center gap-4">
            {user ? (
                <>
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
                        <AvatarImage src={user.photoURL || ''} alt="User Avatar" />
                        <AvatarFallback>
                          {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                        </Avatar>
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
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
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </>
            ) : (
                <div className="flex items-center gap-2">
                     <Button asChild variant="ghost">
                        <Link href="/login"><LogIn className="mr-2 h-4 w-4"/>Log In</Link>

                    </Button>
                    <Button asChild>
                        <Link href="/signup"><UserPlus className="mr-2 h-4 w-4"/>Sign Up</Link>
                    </Button>
                </div>
            )}
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
