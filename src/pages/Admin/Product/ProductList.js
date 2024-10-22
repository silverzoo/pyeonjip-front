import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProductList({ products, selectedProducts, handleCheckboxChange, handleBulkDelete }) {
    const navigate = useNavigate();

    return (
        <div className="product-list">
            <h2 className="mb-4">상품 목록</h2>
            {products.length > 0 ? (
                <div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>선택</th>
                            <th>이름</th>
                            <th>수정</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => handleCheckboxChange(product.id)}
                                    />
                                </td>
                                <td>{product.name || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn-dark-gray"
                                        onClick={() => navigate(`/admin/edit-product/${product.id}`)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <button
                        className="btn-black mt-3"
                        onClick={handleBulkDelete}
                        disabled={selectedProducts.length === 0}
                    >
                        선택된 상품 삭제
                    </button>
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