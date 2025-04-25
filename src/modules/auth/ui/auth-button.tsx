import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export const AuthButton = () => {
    return (
        <Button variant="outline" className="px—4 flex  py-2 text-sm font—medium text-blue—600 hover:text-blue—500 focus:border-blue-500 rounded-full ">
            <UserCircle className="mr-2" />
           Sign In
            </Button>
    )
}