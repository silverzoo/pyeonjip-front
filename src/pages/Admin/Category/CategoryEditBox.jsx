// CategoryCreate.js
import React, { useState, useEffect } from 'react';
import { fetchCreateCategory } from '../../../api/AdminUtils';
import { toast } from "react-toastify";

const CategoryEditBox = ({ onCategoryCreated, selectedCategoryId, onCategoryDeleted }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleInputChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleCreate = async () => {
        if (!categoryName) {
            toast.warn('카테고리 이름을 입력해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const categoryData = {
            name: categoryName,
        };

        try {
            await fetchCreateCategory(categoryData);
            toast.success('카테고리가 생성되었습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
            onCategoryCreated();
            setCategoryName('');
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        if (selectedCategoryId) {
            onCategoryDeleted(selectedCategoryId);
        } else {
            toast.warn('삭제할 카테고리를 선택해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="admin-category-edit-box">
            <div className="admin-category-edit-area">
                <div style={{ marginRight: 'auto', marginBottom: '10px' }}>카테고리 이름</div>
                <input
                    type="text"
                    value={categoryName}
                    onChange={handleInputChange}
                    className="admin-category-edit-area-name"
                />
                <div style={{ marginRight: 'auto', marginBottom: '10px' }}>상위카테고리</div>
                <input
                    type="text"
                    className="admin-category-edit-area-parent"
                />
            </div>

            <div className="admin-category-edit-divider"></div>
            <div className="admin-category-edit-btns">
                <button className="admin-category-edit-btn" onClick={handleCreate}>생성</button>
                <button className="admin-category-delete-btn" onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );
};

export default CategoryEditBox;
