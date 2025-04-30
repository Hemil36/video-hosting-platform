import { StudioLayout } from "@/modules/studio/ui/studio-layout";

interface LayoutProps {
    children: React.ReactNode;
}

const layout = ({children} : LayoutProps) => {
  return (
    <div>
      
        <StudioLayout>
        {children}
        </StudioLayout>

    </div>
  )
}

export default layout