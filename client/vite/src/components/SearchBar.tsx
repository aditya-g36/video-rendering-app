import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  handleSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ handleSearch }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    handleSearch(inputValue);
  };

  const ResultHandeler = () => {
    navigate(`search/${query}`);
  };

  return (
    <div className="flex justify-center pt-2 ml-7 sticky top-0">
      <form onSubmit={ResultHandeler} className="relative ">
        <input
          type="text"
          placeholder="Search"
          className="py-2 pr-4 pl-4 rounded-full w-80 bg-gray-100 bg-zinc-800	text-white focus:outline-none focus:ring-0 focus:border-transparent "
          value={query}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default SearchBar;
