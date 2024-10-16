import React, { useState } from 'react';
import './ProductAdmin.css';

function CreateProduct() {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [options, setOptions] = useState([{ name: '', price: '', quantity: '', imageUrl: '' }]);

    // 옵션 필드의 값 변경을 처리하는 함수
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
    };

    // 옵션 추가
    const addOption = () => {
        setOptions([...options, { name: '', price: '', quantity: '', imageUrl: '' }]);
    };

    // 옵션 삭제
    const removeOption = (index) => {
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    };

    // 폼 제출 처리
    const handleSubmit = (event) => {
        event.preventDefault();
        const productData = {
            name: productName,
            description: productDescription,
            productDetails: options.map(option => ({
                name: option.name,
                price: option.price,
                quantity: option.quantity,
                mainImage: option.imageUrl
            }))
        };

        // 상품 생성 요청
        fetch("http://localhost:8080/api/products", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('상품 생성 실패');
            }
            return response.json();
        })
        .then(data => {
            alert('상품이 성공적으로 생성되었습니다.');
        })
        .catch(error => {
            console.error(error);
            alert('상품 생성 중 오류가 발생했습니다.');
        });
    };

    return (
        <div className="container">
            <h2>신규 상품 생성</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>상품 이름:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>상품 설명:</label>
                    <textarea
                        className="form-control"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                </div>

                <h3>상품 옵션</h3>
                {options.map((option, index) => (
                    <div key={index} className="form-group">
                        <label>옵션 {index + 1}</label>
                        <input
                            type="text"
                            placeholder="옵션 이름"
                            value={option.name}
                            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                            required
                            className="form-control"
                        />
                        <input
                            type="number"
                            placeholder="옵션 가격"
                            value={option.price}
                            onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                            required
                            className="form-control"
                        />
                        <input
                            type="number"
                            placeholder="옵션 재고"
                            value={option.quantity}
                            onChange={(e) => handleOptionChange(index, 'quantity', e.target.value)}
                            required
                            className="form-control"
                        />
                        <input
                            type="text"
                            placeholder="이미지 URL"
                            value={option.imageUrl}
                            onChange={(e) => handleOptionChange(index, 'imageUrl', e.target.value)}
                            className="form-control"
                        />
                        <button type="button" onClick={() => removeOption(index)} className="btn btn-danger">옵션 삭제</button>
                    </div>
                ))}

                <button type="button" onClick={addOption} className="btn btn-primary">옵션 추가</button>

                <div>
                    <button type="submit" className="btn btn-success mt-4">상품 생성</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProduct;  // CreateProduct 컴포넌트를 export