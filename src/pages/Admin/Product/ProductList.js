import React from 'react';
import ProductItem from './ProductItem';

function ProductList({ products, selectedProducts, handleCheckboxChange, handleBulkDelete }) {
    return (
        <div className="product-list">
            <h2 className="mb-4">상품 목록</h2>
            {products.length > 0 ? (
                <div>
                    <ul className="list-group">
                        {products.map(product => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                isSelected={selectedProducts.includes(product.id)}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                    </ul>
                    <button
                        className="btn-black mt-3"
                        onClick={handleBulkDelete}
                        disabled={selectedProducts.length === 0}
                    >
                        선택된 상품 삭제
                    </button>
                </div>
            ) : (
                <p className="text-muted">상품이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductList;
