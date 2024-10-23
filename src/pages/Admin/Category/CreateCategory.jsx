import React, { useState } from 'react';
import { fetchCreateCategory } from '../../../api/AdminUtils';
import {toast} from "react-toastify";

const CategoryCreate = ({ onCategoryCreated }) => {
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
            onCategoryCreated(); // 카테고리가 생성되면 업데이트를 알림
            setCategoryName('');
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="admin-category-create">
            <input
                type="text"
                value={categoryName}
                onChange={handleInputChange}
                placeholder="카테고리 이름을 입력하세요"
                className="category-input"
            />
            <button className="admin-category-create-btn" onClick={handleCreate}>생성</button>
        </div>
    );
};

export default CategoryCreate;
