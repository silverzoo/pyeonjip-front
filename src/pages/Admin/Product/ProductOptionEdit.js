import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductAdmin.css';

function ProductOptionEdit() {
    const { detailId } = useParams(); // URL에서 detailId(옵션 ID) 가져옴
    const navigate = useNavigate();
    const [option, setOption] = useState({
        name: '',
        price: 0,
        quantity: 0,
        mainImage: ''
    });

    // 옵션 정보 불러오기
    useEffect(() => {
        fetch(`http://localhost:8080/api/products/details/${detailId}`)
            .then(response => response.json())
            .then(data => setOption(data))
            .catch(error => console.error('Error fetching option:', error));
    }, [detailId]);

    // 옵션 정보 수정 함수
    const handleUpdate = () => {
        fetch(`http://localhost:8080/api/products/details/${detailId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(option),
        })
            .then(response => {
                if (response.ok) {
                    navigate('/admin/options'); // 수정 완료 후 목록 페이지로 이동
                } else {
                    console.error('Error updating option');
                }
            })
            .catch(error => console.error('Error updating option:', error));
    };

    return (
        <div className="option-edit-container">
            <h1>옵션 수정</h1>
            <div>
                <label>옵션 이름</label>
                <input
                    type="text"
                    value={option.name}
                    onChange={(e) => setOption({ ...option, name: e.target.value })}
                />
            </div>
            <div>
                <label>가격</label>
                <input
                    type="number"
                    value={option.price}
                    onChange={(e) => setOption({ ...option, price: e.target.value })}
                />
            </div>
            <div>
                <label>수량</label>
                <input
                    type="number"
                    value={option.quantity}
                    onChange={(e) => setOption({ ...option, quantity: e.target.value })}
                />
            </div>
            {/* 메인 이미지 수정 */}
            <div>
                <label>메인 이미지</label>
                <input
                    type="text"
                    value={option.mainImage}
                    onChange={(e) => setOption({ ...option, mainImage: e.target.value })}
                />
            </div>
            <button onClick={handleUpdate}>수정 완료</button>
        </div>
    );
}

export default ProductOptionEdit;