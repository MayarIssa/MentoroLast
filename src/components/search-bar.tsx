import { SearchIcon } from "lucide-react";

const SearchBar = () => {
    return (
        <div className="shadow rounded-full px-4 py-1 w-8/12 bg-brand-50 flex  items-center mx-16">
            <SearchIcon className="stroke-black stroke-[3px] flex-shrink-0" />
            <input
                className=" flex-1 px-4 py-2 outline-none border-none bg-transparent"
                placeholder="What do you want to learn?"
            />
        </div>
    );
};

export default SearchBar;
