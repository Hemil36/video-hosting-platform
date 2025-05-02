import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface ResponsiveModelProps {
    children: React.ReactNode;
    open: boolean;
    title ?: string;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveModel = ({ children, open, title, onOpenChange }: ResponsiveModelProps) => {
    if(useIsMobile()){
        return(
            <Drawer open={open} onOpenChange={onOpenChange} >
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        )
    }

    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
        
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Video</DialogTitle>
            <DialogDescription>
            </DialogDescription>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    )
}