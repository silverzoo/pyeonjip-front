import React, { useState, useEffect } from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';
import { useLocation } from 'react-router-dom';

function Category({ categories }) {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState({});
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    // 컴포넌트가 마운트될 때 로컬 스토리지에서 상태 불러오기
    useEffect(() => {
        const savedExpandedState = JSON.parse(localStorage.getItem('expandedCategories')) || {};
        setExpandedCategories(savedExpandedState);
    }, []);

    // 카테고리 펼침 상태를 로컬 스토리지에 저장
    useEffect(() => {
        localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
    }, [expandedCategories]);

    // URL 에서 카테고리 ID 확인하기
    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const categoryId = pathSegments[pathSegments.length - 1];

        // '/product-detail' 경로 또는 쿼리 파라미터가 있을 때 상태 설정
        if (location.pathname.startsWith('/product-detail')) {
            const savedExpandedState = JSON.parse(localStorage.getItem('expandedCategories')) || {};
            setExpandedCategories(savedExpandedState);
        }

        if (!isNaN(categoryId)) {
            setSelectedCategoryId(categoryId);
            setExpandedCategories((prev) => ({
                ...prev,
                [categoryId]: true,
            }));
        } else if (!location.pathname.startsWith('/category')) {
            setExpandedCategories({});
            localStorage.setItem('expandedCategories', JSON.stringify({})); // 빈 객체로 설정
        }
    }, [location]);

    const handleCategoryToggle = (categoryId) => {
        setExpandedCategories((prev) => {
            const newState = { ...prev };
            // 형제 카테고리 닫기
            Object.keys(newState).forEach(id => {
                if (id !== categoryId) newState[id] = false;
            });
            // 현재 카테고리 토글
            newState[categoryId] = !newState[categoryId];
            return newState;
        });
        setSelectedCategoryId(categoryId);
    };

    return (
        <ul style={{ paddingLeft: 0 }}>
            {categories.map((category) => (
                <li key={category.id}>
                    <ToggleIcon
                        label={category.name}
                        to={`/category/${category.id}`}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={() => handleCategoryToggle(category.id)}
                        isSelected={selectedCategoryId === category.id}
                        hasChildren={category.children && category.children.length > 0}
                    />
                    {expandedCategories[category.id] && category.children && (
                        <Category categories={category.children} parentId={category.id} />
                    )}
                </li>
            ))}
        </ul>
    );
}

export default Category;
