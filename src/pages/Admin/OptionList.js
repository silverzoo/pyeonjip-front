import React from 'react';
import OptionItem from './OptionItem';

function OptionList({ options, selectedOptions, handleCheckboxChange, handleBulkDelete }) {
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
                    <button
                        className="btn-black mt-3"
                        onClick={handleBulkDelete}
                        disabled={selectedOptions.length === 0}
                    >
                        선택된 옵션 삭제
                    </button>
                </div>
            ) : (
                <p className="text-muted">옵션이 없습니다.</p>
            )}
        </div>
    );
}

export default OptionList;