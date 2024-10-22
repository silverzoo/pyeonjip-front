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
    const [hasMore, setHasMore] = useState(true);

    // 대카테고리 목록 조회
    useEffect(() => {
        fetch("http://localhost:8080/api/category")
            .then(response => response.json())
            .then(data => {
                console.log("Fetched categories:", data); // 대카테고리 데이터 확인용 로그
                setCategories(data);
            })
            .catch(error => console.error("Error fetching categories:", error));
    }, []);

    // 전체 상품 조회 useEffect
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/all`);
                const data = await response.json();
                console.log("Fetched all products:", data); // 전체 상품 데이터 확인용 로그
                setProducts(data);
            } catch (error) {
                console.error("Error fetching all products:", error);
            }
        };

        // 카테고리가 선택되지 않은 경우에만 전체 상품을 불러옴
        if (!selectedCategory) {
            fetchAllProducts();
        }
    }, [selectedCategory]);

    // 카테고리 선택 시 해당 카테고리의 하위 카테고리 상품을 불러오는 useEffect 추가
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                if (selectedCategory) {
                    // 상위 카테고리 ID로 하위 카테고리들을 가져옴
                    const categoryResponse = await fetch(`http://localhost:8080/api/category?categoryIds=${selectedCategory}`);
                    const categoryIds = await categoryResponse.json();

                    // 여러 하위 카테고리 ID를 쿼리 파라미터로 변환
                    const queryParams = categoryIds.map(id => `categoryIds=${id}`).join('&');
                    const productResponse = await fetch(`http://localhost:8080/api/products/categories?${queryParams}`);
                    const products = await productResponse.json();

                    // 상품 목록을 업데이트
                    setProducts(products);
                    setHasMore(false); // 상품이 모두 로드되었다고 가정
                }
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };

        if (selectedCategory) {
            fetchProductsByCategory();
        }
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
                        setCurrentPage(0); // 카테고리 선택 시 페이지를 0으로 초기화
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