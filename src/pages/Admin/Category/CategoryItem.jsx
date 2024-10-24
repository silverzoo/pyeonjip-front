import React from 'react';
import Icon from "./Icon";

function CategoryItem({ categories, hasParent = false, onCategorySelect, selectedCategoryId }) {
    const handleCategoryClick = (id, hasChildren, e) => {
        e.stopPropagation();
        if (!hasChildren) {
            onCategorySelect(id);
        }
    };

    return (
        <div style={{ cursor: 'pointer' }}>
            {categories && categories.length > 0 ? (
                categories.map((category) => {
                    const hasChildren = category.children && category.children.length > 0;
                    const isSelected = selectedCategoryId === category.id;

                    const itemStyle = {
                        marginLeft: hasParent && hasChildren ? '20px' : '0px',
                    };

                    return (
                        <div
                            key={category.id}
                            className={`category-item ${isSelected ? 'selected' : ''}`}
                            style={itemStyle}
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
                                        selectedCategoryId={selectedCategoryId}
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
