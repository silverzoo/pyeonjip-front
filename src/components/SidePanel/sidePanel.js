import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SidePanel.css';

const SidePanelApp = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();
    const [animatedItems, setAnimatedItems] = useState([]); // 애니메이션을 적용할 항목을 추적
    const location = useLocation();

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
        updateTotalPrice(storedCartItems);
    }, []);

    const updateTotalPrice = (items) => {
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotalPrice(total);
    };

    const validateQuantity = (index, value) => {
        const min = 0;
        const maxQuantity = JSON.parse(localStorage.getItem('cart'))[index].maxQuantity;

        const updatedItems = [...cartItems];
        if (value < 1) {
            alert("수량은 최소 1개 이상이어야 합니다.");
            return;
        } else if (value > maxQuantity) {
            alert(`보유 재고가 ${maxQuantity}개 입니다.`);
            value = maxQuantity;
        }
        updatedItems[index].quantity = value;
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        updateTotalPrice(updatedItems);
    };

    const removeItem = (index) => {
        setAnimatedItems((prev) => [...prev, index]); // 애니메이션 적용할 항목 인덱스 추가

        setTimeout(() => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
        updateTotalPrice(updatedItems);

            setAnimatedItems((prev) => prev.filter(i => i !== index)); // 애니메이션 목록에서 제거
        }, 400); // 애니메이션 지속 시간에 맞춤
    };

    const toggleCart = () => {
        if (isCartOpen) {
            document.querySelector('.offcanvas').classList.remove('show');
            document.querySelector('.offcanvas-backdrop').classList.remove('show');
            setTimeout(() => setCartOpen(false), 300);
        } else {
            const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(storedCartItems);  // 최신화된 장바구니 항목을 설정
            updateTotalPrice(storedCartItems);  // 총 금액 업데이트
            setCartOpen(true);
            setTimeout(() => {
                document.querySelector('.offcanvas').classList.add('show');
                document.querySelector('.offcanvas-backdrop').classList.add('show');
            }, 0);
        }
    };

    const goToCartPage = () => {
        toggleCart();
        navigate('/cart');
    };

    const goToLoginPage = () => {
        navigate('/login');
    };

    return (
        <div className="App">
            <div>
                <button className="btn btn-dark btn-primary position-fixed end-0 m-3" style={{ top: '125px', width: '85px'}} onClick={goToLoginPage}>
                    로그인
                </button>

                {location.pathname !== '/cart' && (
                    <button className="btn btn-dark btn-primary position-fixed end-0 m-3" style={{ top: '170px', width: '85px'}} onClick={toggleCart}>
                        장바구니
                    </button>
                )}
            </div>

            <div
                className={`offcanvas offcanvas-end ${isCartOpen ? 'show' : ''}`}
                tabIndex="-1"
                style={{
                    visibility: isCartOpen ? 'visible' : 'hidden',
                    width: '600px',
                    borderRadius: '10px 0 0 10px',
                }}
            >
                <div className="offcanvas-header">

                    <div className="container d-flex justify-content-end">
                        <h2 className="offcanvas-title mx-2">장바구니</h2>
                        <button type="button" className="btn-close" onClick={toggleCart}></button>

                    </div>
                </div>

                <div className="offcanvas-body">

                    {cartItems.length === 0 ? (
                        <div>
                            <div className="text-center my-5 ">

                                <i className="bi bi-emoji-frown  my-5" style={{fontSize: '7rem'}}></i>
                                <h2 className="my-4 bold">장바구니가 비어 있어요.</h2>
                                <h6 className="text-muted">장바구니에 추가한 아이템이 보이지 않으면 로그인 해주세요.</h6>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {cartItems.map((item, index) => (
                                <div key={index} className={`cart-item mb-3  mx-5 ${animatedItems.includes(index) ? 'removing' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <img src={item.url} alt={item.name} className="img-fluid rounded-2 col-xl-2" style={{ width: '120px' }} />
                                        <div className="col-xl-3">
                                            <h6 className="mb-1">{item.name}</h6>
                                            <small>₩ {item.price.toLocaleString()}</small>
                                        </div>
                                        <div className="quantity-controls col-xl-3">
                                            <button className="quantity-button" onClick={() => validateQuantity(index, item.quantity - 1)}>-</button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="quantity-button" onClick={() => validateQuantity(index, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="delete-button" onClick={() => removeItem(index)}>
                                            <i className="bi bi-trash3" style={{ fontSize: '1.2rem' }}></i>
                                        </button>
                                    </div>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="offcanvas-footer my-4">
                <div className="total-price d-flex justify-content-between mx-4">
                        <h4 >총 주문금액:</h4>
                        <h4>₩ {totalPrice.toLocaleString()}</h4>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark btn-primary btn-lg col-xl-11"
                                style={{ borderRadius: '10px' }}
                                onClick={goToCartPage}>
                            장바구니로 가기
                        </button>
                    </div>
                </div>
            </div>

            {isCartOpen && (
                <div
                    className="offcanvas-backdrop show"
                    onClick={toggleCart}
                ></div>
            )}
        </div>
    );
};

export default SidePanelApp;
