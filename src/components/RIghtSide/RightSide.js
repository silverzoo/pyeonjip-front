import React, {useState, useEffect, useCallback} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchCartDetails, updateLocalStorage, deleteCartItem, updateCartItemQuantity } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import './RightSide.css';
import {useAuth} from "../../context/AuthContext";
import {useCart} from "../../context/CartContext";

const ANIMATION_DURATION = 400;

const SidePanelApp = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [animatedItems, setAnimatedItems] = useState([]); // 애니메이션을 적용할 항목을 추적
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoggedIn, email, setIsLoggedIn, handleContextLogout } = useAuth();
    const { items, setItems, loadCartData } = useCart();

    useEffect(() => {
        updateTotalPrice(items);
    }, [items]);

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                localStorage.removeItem('access');
                localStorage.removeItem('cart');
                const event = new Event('authChange');
                window.dispatchEvent(event);
                handleContextLogout();
                setItems([]);
                //navigate('/');
                loadCartData();
                console.log('로그아웃');
                window.location.reload();
            }
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
        }
    };

    // 이벤트 리스너 추가
    useEffect(() => {
        const handleAuthChange = () => {
        };
        window.addEventListener('authChange', handleAuthChange);
        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const updateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
        });
        setTotalPrice(total);
    };

    const validateQuantity = (index, value) => {
        const min = 0;
        const maxQuantity = items[index].maxQuantity;

        let validatedValue = parseInt(value, 10);

        if (isNaN(validatedValue) || validatedValue < min) {
            validatedValue = 0;
        } else if (validatedValue > maxQuantity) {
            alert(`보유 재고가 ${maxQuantity}개 입니다.`);
            validatedValue = maxQuantity;
        }
        const updatedItems = [...items];
        updatedItems[index].quantity = validatedValue;
        setItems(updatedItems);

        if (isLoggedIn) {
            const cartItem = {
                optionId: updatedItems[index].optionId,
                quantity: updatedItems[index].quantity,
            };
            updateCartItemQuantity(email, cartItem.optionId, cartItem);
        } else {
            updateLocalStorage(updatedItems);
        }
    };

    const handleDeleteItem = (index) => {
        setAnimatedItems((prevAnimatedItems) => [...prevAnimatedItems, index]);

        setTimeout(() => {
            const targetOptionId = items[index].optionId;
            const updatedCartItems = items.filter((item, itemIndex) => itemIndex !== index);
            setItems(updatedCartItems);

            if (updatedCartItems.length < 0) {
                return;
            } else if (isLoggedIn === false) {
                updateLocalStorage(updatedCartItems);
            } else if (isLoggedIn) {
                deleteCartItem(email, targetOptionId);
            }
            setAnimatedItems((prevAnimatedItems) => prevAnimatedItems.filter((i) => i !== index));
        }, ANIMATION_DURATION);
    };

    const toggleCart = () => {
        if (isCartOpen) {
            document.querySelector('.offcanvas').classList.remove('show');
            document.querySelector('.offcanvas-backdrop').classList.remove('show');
            setTimeout(() => setCartOpen(false), ANIMATION_DURATION);
        } else {
            setCartOpen(true);
            setTimeout(() => {
                loadCartData();
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

    // 마이페이지 이동하는 버튼
    const goToMyPage = () => {
        navigate('/mypage');
    };

    return (
        <div className="App">
            <div style={{
                position: 'fixed',
                right: '30px',
                top: '150px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                {isLoggedIn ? (
                    <>
                        <span
                            className="text-dark"
                            style={{cursor: 'pointer', fontSize: '14px', fontWeight: 'semibold'}}
                            onClick={goToMyPage}>
                            마이페이지
                        </span>
                        <span
                            className="text-dark"
                            style={{cursor: 'pointer', fontSize: '14px', fontWeight: 'semibold'}}
                            onClick={handleLogout}>
                            로그아웃
                        </span>
                    </>
                ) : (
                    <span
                        className="text-dark"
                        style={{cursor: 'pointer', fontSize: '14px', fontWeight: 'semibold'}}
                        onClick={goToLoginPage}>
                        로그인
                    </span>
                )}

                {location.pathname !== '/cart' && (
                    <span
                        className="text-dark"
                        style={{cursor: 'pointer', fontSize: '14px', fontWeight: 'semibold'}}
                        onClick={toggleCart}>
                        장바구니
                     </span>)}
            </div>
            <div
                className={`offcanvas offcanvas-end ${isCartOpen ? 'show' : ''}`}
                tabIndex="-1"
                style={{
                    visibility: isCartOpen ? 'visible' : 'hidden',
                    width: '550px',
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
                    {items.length === 0 ? (
                        <div>
                            <div className="text-center my-5">
                                <i className="bi bi-emoji-frown my-5" style={{fontSize: '7rem'}}></i>
                                <h2 className="my-4 bold">장바구니가 비어 있어요.</h2>
                                <h6 className="text-muted">장바구니에 추가한 아이템이 보이지 않으면 로그인 해주세요.</h6>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {items && items.map((item, index) => (
                                <div key={index}
                                     className={`cart-item mb-3 mx-5 ${animatedItems.includes(index) ? 'removing' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <img src={item.url} className="img-fluid rounded-2 col-xl-2"
                                             style={{width: '100px'}}/>
                                        <div className="col-xl-4">
                                            <h6 className="mb-1" style={{fontSize: '15px'}}>{item.name}</h6>
                                            <h6>₩ {item.price.toLocaleString()}</h6>
                                        </div>
                                        <div className="col-md-2 col-lg-1 col-xl-3 d-flex align-items-center">
                                            <button
                                                className="quantity-button"
                                                onClick={() => validateQuantity(index, item.quantity - 1)}
                                                disabled={item.quantity <= 0} // 최소 수량 1
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control quantity mx-2 my-1"
                                                value={item.quantity}
                                                min="1"
                                                onChange={(e) => validateQuantity(index, e.target.value)}
                                            />
                                            <button
                                                className="quantity-button"
                                                onClick={() => validateQuantity(index, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="col-md-1 col-lg-1 col-xl-1">
                                            <button className="hvlo-delete-button"
                                                    onClick={() => handleDeleteItem(index)}>
                                                <i className="bi bi-trash3"
                                                   style={{fontSize: '1.2rem'}}></i>
                                            </button>
                                        </div>
                                        <div/>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="offcanvas-footer my-4">
                    <div className="total-price d-flex justify-content-between mx-4 my-4">
                        <h4 style={{fontSize: '20px'}}>총 주문금액:</h4>
                        <h4>₩ {totalPrice.toLocaleString()}</h4>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-dark btn-primary btn-lg col-xl-11"
                                style={{borderRadius: '10px'}}
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