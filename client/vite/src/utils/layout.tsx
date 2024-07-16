import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import SearchBar from "../components/SearchBar";
import UserList from "../components/UserList";

const layout = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query: string) => {
    fetch(`/api/search/searchquery/?q=${query}`)
      .then((response: any) => {
        setSearchResults(response.data);
      })
      .catch((error: any) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex mx-auto">
      <div className="z-50">
        <Sidebar />
      </div>
      <div className="ml-16 lg:ml-96 w-full z-10 ">
        <SearchBar handleSearch={handleSearch} />
        <br />
        <UserList users={searchResults} />

        <Outlet />
      </div>
    </div>
  );
};

export default layout;
