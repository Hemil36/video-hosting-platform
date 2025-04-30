"use client"
import { Button } from "@/components/ui/button";
import { ClapperboardIcon, UserCircle } from "lucide-react";
import {
  UserButton,
  SignInButton,
  SignedOut,
  SignedIn,
} from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";

export const AuthButton = () => {
  return (
    <>
      <SignedIn>
          <UserButton 
            
          >
            <UserButton.MenuItems>
              <UserButton.Link label="Studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
                href="/studio" />
                  
                
            </UserButton.MenuItems>
            </UserButton>
          
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <Button
            variant="outline"
            className="px-4 flex py-2 text-sm font-medium text-blue-600 hover:text-blue-500 focus:border-blue-500 rounded-full"
          >
            <UserCircle className="mr-2" />
            Sign In
          </Button>
        </SignInButton>
      </SignedOut>
    </>
  );
};
