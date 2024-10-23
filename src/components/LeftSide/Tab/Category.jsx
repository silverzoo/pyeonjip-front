import React, { useEffect, useState } from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';
import { useLocation } from 'react-router-dom';

function Category({ categories }) {
    const location = useLocation();
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        const savedExpandedState = JSON.parse(localStorage.getItem('expandedCategories')) || {};
        setExpandedCategories(savedExpandedState);
    }, []);

    useEffect(() => {
        localStorage.setItem('expandedCategories', JSON.stringify(expandedCategories));
    }, [expandedCategories]);

    useEffect(() => {
        if (location.pathname === '/') {
            setExpandedCategories({});
            localStorage.setItem('expandedCategories', JSON.stringify({}));
        }
    }, [location]);

    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const categoryId = pathSegments[pathSegments.length - 1];

        if (!isNaN(categoryId)) {
            setExpandedCategories((prev) => ({
                ...prev,
                [categoryId]: true,
            }));
        } else if (!location.pathname.startsWith('/category')) {
            setExpandedCategories({});
            localStorage.setItem('expandedCategories', JSON.stringify({}));
        }
    }, [location]);

    const handleCategoryToggle = (categoryId) => {
        setExpandedCategories((prev) => {
            const newState = { ...prev };
            Object.keys(newState).forEach(id => {
                if (id !== categoryId) newState[id] = false;
            });
            newState[categoryId] = !newState[categoryId];
            return newState;
        });
    };

    return (
        <>
            {categories.map((category) => (
                <div key={category.id}>
                    <ToggleIcon
                        label={category.name}
                        to={`/category/${category.id}`}
                        isExpanded={expandedCategories[category.id]}
                        onToggle={() => handleCategoryToggle(category.id)}
                        hasChildren={category.children && category.children.length > 0}
                    />
                    <div className={`collapse-content ${expandedCategories[category.id] ? 'expanded' : ''}`}>
                        {expandedCategories[category.id] && category.children && (
                            <Category categories={category.children} />
                        )}
                    </div>
                </div>
            ))}
        </>
    );
}

export default Category;
