import React from 'react';
import { Link } from 'react-router-dom';

function ProductOptionItem({ option, isSelected, handleCheckboxChange }) {
    return (
        <li className="list-group-item mb-3 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(option.id)}
                />
                <h3 className="option-name">{option.name}</h3>
                <Link to={`/admin/edit-option/${option.id}`} className="btn-dark-gray">
                    수정
                </Link>
            </div>
        </li>
    );
}

export default ProductOptionItem;