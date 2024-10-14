import React, { useState } from 'react';
import './Search.css';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchOption, setSearchOption] = useState('name');

    const handleSearch = () => {
        console.log(`Searching for ${searchTerm} by ${searchOption}`);
    };

    return (
        <div className="search-container">
            <select value={searchOption} onChange={(e) => setSearchOption(e.target.value)}>
                <option value="">상품명</option>
                <option value="">구매자</option>
                <option value="">카테고리</option>
            </select>
            <input
                type="text"
                placeholder="검색어 입력"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>검색하기</button>
        </div>
    );
};

export default Search;
