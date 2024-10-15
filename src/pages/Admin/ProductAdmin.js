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
        const promises = selectedProducts.map(id =>
            fetch(`http://localhost:8080/api/products/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product with ID ' + id);
                }
                return response;
            })
        );

        // 모든 삭제 요청이 성공한 후 상태 업데이트
        Promise.all(promises)
            .then(() => {
                setProducts(products.filter(product => !selectedProducts.includes(product.id)));
                setSelectedProducts([]);
                alert('선택한 제품이 삭제되었습니다.');
            })
            .catch(error => {
                console.error(error);
                alert('제품 삭제 중 오류가 발생했습니다.');
            });
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