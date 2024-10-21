import React, {useState} from 'react';

function Search({ setEmail, fetchGetOrders }) {
    // const handleSearch = (event) => {
    //     setEmail(event.target.value);
    // };

    const [searchKeyword, setSearchKeyword] = useState('');

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchKeyword(value);
        setEmail(value);

        // API 호출
        await fetchGetOrders(value);
    };


    return (
        <input
            type="text"
            placeholder="유저 이메일로 검색..."
            value={searchKeyword}
            onChange={handleSearch}
            style={{marginBottom: '40px'}}
            className="admin-order-search-input"
        />
    );
}

export default Search;
