import React, { useState, useEffect } from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';
import { useLocation } from 'react-router-dom';

function Category({ categories }) {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {

        const pathSegments = location.pathname.split('/');
        const categoryIdFromPath = pathSegments[pathSegments.length - 1];

        if (!isNaN(categoryIdFromPath)) {
            setExpandedCategories((prev) => ({
                ...prev,
                [categoryIdFromPath]: true,
            }));
        }
    }, [location]);

    const handleCategoryToggle = (categoryId) => {
        const currentExpandedState = expandedCategories[categoryId];

        // 모든 카테고리 상태를 초기화
        const newExpandedState = Object.keys(expandedCategories).reduce((acc, id) => {
            acc[id] = false;
            return acc;
        }, {});

        // 클릭한 카테고리의 상태만 토글
        newExpandedState[categoryId] = !currentExpandedState;

        setExpandedCategories(newExpandedState);
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
                    />
                    {expandedCategories[category.id] && category.children && (
                        <ul>
                            <Category categories={category.children} />
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default Category;
