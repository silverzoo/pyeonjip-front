import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {fetchCartDetails, updateLocalStorage, deleteCartItem,updateCartItemQuantity} from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import './SidePanel.css';

const ANIMATION_DURATION = 400;
const SidePanelApp = () => {
    const [isCartOpen, setCartOpen] = useState(false);
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [animatedItems, setAnimatedItems] = useState([]); // 애니메이션을 적용할 항목을 추적
    const [isLogin, setIsLogin] = useState(true); // 더미데이터
    const [testUserId, setTestUserId] = useState(1); // 더미데이터

    const navigate = useNavigate();
    const location = useLocation();


    // 최초화면 로드 세팅
    useEffect(() => {
        // 로그인
        if (isLogin) {
            fetch(`http://localhost:8080/cart/${testUserId}`)
                .then(response => response.json())
                .then(cartDtos => {
                    fetchCartDetails(cartDtos)
                        .then(cartDetails => {
                            setItems(cartDetails);
                            console.log('서버 불러오기 완료', cartDetails);

                        })
                        .catch(error => console.error('Error fetching CartDetailDto:', error));
                })
                .catch(error => console.error('Error fetching cart items:', error));
        }
        // 비 로그인
        else {
            const localCart = JSON.parse(localStorage.getItem('cart')) || [];
            if (localCart.length === 0) {
                console.log("장바구니가 비어 있습니다.");
                return;
            }
            fetchCartDetails(localCart)
                .then(localDetails => {
                    setItems(localDetails);
                    console.log(localDetails);
                    updateTotalPrice(items);
                })
        }
    }, [isCartOpen]);

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
        }
        else if (validatedValue > maxQuantity) {
            alert(`보유 재고가 ${maxQuantity}개 입니다.`);
            validatedValue = maxQuantity;
        }
        const updatedItems = [...items];
        updatedItems[index].quantity = validatedValue;
        setItems(updatedItems);

        if (isLogin) {
            const cartItem = {
                optionId: updatedItems[index].optionId,
                quantity: updatedItems[index].quantity,
            };
            updateCartItemQuantity(testUserId, cartItem.optionId, cartItem);
        }
        else {
            updateLocalStorage(updatedItems);
        }
    };

    const removeItem = (index) => {
        // 삭제할 항목에 애니메이션 적용
        setAnimatedItems((prevAnimatedItems) => [...prevAnimatedItems, index]);

        // 애니메이션이 끝난 후 아이템 삭제 처리
        setTimeout(() => {
            // 선택한 인덱스와 일치하지 않는 항목들만 유지
            const targetOptionId = items[index].optionId;
            const updatedCartItems = items.filter((item, itemIndex) => itemIndex !== index);
            setItems(updatedCartItems);

            if(updatedCartItems.length < 0){
                return;
            }
            else if(isLogin === false) {
                // 로컬 스토리지에 업데이트된 장바구니 저장
                updateLocalStorage(updatedCartItems);
            }
            else if(isLogin){
                deleteCartItem(testUserId, targetOptionId);
            }
            // 애니메이션 적용 목록에서 삭제한 항목 제거
            setAnimatedItems((prevAnimatedItems) => prevAnimatedItems.filter((i) => i !== index));
        }, ANIMATION_DURATION); // 애니메이션 지속 시간에 맞춤
    };

    const toggleCart = () => {
        if (isCartOpen) {
            document.querySelector('.offcanvas').classList.remove('show');
            document.querySelector('.offcanvas-backdrop').classList.remove('show');
            setTimeout(() => setCartOpen(false), ANIMATION_DURATION);
        } else {
            //const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
            //setCartItems(storedCartItems);  // 최신화된 장바구니 항목을 설정
            //updateTotalPrice(storedCartItems);  // 총 금액 업데이트
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
                <button className="btn btn-dark btn-primary position-fixed end-0 m-3"
                        style={{top: '120px', width: '90px'}} onClick={goToLoginPage}>
                    로그인
                </button>

                {location.pathname !== '/cart' && (
                    <button className="btn btn-dark btn-primary position-fixed end-0 m-3"
                            style={{top: '170px', width: '90px'}} onClick={toggleCart}>
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

                    {items.length === 0 ? (
                        <div>
                            <div className="text-center my-5 ">

                                <i className="bi bi-emoji-frown  my-5" style={{fontSize: '7rem'}}></i>
                                <h2 className="my-4 bold">장바구니가 비어 있어요.</h2>
                                <h6 className="text-muted">장바구니에 추가한 아이템이 보이지 않으면 로그인 해주세요.</h6>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {items.map((item, index) => (
                                <div key={index}
                                     className={`cart-item mb-3  mx-5 ${animatedItems.includes(index) ? 'removing' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <img src={item.url} className="img-fluid rounded-2 col-xl-2"
                                             style={{width: '100px'}}/>
                                        <div className="col-xl-4">
                                            <h6 className="mb-1" style={{fontSize: '15px'}}>{item.name}</h6>
                                            <h6>₩ {item.price.toLocaleString()}</h6>
                                        </div>
                                        <div className="quantity-controls col-xl-3">
                                            <button className="quantity-button"
                                                    onClick={() => validateQuantity(index, item.quantity - 1)}>-
                                            </button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button className="quantity-button"
                                                    onClick={() => validateQuantity(index, item.quantity + 1)}>+
                                            </button>
                                        </div>
                                        <button className="delete-button" onClick={() => removeItem(index)}>
                                            <i className="bi bi-trash3" style={{fontSize: '1.2rem'}}></i>
                                        </button>
                                    </div>
                                    <hr/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="offcanvas-footer my-4">
                    <div className="total-price d-flex justify-content-between mx-4">
                        <h4>총 주문금액:</h4>
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
