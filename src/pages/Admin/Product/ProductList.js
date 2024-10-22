import React from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance'; // Axios 인스턴스 가져오기

function ProductList({ products, setProducts }) {
    const navigate = useNavigate();

    // 삭제 처리 함수
    const handleDelete = async (productId) => {
        const token = localStorage.getItem('token');
        if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
            try {
                await axiosInstance.delete(`/api/admin/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                alert('상품이 성공적으로 삭제되었습니다.');

                // 삭제 후 전체 상품 목록을 다시 가져오기
                const response = await axiosInstance.get('/api/products/all');
                setProducts(response.data); // 업데이트된 상품 목록으로 상태 설정
            } catch (error) {
                console.error('상품 삭제 중 오류가 발생했습니다:', error);
                alert('상품 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="product-list">
            <h2 className="mb-4">상품 목록</h2>
            {products.length > 0 ? (
                <div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>이름</th>
                            <th>설명</th>
                            <th>카테고리</th>
                            <th>작업</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.name || 'N/A'}</td>
                                <td>{product.description || '설명 없음'}</td>
                                <td>{product.category?.name || '카테고리 없음'}</td>
                                <td>
                                    <button
                                        className="btn-dark-gray me-2"
                                        onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                    >
                                        수정
                                    </button>
                                    <button
                                        className="btn-dark-gray"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button
                        className="btn-black mt-3"
                        onClick={() => navigate('/admin/createproduct')}
                    >
                        상품 생성
                    </button>
                </div>
            ) : (
                <p className="text-muted">상품이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductList;
