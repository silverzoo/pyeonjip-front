import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'; // Axios 인스턴스 가져오기
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
        const fetchOption = async () => {
            try {
                const response = await axiosInstance.get(`/api/products/details/${detailId}`); // 환경 변수 사용
                setOption(response.data);
            } catch (error) {
                console.error('Error fetching option:', error);
            }
        };

        fetchOption();
    }, [detailId]);

    // 옵션 정보 수정 함수
    const handleUpdate = async () => {
        const token = localStorage.getItem('token'); // 저장된 JWT 토큰 가져오기

        try {
            const response = await axiosInstance.put(`/api/admin/products/details/${detailId}`, option, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Authorization 헤더 추가
                },
            });

            if (response.status === 200) {
                navigate(-1); // 이전 페이지로 이동
            } else {
                console.error('Error updating option', response.status);
                alert('옵션 업데이트 중 오류가 발생했습니다.'); // 사용자에게 알림
            }
        } catch (error) {
            console.error('Error updating option:', error);
            alert('옵션 업데이트 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="container option-edit-container my-4">
            <h1 className="mb-4">옵션 수정</h1>
            <div className="form-group">
                <label>옵션 이름</label>
                <input
                    type="text"
                    className="form-control"
                    value={option.name}
                    onChange={(e) => setOption({ ...option, name: e.target.value })}
                />
            </div>
            <div className="form-group">
                <label>가격</label>
                <input
                    type="number"
                    className="form-control"
                    value={option.price}
                    onChange={(e) => setOption({ ...option, price: parseFloat(e.target.value) })}
                />
            </div>
            <div className="form-group">
                <label>수량</label>
                <input
                    type="number"
                    className="form-control"
                    value={option.quantity}
                    onChange={(e) => setOption({ ...option, quantity: parseInt(e.target.value, 10) })}
                />
            </div>
            <div className="form-group">
                <label>메인 이미지</label>
                <input
                    type="text"
                    className="form-control"
                    value={option.mainImage}
                    onChange={(e) => setOption({ ...option, mainImage: e.target.value })}
                />
            </div>
            <div className="text-end"> {/* 버튼을 오른쪽으로 정렬하기 위한 클래스 추가 */}
                <button className="btn btn-secondary mt-3" onClick={handleUpdate}>수정 완료</button> {/* 스타일 통일 */}
            </div>
        </div>
    );
}

export default ProductOptionEdit;
