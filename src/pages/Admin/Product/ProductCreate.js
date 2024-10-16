import React, { useState, useEffect } from 'react';
import './ProductAdmin.css';

function CreateProduct() {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [options, setOptions] = useState([{ name: '', price: '', quantity: '', imageUrl: '' }]);
    const [productImages, setProductImages] = useState([{ imageUrl: '' }]); // 상품 이미지 관리

    // 옵션 필드의 값 변경을 처리하는 함수
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index][field] = value;
        setOptions(newOptions);
        console.log("Updated options:", newOptions); // 상태 로그 추가
    };

    // 이미지 필드의 값 변경을 처리하는 함수
    const handleImageChange = (index, value) => {
        const newImages = [...productImages];
        newImages[index].imageUrl = value;
        setProductImages(newImages);
        console.log("Updated images:", newImages); // 상태 로그 추가
    };

    // 옵션 추가
    const addOption = () => {
        setOptions([...options, { name: '', price: '', quantity: '', imageUrl: '' }]);
    };

    // 이미지 추가
    const addImage = () => {
        setProductImages([...productImages, { imageUrl: '' }]);
    };

    // 옵션 삭제
    const removeOption = (index) => {
        const newOptions = options.filter((_, idx) => idx !== index);
        setOptions(newOptions);
    };

    // 이미지 삭제
    const removeImage = (index) => {
        const newImages = productImages.filter((_, idx) => idx !== index);
        setProductImages(newImages);
    };

    // 데이터베이스에서 카테고리 목록을 가져오는 함수
    useEffect(() => {
        fetch("http://localhost:8080/api/category")
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('카테고리 불러오기 실패:', error));
    }, []);

    // 폼 제출 처리
    const handleSubmit = (event) => {
        event.preventDefault();

        // 상품 데이터 객체 생성
        const productData = {
            name: productName,
            description: productDescription,
            categoryId: category,
            productDetails: options.length > 0 ? options.map(option => ({
                name: option.name,
                price: option.price,
                quantity: option.quantity,
                mainImage: option.imageUrl
            })) : [], // 옵션이 없으면 빈 배열로 처리
            productImages: productImages.length > 0 ? productImages.map(image => ({
                imageUrl: image.imageUrl
            })) : [] // 이미지가 없으면 빈 배열로 처리
        };

        console.log("Submitting product data:", productData); // 제출 전 상태 확인

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

                <div className="form-group">
                    <label>카테고리:</label>
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
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

                <h3>상품 이미지</h3>
                {productImages.map((image, index) => (
                    <div key={index} className="form-group">
                        <label>이미지 {index + 1}</label>
                        <input
                            type="text"
                            placeholder="이미지 URL"
                            value={image.imageUrl}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            required
                            className="form-control"
                        />
                        <button type="button" onClick={() => removeImage(index)} className="btn btn-danger">이미지 삭제</button>
                    </div>
                ))}

                <button type="button" onClick={addImage} className="btn btn-primary">이미지 추가</button>

                <button type="button" onClick={addOption} className="btn btn-primary">옵션 추가</button>

                <div>
                    <button type="submit" className="btn btn-success mt-4">상품 생성</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProduct;