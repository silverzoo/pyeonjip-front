import React, { useState, useEffect } from 'react';

function SandboxApp() {
    const [items, setItems] = useState([]);

    // 데이터 가져오는 함수
    useEffect(() => {
        fetch('http://localhost:8080/cart/sandbox')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // 로컬스토리지 초기화
    const resetStorage = () => {
        localStorage.clear();
        alert('장바구니 초기화');
    };

    // 장바구니에 아이템 추가
    const addToCart = (item) => {
        const cartItem = {
            id: item.id,
            name: item.name,
            options: item.productDetails.map(option => ({
                optionName: option.optionName,
                price: option.optionPrice,
                url: option.url,
                maxQuantity: option.maxQuantity,
            })), // 모든 옵션 추가
            quantity: 1, // 기본 수량
            check: true,
        };

        let cart = localStorage.getItem('cart');
        if (!cart) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }

        const itemExists = cart.some(cartItem => cartItem.id === item.id);

        if (itemExists) {
            alert(`이미 장바구니에 존재합니다.`);
        } else {
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`장바구니에 추가되었습니다. ${item.name}`);
        }
    };

    return (
        <section>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card-body p-0">
                        <div className="row g-0">
                            <div className="col-lg-8">
                                <div className="p-5">
                                    <div className="row">
                                        {items.map((item) => (
                                            <div className="col-md-4" key={item.id}>
                                                <div className="card mb-2">
                                                    <img
                                                        src={item.productDetails[0].url}
                                                        className="card-img-top"
                                                        alt="Item Image"
                                                        onError={(e) => {
                                                            e.target.src = 'default-image-url.jpg';
                                                        }} // 이미지 오류 시 기본 이미지
                                                    />
                                                    <div className="card-body">
                                                        <h5 className="card-title">{item.name}</h5>
                                                        {/* 모든 옵션이 장바구니에 추가됨 */}
                                                        <button
                                                            className="btn btn-dark btn-block btn-lg gap-4 m-2 "
                                                            onClick={() => addToCart(item)} // 아이템 추가
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div>
                                        <button
                                            className="btn btn-dark btn-block btn-lg gap-4 m-2 col-lg-3"
                                            onClick={() => window.location.href = '/cart'}
                                        >
                                            장바구니 이동
                                        </button>

                                        <button
                                            className="btn btn-dark btn-block btn-lg gap-4 col-lg-3"
                                            onClick={resetStorage}
                                        >
                                            장바구니 초기화
                                        </button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SandboxApp;
