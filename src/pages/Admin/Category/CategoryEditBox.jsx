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
                             onCategoryUpdated,
                             categories
                         }) => {
    const [categoryId, setCategoryId] = useState(Number(selectedCategoryId));
    const [categoryName, setCategoryName] = useState(selectedCategoryName);
    const [parentId, setParentId] = useState('');
    const [parentName, setParentName] = useState('');
    const [sortOrder, setSortOrder] = useState('');


    useEffect(() => {
        setCategoryId(Number(selectedCategoryId));
        setCategoryName(selectedCategoryName);
        setParentId(selectedParentName ? categories.find(cat => cat.name === selectedParentName)?.id : '');
        setParentName(selectedParentName);
        setSortOrder(sort);
    }, [selectedCategoryId, selectedCategoryName, selectedParentName, sort, categories]);

    useEffect(() => {
        if (selectedCategoryId) {
            const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
            if (selectedCategory) {
                setSortOrder(selectedCategory.sort + 1);
            }
        }
    }, [selectedCategoryId, categories]);


    const handleInputChange = (e) => {
        setCategoryName(e.target.value);
    };

    const handleParentChange = (e) => {
        const newParentName = e.target.value;
        setParentName(newParentName);

        // 부모 ID 조회
        const parentCategory = categories.find(cat => cat.name === newParentName);
        const newParentId = parentCategory ? parentCategory.id : '';

        setParentId(newParentId);

        // 자식 카테고리 길이 계산
        if (parentCategory) {
            setSortOrder(parentCategory.children.length + 1);
        } else {
            setSortOrder(1);
        }
    };


    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
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
            parentId: parentId || null,
            sort: parentId ? categories.find(cat => cat.id === parentId).children.length + 1 : 1,
        };

        try {
            await fetchCreateCategory(categoryData);
            toast.success('카테고리가 생성되었습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
            onCategoryCreated();
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
            setCategoryName('');
        }
    };

    const handleUpdate = async () => {
        if (!categoryName) {
            toast.warn('카테고리 이름을 입력해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        const hasChanges =
            categoryName !== selectedCategoryName ||
            (parentId || null) !== (categories.find(cat => cat.name === selectedParentName)?.id || null) ||
            (sortOrder - 1) !== (sort - 1);

        if (!hasChanges) {
            toast.warn('수정할 사항이 없습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
            return;
        }

        try {
            const categoryData = {
                id: categoryId,
                name: categoryName,
                parentId: parentId || null,
                sort: sortOrder-1,
            };

            await fetchUpdateCategory(categoryId, categoryData);
            toast.success('카테고리가 수정되었습니다.', {
                position: "top-center",
                autoClose: 2000,
            });

            onCategoryCreated();
            onCategoryUpdated();

        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleDelete = async () => {
        if (categoryId !== null) {
            await onCategoryDeleted(categoryId);
            onCategoryCreated();
        } else {
            toast.warn('삭제할 카테고리를 선택해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const sortOptions = Array.from({ length: categoryId && !parentId ? sortOrder : childrenLength > 0 ? childrenLength : 1 }, (_, index) => (
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
                {categoryId ? (
                    <>
                        <div>상위 카테고리</div>
                        <input
                            type="text"
                            value={parentName}
                            onChange={handleParentChange}
                            className="admin-category-edit-area-name"
                        />
                        <div>순서</div>
                        <select value={sortOrder} onChange={handleSortChange} className="admin-category-edit-area-order">
                            {sortOptions}
                        </select>
                    </>
                ) : null}
            </div>

            <div className="admin-category-edit-divider"></div>
            <div className="admin-category-edit-btns">
                {categoryId ? (
                    <button className="admin-category-edit-btn" onClick={handleUpdate}>수정</button>
                ) : (
                    <button className="admin-category-edit-btn" onClick={handleCreate}>생성</button>
                )}
                <button className="admin-category-delete-btn" onClick={handleDelete}>삭제</button>
            </div>
        </div>
    );

};

export default CategoryEditBox;
