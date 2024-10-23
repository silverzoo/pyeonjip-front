// AdminCategory.js
import './Category.css';
import React, { useState, useEffect, useRef } from 'react';
import { fetchDeleteCategory, fetchGetCategories } from "../../../api/AdminUtils";
import CategoryItem from "./CategoryItem";
import CategoryEditBox from "./CategoryEditBox";
import { toast } from "react-toastify";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState('');
    const categoryListRef = useRef(null);

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

    // 카테고리 선택 시 호출
    const handleCategorySelect = (id, name) => {
        setSelectedCategoryId(id);
        setSelectedCategoryName(name);
    };

    // 렌더링 시 전체 클릭 핸들러 추가
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleClickOutside = () => {
        setSelectedCategoryId(null);
    };

    const handleCategoryCreated = async () => {
        const updatedCategories = await fetchGetCategories();
        setCategories(updatedCategories);
        if (categoryListRef.current) {
            categoryListRef.current.scrollTop = categoryListRef.current.scrollHeight;
        }
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
            setSelectedCategoryId(null);
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
                <div className="admin-category-list" ref={categoryListRef}>
                    <div className="admin-category-item">
                        <CategoryItem
                            categories={categories}
                            hasParent={false}
                            onCategorySelect={handleCategorySelect}
                            selectedCategoryId={selectedCategoryId}
                        />
                    </div>
                    <div className="admin-category-divider"></div>
                    <div className="admin-category-item" style={{ marginLeft: '20px' }}>
                        <CategoryEditBox
                            onCategoryCreated={handleCategoryCreated}
                            selectedCategoryId={selectedCategoryId}
                            selectedCategoryName={selectedCategoryName}
                            onCategoryDeleted={handleCategoryDeleted}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
