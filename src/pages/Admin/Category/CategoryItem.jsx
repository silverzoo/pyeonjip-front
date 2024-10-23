import React from 'react';
import Icon from "./Icon";

function CategoryItem({ categories, hasParent = false, onCategorySelect, selectedCategoryId }) {
    const handleCategoryClick = (id, hasChildren, e) => {
        e.stopPropagation();

        if (!hasChildren) {
            console.log("클릭됨");
            onCategorySelect(id);
        }
    };

    return (
        <div>
            {categories && categories.length > 0 ? (
                categories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0;
                    const isSelected = selectedCategoryId === category.id; // 선택된 상태 확인
                    return (
                        <div
                            key={category.id}
                            className={`category-item ${isSelected ? 'selected' : ''}`} // 선택된 클래스 추가
                            onClick={(e) => handleCategoryClick(category.id, hasChildren, e)}
                        >
                            <Icon hasChildren={hasChildren} hasParent={hasParent} />
                            <span className="category-name">{category.name}</span>
                            <span className="category-sort" style={{ display: 'none' }}>{category.sort}</span>
                            {hasChildren && (
                                <div className="category-children">
                                    <CategoryItem
                                        categories={category.children}
                                        hasParent={true}
                                        onCategorySelect={onCategorySelect}
                                        selectedCategoryId={selectedCategoryId} // 선택된 ID 전달
                                    />
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="no-categories">등록된 카테고리가 없습니다.</div>
            )}
        </div>
    );
}

export default CategoryItem;
