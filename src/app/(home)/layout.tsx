import { HomeLayout } from "@/modules/home/ui/home-layout";
interface LayoutProps {
    children: React.ReactNode;
}

const layout = ({children} : LayoutProps) => {
  return (
    <div>
        <HomeLayout>
        {children}
        </HomeLayout>
    </div>
  )
}

export default layout