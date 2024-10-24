// AdminCategory.js
import './Category.css';
import React, {useState, useEffect, useRef} from 'react';
import { fetchDeleteCategory, fetchGetCategories } from "../../../api/AdminUtils";
import CategoryItem from "./CategoryItem";
import CategoryEditBox from "./CategoryEditBox";
import { toast } from "react-toastify";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const [selectedParentName, setSelectedParentName] = useState('');
    const [childrenLength, setChildrenLength] = useState(1);
    const [sort, setSort] = useState(1);
    const editBoxRef = useRef(null);

    useEffect(() => {
        window.feather.replace();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchGetCategories();
                setCategories(response);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchCategories();
    }, []);

    const findCategoryById = (categories, id) => {
        for (const category of categories) {
            if (category.id === id) {
                return category; // 카테고리 발견
            }
            // 자식 카테고리에서 재귀적으로 검색
            if (category.children) {
                const foundCategory = findCategoryById(category.children, id);
                if (foundCategory) {
                    return foundCategory; // 자식 카테고리에서 발견
                }
            }
        }
        return null;
    };

    const handleCategorySelect = (id) => {
        console.log('Selected ID:', id);
        console.log('Categories:', categories);

        const selectedCategory = findCategoryById(categories, id);

        const selectedId = selectedCategory ? selectedCategory.id : '';
        const selectedName = selectedCategory ? selectedCategory.name : '';
        const parentId = selectedCategory ? selectedCategory.parentId : null;
        const sort = selectedCategory ? selectedCategory.sort : 1;
        console.log(sort)

        // 부모 ID를 통해 부모 카테고리를 찾아 자식 길이를 얻음
        const parentCategory = parentId ? categories.find(cat => cat.id === parentId) : null;
        const parentName = parentCategory ? parentCategory.name : '';
        const childrenLength = parentCategory && parentCategory.children ? parentCategory.children.length : 1;

        setSelectedCategoryId(selectedId);
        setSelectedCategoryName(selectedName);
        setSelectedParentName(parentName);
        setChildrenLength(childrenLength);
        setSort(sort+1);
    };

    // 렌더링 시 전체 클릭 핸들러 추가
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleCategoryUpdated = () => {
        setSelectedCategoryId(null);
        setSelectedCategoryName('');
        setSelectedParentName(null);
        setChildrenLength(null);
        setSort(null);
    };


    const handleClickOutside = (event) => {
        // 수정 박스 외부 클릭 시에만 상태를 초기화
        if (editBoxRef.current && !editBoxRef.current.contains(event.target)) {
            setSelectedCategoryId(null);
            setSelectedCategoryName('');
            setSelectedParentName(null);
            setChildrenLength(null);
            setSort(null);
        }
    };

    const handleCategoryCreated = async () => {
        const updatedCategories = await fetchGetCategories();
        setCategories(updatedCategories);
    };

    const handleCategoryDeleted = async (id) => {
        try {
            await fetchDeleteCategory(id);
            toast.success('카테고리가 삭제되었습니다.', {
                position: "top-center",
                autoClose: 2000,
            });
            const updatedCategories = await fetchGetCategories();
            setCategories(updatedCategories);
            handleCategoryUpdated();
        } catch (error) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="card mt-5 p-2 mb-5 border rounded shadow-sm">
            <h2 className="text-center mb-4 mt-3">카테고리 관리</h2>
            <span className="admin-category-btn-container" style={{ marginRight: '0px' }}>
            </span>
            <div className="admin-category-header">
                <span>
                    <i data-feather="plus-circle"
                       style={{ width: '16px', height: '16px', marginTop: '-3px', marginRight: '3px' }}></i>
                    <span style={{ fontSize: '1em' }}><strong> NEW 카테고리&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span>
                    <span>원하는 카테고리 수정 및 생성이 가능합니다.</span>
                </span>
            </div>
            <div className="admin-category-list-container">
                <div className="admin-category-list">
                    <div className="admin-category-item">
                        <CategoryItem
                            categories={categories}
                            hasParent={false}
                            onCategorySelect={handleCategorySelect}
                            selectedCategoryId={selectedCategoryId}
                        />
                    </div>
                    <div className="admin-category-divider"></div>
                    <div className="admin-category-item" style={{ marginLeft: '20px' }} ref={editBoxRef}>
                        <CategoryEditBox
                            selectedCategoryId={selectedCategoryId}
                            selectedCategoryName={selectedCategoryName}
                            selectedParentName={selectedParentName}
                            childrenLength={childrenLength}
                            sort={sort}
                            onCategoryCreated={handleCategoryCreated}
                            onCategoryDeleted={handleCategoryDeleted}
                            onCategoryUpdated={handleCategoryUpdated}
                            categories={categories}
                        />

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
