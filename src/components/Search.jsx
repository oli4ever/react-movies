import React from "react";

const Search = ({ searchTerm, setSearchTerm, isTyping }) => {
  return (
    <div className="search">
      <div>
        <img src="/Search.png" alt="search" />
        <input
          type="text"
          placeholder="Launch Your Search Across Endless Movie Options"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isTyping && <span>Typing...</span>}
      </div>
    </div>
  );
};

export default Search;
