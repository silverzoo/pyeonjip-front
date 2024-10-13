// /src/pages/Product/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ProductDetail() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');
    const optionId = queryParams.get('optionId');

    const [product, setProduct] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);

    // Fetch product details by productId and optionId
    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                const option = data.productDetails.find(detail => detail.id === parseInt(optionId));
                setSelectedOption(option || data.productDetails[0]); // 기본 옵션 설정
            })
            .catch((error) => console.error('Error fetching product details:', error));
    }, [productId, optionId]);

    if (!product || !selectedOption) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container" style={{ marginTop: '10vh' }}>
            <div className="row">
                <div className="col-md-6">
                    <img
                        src={selectedOption.mainImage}
                        alt={product.name}
                        className="img-fluid"
                    />
                </div>
                <div className="col-md-6">
                    <h1>{product.name}</h1>
                    <h4>{selectedOption.name}</h4>
                    <p>{product.description}</p>
                    <h3>￦{selectedOption.price.toLocaleString()}</h3>

                    <div className="d-flex gap-3 my-3">
                        {product.productDetails.map((detail, index) => (
                            <img
                                key={index}
                                src={detail.mainImage}
                                alt={`Option ${index + 1}`}
                                style={{
                                    width: '50px',
                                    cursor: 'pointer',
                                    border: selectedOption.id === detail.id ? '2px solid black' : '1px solid gray',
                                }}
                                onClick={() => setSelectedOption(detail)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
