import './Category.css';
import React, { useState, useEffect } from 'react';
import {fetchDeleteCategory, fetchGetCategories} from "../../../api/AdminUtils";
import CategoryItem from "./CategoryItem";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    useEffect(() => {
        window.feather.replace();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetchGetCategories();
                console.log(response);
                setCategories(response);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchCategories();
    }, []);



    const handleCategorySelect = (id) => {
        setSelectedCategoryId(id);
    };

    const handleDelete = async () => {
        console.log("삭제 버튼 클릭됨"); // 로그 추가
        if (selectedCategoryId) {
            try {
                await fetchDeleteCategory(selectedCategoryId);
                const updatedCategories = await fetchGetCategories();
                setCategories(updatedCategories);
                setSelectedCategoryId(null);
            } catch (error) {
                console.error(error.message);
            }
        } else {
            console.log("삭제할 카테고리가 선택되지 않음"); // 로그 추가
        }
    };

    return (
        <div className="card mt-5 p-2 mb-5 border rounded shadow-sm">
            <h2 className="text-center mb-4 mt-3">카테고리 관리</h2>
            <span className="admin-category-btn-container" style={{marginRight: '0px'}}>
                <button className="admin-category-btn" onClick={handleDelete}>삭제</button>
                <button className="admin-category-btn">생성</button>
            </span>
            <div className="admin-category-header">
                <span>
                    <i data-feather="plus-circle"
                       style={{width: '16px', height: '16px', marginTop: '-3px', marginRight: '3px'}}></i>
                    <span style={{fontSize: '1em'}}><strong> NEW 카테고리&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong></span>
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
                    <div className="admin-category-item">
                        <div>생성</div>
                        <div>생성</div>
                        <div>생성</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
