import React, { useState, useEffect } from 'react';

function Home() {
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/api/category')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleToggle = (categoryId) => {
        // 카테고리 ID의 펼쳐짐 상태를 토글
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId], // 기존 상태를 반전
        }));
    };

    const renderCategories = (categories) => {
        return (
            <ol>
                {categories.map(category => (
                    <li key={category.id}>
                        <button onClick={() => handleToggle(category.id)}>
                            {category.name} (Level: {category.dept})
                        </button>
                        {expandedCategories[category.id] && category.child && category.child.length > 0 && (
                            <ul>
                                {renderCategories(category.child)} {/* 재귀 호출로 하위 카테고리 렌더링 */}
                            </ul>
                        )}
                    </li>
                ))}
            </ol>
        );
    };

    return (
        <div>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <h3>카테고리 조회 테스트</h3>
                    {categories.length > 0 ? (
                        renderCategories(categories) // 카테고리 렌더링
                    ) : (
                        <div>로딩 중...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default Home;