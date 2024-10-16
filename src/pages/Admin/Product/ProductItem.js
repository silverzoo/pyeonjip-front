import React from 'react';
import { Link } from 'react-router-dom';

function ProductItem({ product, isSelected, handleCheckboxChange }) {
    return (
        <li className="list-group-item mb-3 shadow-sm p-3">
            <div className="d-flex justify-content-between align-items-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCheckboxChange(product.id)}
                />
                <h3 className="product-name">{product.name}</h3>
                <Link to={`/admin/edit-product/${product.id}`} className="btn-dark-gray">
                    Edit
                </Link>
            </div>
        </li>
    );
}

export default ProductItem;
