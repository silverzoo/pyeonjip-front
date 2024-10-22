import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import './ProductAdmin.css';
import axiosInstance from "../../../utils/axiosInstance";

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
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/api/category');
                console.log("Fetched categories:", response.data); // 대카테고리 데이터 확인용 로그
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // 전체 상품 조회 useEffect
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const response = await axiosInstance.get('/api/products/all');
                console.log("Fetched all products:", response.data); // 전체 상품 데이터 확인용 로그
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching all products:", error);
            }
        };

        if (!selectedCategory) {
            fetchAllProducts();
        }
    }, [selectedCategory]);

    // 카테고리 선택 시 해당 카테고리의 하위 카테고리 상품을 불러오는 useEffect 추가
    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                if (selectedCategory) {
                    const categoryResponse = await axiosInstance.get(`/api/category?categoryIds=${selectedCategory}`);
                    const categoryIds = categoryResponse.data;

                    const queryParams = categoryIds.map(id => `categoryIds=${id}`).join('&');
                    const productResponse = await axiosInstance.get(`/api/products/categories?${queryParams}`);
                    const products = productResponse.data;

                    setProducts(products);
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