import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import {toast} from "react-toastify"; // Axios 인스턴스 가져오기

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

        const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기
        axiosInstance.post(`/api/admin/products/${productId}/details`, option, {
            headers: {
                'Authorization': `Bearer ${token}`, // Authorization 헤더 추가
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                toast.success('옵션이 성공적으로 추가되었습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });
                navigate(`/admin/edit-product/${productId}`); // 옵션 목록 페이지로 이동
            })
            .catch(error => {
                console.error('옵션 추가 중 오류가 발생했습니다:', error);
                toast.error('옵션 추가 중 오류가 발생했습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });

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
                    <label>메인 이미지:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mainImage"
                        value={option.mainImage}
                        onChange={handleChange}
                    />
                </div>
                <div className="text-end"> {/* 버튼을 오른쪽으로 정렬하기 위한 클래스 추가 */}
                    <button type="submit" className="btn btn-secondary">옵션 추가</button> {/* 스타일 통일 */}
                </div>
            </form>
        </div>
    );
}

export default ProductDetailCreate;
