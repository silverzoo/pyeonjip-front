import React from 'react';

function Search({ setEmail }) {
    const handleSearch = (event) => {
        setEmail(event.target.value);
    };

    return (
        <input
            type="text"
            placeholder="유저 이메일로 검색..."
            onChange={handleSearch}
            style={{marginBottom: '40px'}}
            className="admin-order-search-input"
        />
    );
}

export default Search;
