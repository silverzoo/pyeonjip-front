import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // useParams import 추가
import OptionList from './ProductOptionList';  // OptionList 컴포넌트 import
import './ProductAdmin.css';

function ProductOptionAdmin() {
    const { productId } = useParams();  // URL에서 productId 가져오기
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // 옵션 리스트를 API에서 불러오는 함수
    useEffect(() => {
        // productId가 존재할 때만 API 호출
        if (productId) {
            fetch(`http://localhost:8080/api/products/${productId}/details`)
                .then(response => response.json())
                .then(data => setOptions(data))
                .catch(error => console.error('Error fetching options:', error));
        }
    }, [productId]);  // productId가 변경될 때마다 호출

    // 체크박스 선택/해제 처리 함수
    const handleCheckboxChange = (id) => {
        setSelectedOptions(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(optionId => optionId !== id)
                : [...prevSelected, id]
        );
    };

    // 선택된 옵션 일괄 삭제 함수
    const handleBulkDelete = () => {
        console.log('Deleting selected options:', selectedOptions);
        setOptions(options.filter(option => !selectedOptions.includes(option.id)));
        setSelectedOptions([]);
    };

    return (
        <div className="admin-option-page container">
            <h1 className="my-4 text-center">옵션 관리 페이지</h1>
            {options.length > 0 ? (
                <OptionList
                    options={options}
                    selectedOptions={selectedOptions}
                    handleCheckboxChange={handleCheckboxChange}
                    handleBulkDelete={handleBulkDelete}
                />
            ) : (
                <p>등록된 옵션이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductOptionAdmin;