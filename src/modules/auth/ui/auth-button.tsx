import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import {
  UserButton,
  SignInButton,
  SignedOut,
  SignedIn,
} from "@clerk/nextjs";

export const AuthButton = () => {
  return (
    <>
      <SignedIn>
        <div className="flex items-center">
          <UserButton 
            
          />
          
        </div>
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
