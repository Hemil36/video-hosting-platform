import { CategorySection } from "./categorySection";

interface HomeViewProps {
    categoryId?: string;
}

export const HomeView = ({categoryId}  : HomeViewProps) => {
    return (
        <div className="max-w-full px-4 py-2  mx-auto mb-4 flex flex-col gap-y-6">
            <CategorySection categoryId={categoryId} />
        </div>
    );
}