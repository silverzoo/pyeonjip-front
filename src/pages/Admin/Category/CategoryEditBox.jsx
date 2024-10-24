import React, { useEffect, useState } from 'react';
import { fetchCreateCategory, fetchUpdateCategory } from '../../../api/AdminUtils';
import { toast } from "react-toastify";

const CategoryEditBox = ({
                             selectedCategoryId,
                             selectedCategoryName,
                             selectedParentName,
                             childrenLength,
                             sort,
                             onCategoryCreated,
                             onCategoryDeleted,
                             categories
                         }) => {

    const [categoryId, setCategoryId] = useState(Number(selectedCategoryId));
    const [categoryName, setCategoryName] = useState(selectedCategoryName);
    const [parentId, setParentId] = useState('');
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        console.log(selectedCategoryId)
        console.log(selectedCategoryName)
        setCategoryId(Number(selectedCategoryId));
        setCategoryName(selectedCategoryName);
        setParentId(selectedParentName ? categories.find(cat => cat.name === selectedParentName)?.id : '');
        setSortOrder(sort);
    }, [selectedCategoryName, selectedParentName, sort, categories]);

    const handleInputChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleParentChange = (e) => {
        setParentId(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleCreateOrUpdate = async () => {
        if (!categoryName) {
            toast.warn('카테고리 이름을 입력해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const categoryData = {
            id: selectedCategoryId,
            name: categoryName,
            parentId: parentId || null,
            sort: sortOrder,
        };

        try {
            if (selectedCategoryId) {
                await fetchUpdateCategory(categoryData);
                toast.success('카테고리가 수정되었습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            } else {
                await fetchCreateCategory(categoryData);
                toast.success('카테고리가 생성되었습니다.', {
                    position: "top-center",
                    autoClose: 2000,
                });
            }
            onCategoryCreated();
            setCategoryName('');
            setParentId('');
            setSortOrder('');
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        console.log(categoryId);
        if (categoryId !== null) {
            await onCategoryDeleted(categoryId);
        } else {
            toast.warn('삭제할 카테고리를 선택해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const sortOptions = Array.from({length: childrenLength > 0 ? childrenLength : 1}, (_, index) => (
        <option key={index + 1} value={index + 1}>
            {index + 1}
        </option>
    ));

    return (
        <div className="admin-category-edit-box">
            <div className="admin-category-edit-area">
                <div>카테고리 이름</div>
                <input
                    type="text"
                    value={categoryName}
                    onChange={handleInputChange}
                    className="admin-category-edit-area-name"
                />
                <div>상위 카테고리</div>
                <input
                    type="text"
                    value={selectedParentName || '없음'}
                    onChange={handleParentChange}
                    className="admin-category-edit-area-name"
                />
                <div>정렬 순서</div>
                <select value={sortOrder} // Use sortOrder instead of sort
                        onChange={handleSortChange}
                        className="admin-category-edit-area-order">
                    {sortOptions}
                </select>
            </div>

            <div className="admin-category-edit-divider"></div>
            <div className="admin-category-edit-btns">
                <button className="admin-category-edit-btn" onClick={handleCreateOrUpdate}>
                    {selectedCategoryId ? '수정' : '생성'}
                </button>
                <button className="admin-category-delete-btn" onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );
};

export default CategoryEditBox;
