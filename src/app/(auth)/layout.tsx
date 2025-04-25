interface AuthLayoutProps {
    children: React.ReactNode;
}

const layout = ({children} : AuthLayoutProps)=>{
    return (
        <div className="w-full ">
            <div className="flex-1 justify-center min-h-screen flex items-center bg-gray-100 dark:bg-gray-900">
                {children}
            </div>
        </div>
    )
}

export default layout;