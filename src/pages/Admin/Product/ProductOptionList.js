import React from 'react';
import OptionItem from './ProductOptionItem';

function ProductOptionList({ options, selectedOptions, handleCheckboxChange, handleBulkDelete, handleNavigateToAddOption }) {
    return (
        <div className="option-list">
            <h2 className="mb-4">옵션 목록</h2>
            {options.length > 0 ? (
                <div>
                    <ul className="list-group">
                        {options.map(option => (
                            <OptionItem
                                key={option.id}
                                option={option}
                                isSelected={selectedOptions.includes(option.id)}
                                handleCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                    </ul>
                    <div className="mt-3 d-flex justify-content-between">
                        <button
                            className="btn-black"
                            onClick={handleBulkDelete}
                            disabled={selectedOptions.length === 0}
                        >
                            선택된 옵션 삭제
                        </button>

                        {/* 옵션 추가 버튼 */}
                        <button
                            className="btn btn-secondary"
                            onClick={handleNavigateToAddOption}
                        >
                            옵션 추가
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="text-muted">옵션이 없습니다.</p>

                    {/* 옵션 추가 버튼 (옵션이 없을 때도 표시) */}
                    <button
                        className="btn btn-secondary mt-3"
                        onClick={handleNavigateToAddOption}
                    >
                        옵션 추가
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductOptionList;