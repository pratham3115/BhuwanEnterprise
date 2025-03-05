import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-wrapper">
      <Search className="search-icon" aria-hidden="true" />
      <input
        type="search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
        aria-label="Search Products"
      />
    </div>
  );
};

export default SearchBar;
