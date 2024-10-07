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
        alert('로컬스토리지 초기화 완료');
    };

    // 장바구니에 아이템 추가
    const addToCart = (item) => {
        const cartItem = {
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category,
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
            alert(`${item.name} is already in the cart!`);
        } else {
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${item.name} added to cart!`);
        }
    };

    return (
        <section >
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="row">
                                                {items.map((item) => (
                                                    <div className="col-md-3" key={item.id}>
                                                        <div className="card mb-2">
                                                            <img src={item.image} className="card-img-top" alt="Item Image" />
                                                            <div className="card-body">
                                                                <h5 className="card-title">{item.name}</h5>
                                                                <p className="card-text">{item.price} 원</p>
                                                                <p className="card-text">{item.category}</p>

                                                                <button className="btn btn-dark btn-block btn-lg gap-4 m-2"
                                                                        onClick={() => addToCart(item)}>
                                                                    Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button className="btn btn-dark btn-block btn-lg gap-4 m-2" onClick={() => window.location.href = '/cart'}>
                                                장바구니로 이동
                                            </button>

                                            <button className="btn btn-dark btn-block btn-lg gap-4" onClick={resetStorage}>
                                                로컬스토리지 초기화
                                            </button>
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
