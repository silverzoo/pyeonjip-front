import React, { useState, useEffect } from 'react';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        // Replace with your API call
        fetch('http://localhost:8080/api/category')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleToggle = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const renderCategories = (categories, level = 1) => {
        return (
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <button onClick={() => handleToggle(category.id)}>
                            {category.name}
                        </button>
                        {expandedCategories[category.id] && category.children && category.children.length > 0 && (
                            <div style={{ paddingLeft: '20px' }}>
                                {renderCategories(category.children, level + 1)}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            <h3>Category List</h3>
            {categories.length > 0 ? (
                renderCategories(categories)
            ) : (
                <p>Loading categories...</p>
            )}
        </div>
    );
};

export default CategoryList;
