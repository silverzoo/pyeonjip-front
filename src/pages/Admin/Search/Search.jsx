import React, {useEffect, useState} from 'react';

function Search({ setEmail, email }) {
    const [searchKeyword, setSearchKeyword] = useState(email);

    const handleSearch = async (event) => {
        const value = event.target.value;
        setSearchKeyword(value);
        setEmail(value);
    };

    // email이 변경될 때마다 searchKeyword를 업데이트
    useEffect(() => {
        setSearchKeyword(email);
    }, [email]);

    return (
        <input
            type="text"
            placeholder="유저 이메일로 검색..."
            value={searchKeyword} // 여기서 searchKeyword 사용
            onChange={handleSearch}
            className="admin-order-search-input"
        />
    );
}
export default Search;
