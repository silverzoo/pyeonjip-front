import React, { useState } from 'react';

function Search({ setEmail, fetchGetOrders, setOrders }) {
    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchKeyword(value);
        setEmail(value);
    };

    return (
        <input
            type="text"
            placeholder="유저 이메일로 검색..."
            value={searchKeyword}
            onChange={handleSearch}
            className="admin-order-search-input"
        />
    );
}

export default Search;
