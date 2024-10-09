import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SidePanel.css';

const SidePanelApp = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    // 로컬스토리지에서 장바구니 아이템 불러오기 및 총 가격 계산
    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
        calculateTotalPrice(storedCartItems);
    }, []);

    // 총 가격 계산 함수
    const calculateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    // 수량 조절 로직 (validation 포함)
    const updateQuantity = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        if (newQuantity < 1) {
            alert("수량은 최소 1개 이상이어야 합니다.");
            return;
        }
        updatedItems[index].quantity = newQuantity;
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        calculateTotalPrice(updatedItems);
    };

    // 아이템 삭제 로직
    const removeItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        calculateTotalPrice(updatedItems);
    };

    // 사이드 패널 열기/닫기
    const toggleCart = () => {
        setCartOpen(!isCartOpen);
    };

    // 장바구니 페이지로 이동
    const goToCartPage = () => {
        toggleCart();
        navigate('/cart');
    };

    // 로그인 페이지로 이동
    const goToLoginPage = () => {
        navigate('/login'); // 로그인 페이지의 경로로 변경
    };

    return (
        <div className="App">
            <div>
                {/* 로그인 버튼 */}
                <button className="btn btn-dark btn-primary position-fixed end-0 m-5" style={{ top: '125px', width: '90px' }}onClick={goToLoginPage}>
                    로그인
                </button>

                {/* 장바구니 버튼 */}
                <button className="btn btn-dark btn-primary position-fixed end-0 m-5" style={{ top: '170px', width: '90px' }} onClick={toggleCart}>
                    장바구니
                </button>
            </div>

            {/* 토글형 사이드바 */}
            <div
                className={`offcanvas offcanvas-end ${isCartOpen ? 'show' : ''}`}
                tabIndex="-1"
                style={{
                    visibility: isCartOpen ? 'visible' : 'hidden',
                    width: '600px',
                    borderRadius: '10px 0 0 30px',
                    transition: 'transform 0.3s ease',
                }}
            >
                <div className="offcanvas-header">
                    <div className="container d-flex justify-content-end">
                        <button type="button" className="btn-close" onClick={toggleCart}></button>

                    </div>


                </div>

                <div className="offcanvas-body">
                    {/* 장바구니 아이템 표시 */}
                    <h2 className="offcanvas-title mx-2">장바구니에 추가된 제품</h2>
                    {cartItems.length === 0 ? (
                        <div>
                            <div className="text-center my-5">
                                <i className="bi bi-emoji-frown my-5" style={{fontSize: '5rem'}}></i>
                                <h3 className="my-4 bold">장바구니가 비어 있어요.</h3>
                                <h6 className="text-muted">장바구니에 추가한 아이템이 보이지 않으면 로그인 해주세요.</h6>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item mb-3 m-4 mx-5">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <img src={item.url} alt={item.name} className="img-fluid rounded-2"
                                             style={{width: '100px'}}/>
                                        <div>
                                            <h5 className="">{item.name}</h5>
                                            <h6 className="text-muted">₩ {item.price.toLocaleString()}</h6>
                                        </div>
                                        <div className="quantity-controls">
                                            <button className="quantity-button"
                                                    onClick={() => updateQuantity(index, item.quantity - 1)}>-
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="quantity-button"
                                                    onClick={() => updateQuantity(index, item.quantity + 1)}>+
                                            </button>
                                        </div>
                                        <button className="delete-button"
                                                onClick={() => removeItem(index)}>
                                            <i className="bi bi-trash3" style={{fontSize: '1.2rem'}}></i>
                                        </button>
                                    </div>
                                    <hr/>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* /cart로 이동하는 버튼 */}
                <div className="offcanvas-footer">
                    <div className="total-price d-flex justify-content-between mx-4">
                        <h5>총 주문금액:</h5>
                        <h5>₩ {totalPrice.toLocaleString()}</h5>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark btn-primary btn-md col-xl-11 my-4"
                                style={{borderRadius: '20px'}}
                                onClick={goToCartPage}>
                            장바구니로 가기
                        </button>
                    </div>
                </div>
            </div>

            {/* 어두운 배경 (사이드바가 열릴 때 표시) */}
            {isCartOpen && (
                <div
                    className="offcanvas-backdrop fade show"
                    onClick={toggleCart}
                    style={{
                        transition: 'opacity 0.5s ease',
                        opacity: 0.4,
                        zIndex: 1040,
                    }}
                ></div>
            )}
        </div>
    );
};

export default SidePanelApp;
