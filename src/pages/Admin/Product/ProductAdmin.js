import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import './ProductAdmin.css';

function ProductAdmin() {
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        // 카테고리 목록 조회
        fetch("http://localhost:8080/api/category")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched categories:", data); // 카테고리 데이터 확인용 로그
                setCategories(data);
            })
            .catch(error => console.error("Error fetching categories:", error));

        // 전체 상품 조회
        fetch("http://localhost:8080/api/products/all")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched all products:", data); // 전체 상품 데이터 확인용 로그
                setProducts(data);
            })
            .catch(error => console.error("Error fetching all products:", error));
    }, []);

    // 카테고리 선택 시 해당 카테고리의 상품을 불러오는 useEffect 추가
    useEffect(() => {
        const fetchProductsByCategory = () => {
            let url = "http://localhost:8080/api/products/all";
            if (selectedCategory) {
                url = `http://localhost:8080/api/products/category/${selectedCategory}`;
            }

            console.log("Fetching products with URL:", url); // 호출되는 URL 확인용 로그

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Fetched products by category:", data); // 카테고리별 데이터 확인용 로그
                    setProducts(data);
                    setCurrentPage(0);
                })
                .catch(error => console.error("Error fetching products by category:", error));
        };

        fetchProductsByCategory();
    }, [selectedCategory]);

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

        Promise.all(promises)
            .then(() => {
                setProducts(products.filter(product => !selectedProducts.includes(product.id)));
                setSelectedProducts([]);
                alert('선택한 제품이 삭제되었습니다.');
            })
            .catch(error => {
                console.error("Error deleting products:", error);
                alert('제품 삭제 중 오류가 발생했습니다.');
            });
    };

    const paginatedProducts = products.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

    const handleNextPage = () => {
        if ((currentPage + 1) * pageSize < products.length) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="admin-product-page container">
            <h1 className="my-4 text-center">상품 관리 페이지</h1>

            <div className="mb-4">
                <label htmlFor="categorySelect">카테고리 선택:</label>
                <select
                    id="categorySelect"
                    className="form-select"
                    value={selectedCategory}
                    onChange={(event) => {
                        console.log("Category selected:", event.target.value); // 선택된 카테고리 로그
                        setSelectedCategory(event.target.value);
                    }}
                >
                    <option value="">모든 카테고리</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {paginatedProducts.length > 0 ? (
                <>
                    <ProductList
                        products={paginatedProducts}
                        selectedProducts={selectedProducts}
                        handleCheckboxChange={handleCheckboxChange}
                        handleBulkDelete={handleBulkDelete}
                    />
                    <div className="pagination">
                        <button onClick={handlePreviousPage} disabled={currentPage === 0}>이전</button>
                        <span>페이지 {currentPage + 1} / {Math.ceil(products.length / pageSize)}</span>
                        <button onClick={handleNextPage} disabled={(currentPage + 1) * pageSize >= products.length}>다음</button>
                    </div>
                </>
            ) : (
                <p>선택한 카테고리에 해당하는 상품이 없습니다.</p>
            )}
        </div>
    );
}

export default ProductAdmin;