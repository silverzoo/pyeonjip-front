import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OptionList from './ProductOptionList';
import ProductImageList from './ProductImageList';
import axiosInstance from '../../../utils/axiosInstance'; // axiosInstance 임포트
import './ProductAdmin.css';
import {toast} from "react-toastify";

function ProductOptionAdmin() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    const [product, setProduct] = useState({
        name: '',
        description: '',
        category: ''
    });

    useEffect(() => {
        if (productId) {
            // 옵션 불러오기
            axiosInstance.get(`/api/products/${productId}/details`)
                .then(response => setOptions(response.data))
                .catch(error => console.error('Error fetching options:', error));

            // 이미지 불러오기
            axiosInstance.get(`/api/products/${productId}/images`)
                .then(response => setImages(response.data))
                .catch(error => console.error('Error fetching images:', error));

            // 상품 정보 불러오기
            axiosInstance.get(`/api/products/${productId}`)
                .then(response => {
                    setProduct(response.data);
                    setSelectedCategory(response.data.categoryId);
                })
                .catch(error => console.error('Error fetching product:', error));

            // 자식 카테고리만 불러오기
            axiosInstance.get('/api/admin/category')
                .then(response => setCategories(response.data))
                .catch(error => console.error('Error fetching categories:', error));
        }
    }, [productId]);

    const handleProductUpdate = () => {
        const updatedProduct = { ...product, categoryId: selectedCategory };
        axiosInstance.put(`/api/admin/products/${productId}`, updatedProduct)
            .then(response => {
                if (response.status === 200) {
                    toast.success('상품 정보가 성공적으로 수정되었습니다.', {
                        position: "top-center",
                        autoClose: 2000,
                    });
                } else {
                    console.error('Error updating product');
                }
            })
            .catch(error => console.error('Error updating product:', error));
    };

    const handleCheckboxChange = (id) => {
        setSelectedOptions(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(optionId => optionId !== id)
                : [...prevSelected, id]
        );
    };

    const handleImageCheckboxChange = (id) => {
        setSelectedImages(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(imageId => imageId !== id)
                : [...prevSelected, id]
        );
    };

    const handleBulkDeleteOptions = () => {
        setOptions(options.filter(option => !selectedOptions.includes(option.id)));
        setSelectedOptions([]);
    };

    const handleBulkDeleteImages = () => {
        setImages(images.filter(image => !selectedImages.includes(image.id)));
        setSelectedImages([]);
    };

    const handleAddImage = (newImageUrl) => {
        const newImage = {
            id: images.length + 1,
            imageUrl: newImageUrl
        };
        setImages([...images, newImage]);
    };

    const handleImageUrlChange = (index, newUrl) => {
        const updatedImages = [...images];
        updatedImages[index].imageUrl = newUrl;
        setImages(updatedImages);
    };

    // 옵션 추가 페이지로 이동하는 함수
    const handleNavigateToAddOption = () => {
        navigate(`/admin/product/${productId}/add-option`);
    };

    return (
        <div className="admin-option-page container">
            <h1 className="my-4 text-center">상품, 옵션 및 이미지 관리 페이지</h1>

            {/* 상품 정보 표시 및 수정 */}
            <div className="product-info my-4">
                <h2>상품 정보 수정</h2>
                <div className="form-group">
                    <label>상품 이름</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>상품 설명</label>
                    <textarea
                        className="form-control"
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>카테고리 선택</label>
                    <select
                        className="form-control"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">카테고리 선택</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="text-end"> {/* 버튼을 오른쪽으로 정렬하기 위한 클래스 추가 */}
                    <button className="btn btn-secondary" onClick={handleProductUpdate}>
                        상품 정보 수정
                    </button>
                </div>
            </div>

            <hr />

            {/* 옵션 목록 */}
            {options.length > 0 ? (
                <OptionList
                    options={options}
                    selectedOptions={selectedOptions}
                    handleCheckboxChange={handleCheckboxChange}
                    handleBulkDelete={handleBulkDeleteOptions}
                    handleNavigateToAddOption={handleNavigateToAddOption}
                />
            ) : (
                <div>
                    <p>등록된 옵션이 없습니다.</p>
                    <button className="btn btn-secondary mt-3" onClick={handleNavigateToAddOption}>
                        옵션 추가
                    </button>
                </div>
            )}

            <hr />

            {/* 이미지 목록 */}
            {images.length > 0 ? (
                <ProductImageList
                    images={images}
                    selectedImages={selectedImages}
                    handleCheckboxChange={handleImageCheckboxChange}
                    handleBulkDelete={handleBulkDeleteImages}
                    handleAddImage={handleAddImage}
                    handleImageUrlChange={handleImageUrlChange}
                />
            ) : (
                <p>등록된 이미지가 없습니다.</p>
            )}
        </div>
    );
}

export default ProductOptionAdmin;
