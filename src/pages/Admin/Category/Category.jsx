import './Category.css';
import React, {useState, useEffect, useRef} from 'react';
import {fetchDeleteCategory, fetchGetCategories} from "../../../api/AdminUtils";
import CategoryItem from "./CategoryItem";
import CategoryCreate from "./CreateCategory";
import {toast} from "react-toastify";

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const categoryListRef = useRef(null);

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


    // 카테고리 선택 시 호출
    const handleCategorySelect = (id) => {
        setSelectedCategoryId(id);
    };

    // 전체 영역 클릭 시 선택 초기화
    const handleClickOutside = () => {
        setSelectedCategoryId(null);
    };

    // 렌더링 시 전체 클릭 핸들러 추가
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {

        if (selectedCategoryId) {
            try {
                await fetchDeleteCategory(selectedCategoryId);
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
        } else {
            toast.warn('삭제할 카테고리를 선택해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleCategoryCreated = async () => {
        const updatedCategories = await fetchGetCategories();
        setCategories(updatedCategories);

        if (categoryListRef.current) {
            categoryListRef.current.scrollTop = categoryListRef.current.scrollHeight;
        }
    };

    return (
        <div className="card mt-5 p-2 mb-5 border rounded shadow-sm">
            <h2 className="text-center mb-4 mt-3">카테고리 관리</h2>
            <span className="admin-category-btn-container" style={{marginRight: '0px'}}>
                <button className="admin-category-btn" onClick={handleDelete}>삭제</button>
                <button className="admin-category-btn">수정</button>
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
                    <div className="admin-category-item">
                        <CategoryCreate onCategoryCreated={handleCategoryCreated} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
