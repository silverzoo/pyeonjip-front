import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import './ProductAdmin.css';

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
        // API에서 전체 제품 조회
        fetch("http://localhost:8080/api/products/all")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error(error));
    }, []);

    // 제품 체크박스 선택 처리
    const handleCheckboxChange = (id) => {
        setSelectedProducts((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter(productId => productId !== id)
                : [...prevSelected, id]
        );
    };

    // 선택된 제품 일괄 삭제
    const handleBulkDelete = () => {
        console.log('Deleting products with IDs:', selectedProducts);
        setProducts(products.filter(product => !selectedProducts.includes(product.id)));
        setSelectedProducts([]);
    };

    return (
        <div className="admin-product-page container">
            <h1 className="my-4 text-center">상품 관리 페이지</h1>
            {products.length > 0 ? (
                <ProductList
                    products={products}
                    selectedProducts={selectedProducts}
                    handleCheckboxChange={handleCheckboxChange}
                    handleBulkDelete={handleBulkDelete}
                />
            ) : (
                <p>등록된 상품이 없습니다.</p> // 데이터가 없을 때 메시지 표시
            )}
        </div>
    );
}

export default ProductAdmin;
