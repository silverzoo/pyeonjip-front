import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ProductDetailCreate() {
    const { productId } = useParams(); // URL에서 productId를 가져옴
    const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수
    const [option, setOption] = useState({
        name: '',
        price: 0,
        quantity: 0,
        mainImage: ''
    });

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOption({
            ...option,
            [name]: value
        });
    };

    // 폼 제출 핸들러 (옵션 추가)
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/products/${productId}/details`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(option),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('옵션 추가 실패');
            }
            return response.json();
        })
        .then(data => {
            alert('옵션이 성공적으로 추가되었습니다.');
            navigate(`/admin/edit-product/${productId}`); // 옵션 목록 페이지로 이동
        })
        .catch(error => {
            console.error(error);
            alert('옵션 추가 중 오류가 발생했습니다.');
        });
    };

    return (
        <div className="container">
            <h2>옵션 추가</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>옵션 이름:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={option.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>옵션 가격:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={option.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>옵션 수량:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={option.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>옵션 이미지 URL:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mainImage"
                        value={option.mainImage}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">옵션 추가</button>
            </form>
        </div>
    );
}

export default ProductDetailCreate;