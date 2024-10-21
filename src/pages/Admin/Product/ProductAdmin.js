import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import './ProductAdmin.css';

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(''); // 기본값은 전체 카테고리

    useEffect(() => {
        // 초기 로드 시 전체 상품 조회
        fetch("http://localhost:8080/api/products/all")
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error(error));

        // API에서 카테고리 목록 조회
        fetch("http://localhost:8080/api/category")
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);

    // 카테고리 선택 시 해당 카테고리의 상품을 불러오는 useEffect 추가
    useEffect(() => {
        if (selectedCategory) {
            // 선택된 카테고리에 맞는 상품들 조회
            fetch(`http://localhost:8080/api/products/category/${selectedCategory}`)
                .then(response => response.json())
                .then(data => setProducts(data))
                .catch(error => console.error(error));
        } else {
            // 카테고리가 선택되지 않았을 경우 전체 상품을 다시 불러옴
            fetch("http://localhost:8080/api/products/all")
                .then(response => response.json())
                .then(data => setProducts(data))
                .catch(error => console.error(error));
        }
    }, [selectedCategory]); // selectedCategory가 변경될 때마다 호출

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
            fetch(`http://localhost:8080/api/admin/products/${id}`, {
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

    // 카테고리 선택 시 처리
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div className="admin-product-page container">
            <h1 className="my-4 text-center">상품 관리 페이지</h1>

            {/* 카테고리 선택 토글 */}
            <div className="mb-4">
                <label htmlFor="categorySelect">카테고리 선택:</label>
                <select
                    id="categorySelect"
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">모든 카테고리</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {products.length > 0 ? (
                <ProductList
                    products={products}
                    selectedProducts={selectedProducts}
                    handleCheckboxChange={handleCheckboxChange}
                    handleBulkDelete={handleBulkDelete}
                />
            ) : (
                <p>선택한 카테고리에 해당하는 상품이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductAdmin;