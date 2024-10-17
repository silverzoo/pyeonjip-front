import React, { useState } from 'react';

function ProductImageList({ images, selectedImages, handleCheckboxChange, handleBulkDelete, handleImageUrlChange, handleAddImage }) {
    const [newImageUrl, setNewImageUrl] = useState(''); // 새로 추가할 이미지 URL 상태

    // 이미지 추가 핸들러
    const handleAddNewImage = () => {
        if (newImageUrl.trim() !== '') {
            handleAddImage(newImageUrl); // 부모 컴포넌트로 이미지 추가 요청
            setNewImageUrl(''); // 입력 필드 초기화
        } else {
            alert('이미지 URL을 입력해주세요.');
        }
    };

    return (
        <div className="product-image-list">
            <h2 className="mb-4">상품 이미지 목록</h2>
            {images.length > 0 ? (
                <div>
                    <ul className="list-group">
                        {images.map((image, index) => (
                            <li key={image.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedImages.includes(image.id)}
                                        onChange={() => handleCheckboxChange(image.id)}
                                    />
                                    <img
                                        src={image.imageUrl}
                                        alt="상품 이미지"
                                        style={{ width: '50px', marginLeft: '10px' }}
                                    />
                                    {/* 이미지 URL 수정 입력창 */}
                                    <input
                                        type="text"
                                        value={image.imageUrl}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        style={{ marginLeft: '20px', width: '200px' }}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        className="btn-black mt-3"
                        onClick={handleBulkDelete}
                        disabled={selectedImages.length === 0}
                    >
                        선택된 이미지 삭제
                    </button>
                </div>
            ) : (
                <p className="text-muted">등록된 이미지가 없습니다.</p>
            )}

            {/* 이미지 추가 입력창 */}
            <div className="mt-4">
                <h4>새로운 이미지 추가</h4>
                <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="이미지 URL 입력"
                    style={{ marginRight: '10px', width: '250px' }}
                />
                <button
                    className="btn-black"
                    onClick={handleAddNewImage}
                >
                    이미지 추가
                </button>
            </div>
        </div>
    );
}

export default ProductImageList;