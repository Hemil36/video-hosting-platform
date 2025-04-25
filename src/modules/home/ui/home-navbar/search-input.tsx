import { SearchIcon } from "lucide-react";

export const SearchInput = () => {
    return (
        <div className="flex w-full items-center ">
            <div className="relative w-full">

                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-gray-300 rounded-md pl-4 py-2 pr-12 rounded-l-full focus:outline-none  focus:border-blue-500"
                />
            </div>
                <button type="submit" className="px-5 py-2.5 flex-shrink-0 justify-center bg-gray-100 border flex gap-2 border-l-0 rounded-r-full hover:bg-gray-200 disabled:opacity:50 disabled:cursor-not-allowed">
                    <SearchIcon className=" size-5" />
                </button>
        </div>
    );
}