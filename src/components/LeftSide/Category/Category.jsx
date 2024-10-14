import React, { useState } from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';

function Category({ categories }) {
    const [expandedCategories, setExpandedCategories] = useState({});

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
        <ul style={{ paddingLeft:0 }}>
            {categories.map((category) => (
                <li key={category.id}>
                    <ToggleIcon
                        label={category.name}
                        to={`/category/${category.id}`}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={() => handleCategoryToggle(category.id)}
                    />
                    {expandedCategories[category.id] && category.children && (
                        <ul style={{ paddingLeft:15 }}>
                            <Category categories={category.children}/>
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default Category;
