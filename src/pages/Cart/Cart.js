import React, {useState, useEffect} from 'react';
import './Cart.css';
import {useNavigate} from 'react-router-dom';
import {fetchCartDetails, updateLocalStorage, deleteCartItem,deleteAllCartItems, updateCartItemQuantity} from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ANIMATION_DURATION = 400;

function CartApp() {
    const [coupons, setCoupons] = useState([]);
    const [items, setItems] = useState([]);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [previousTotal, setPreviousTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [animatedTotal, setAnimatedTotal] = useState(0); // 애니메이션된 총 가격
    const [animatedDiscountedPrice, setAnimatedDiscountedPrice] = useState(0); // 애니메이션된 할인된 가격
    const [animatedItems, setAnimatedItems] = useState([]); // 애니메이션을 적용할 항목을 추적
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true); // 더미데이터
    const [testUserId, setTestUserId] = useState(1); // 더미데이터


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
        // 쿠폰 가져오기
        fetch('http://localhost:8080/coupon')
            .then(response => response.json())
            .then(coupons => {
                setCoupons(coupons);
                console.log(coupons);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            updateTotalPrice(items);
        }
    }, [items, isCouponApplied]);

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


        if (isLogin) {// 로그인 상태일 때 수량 변경 API 호출
            const cartItem = {
                optionId: updatedItems[index].optionId,
                quantity: updatedItems[index].quantity,
            };
            updateCartItemQuantity(testUserId, cartItem.optionId, cartItem);

        } else {
            updateLocalStorage(updatedItems);
        }
    };

    const updateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            total += item.price * item.quantity;
        });
        // 할인 적용
        const discount = isCouponApplied ? total * (couponDiscount / 100) : 0;
        const discountedTotal = total - discount;
        animateTotalPrice(discountedTotal, discount);
        // 상태 업데이트
        setPreviousTotal(total);
        setItemCount(items.length);
    };

    const animateTotalPrice = (newTotal, discount) => {
        const duration = ANIMATION_DURATION; // 애니메이션 지속 시간 (ms)
        const startTime = performance.now();
        const startValue = animatedTotal;
        const startDiscountValue = animatedDiscountedPrice;

        const animate = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // 0에서 1로 진행
            const currentValue = Math.floor(startValue + (newTotal - startValue) * progress);
            const currentDiscountedValue = Math.floor(startDiscountValue + (discount - startDiscountValue) * progress);

            setAnimatedTotal(currentValue);
            setAnimatedDiscountedPrice(currentDiscountedValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // 애니메이션 완료 후 최종값 설정
                setTotalPrice(newTotal);
            }
        };
        requestAnimationFrame(animate);
    };

    const applyCouponDiscount = (couponCode) => {
        setIsCouponApplied(false);
        const coupon = coupons.find(c => c.code === couponCode);

        if (!coupon) {
            return alert('유효하지 않은 쿠폰 코드입니다.');
        }
        if (!coupon.active) {
            return alert('이미 사용한 쿠폰입니다.');
        }

        const expiryDate = new Date(coupon.expiryDate);
        const currentDate = new Date();
        if (currentDate > expiryDate) {
            return alert('만료된 쿠폰입니다.');
        }
        setCouponDiscount(coupon.discount);
        setIsCouponApplied(true);
        alert(`쿠폰이 적용되었습니다: ${coupon.discount}% 할인`);
    };

    const handleDeleteItem = (index) => {
        // 삭제할 항목에 애니메이션 적용
        setAnimatedItems((prevAnimatedItems) => [...prevAnimatedItems, index]);

        // 애니메이션이 끝난 후 아이템 삭제 처리
        setTimeout(() => {
            // 선택한 인덱스와 일치하지 않는 항목들만 유지
            const targetOptionId = items[index].optionId;
            const updatedCartItems = items.filter((item, itemIndex) => itemIndex !== index);
            setItems(updatedCartItems);

            if (updatedCartItems.length < 0) {
                return;
            } else if (isLogin === false) {
                // 로컬 스토리지에 업데이트된 장바구니 저장
                updateLocalStorage(updatedCartItems);
            } else if (isLogin) {
                deleteCartItem(testUserId, targetOptionId);
            }
            // 애니메이션 적용 목록에서 삭제한 항목 제거
            setAnimatedItems((prevAnimatedItems) => prevAnimatedItems.filter((i) => i !== index));
        }, ANIMATION_DURATION); // 애니메이션 지속 시간에 맞춤
    };

    const handleCouponApply = () => {
        const couponCode = document.getElementById('couponApply').value;
        applyCouponDiscount(couponCode);
    };

    const deleteAll = () => {
        // 모든 항목에 대해 애니메이션을 적용
        setAnimatedItems(items.map((_, index) => index));

        // 애니메이션이 끝난 후 모든 항목을 삭제 처리
        setTimeout(() => {
            setItems([]);

            if (isLogin === false) {
                // 로컬 스토리지에서 장바구니 비우기
                updateLocalStorage([]);
            } else {
                deleteAllCartItems(testUserId);
            }
            // 모든 항목의 애니메이션 목록 초기화
            setAnimatedItems([]);
        }, ANIMATION_DURATION); // 애니메이션 지속 시간 후에 실행
    };


    return (
        <section className="container-fluid" style={{width: '110%', marginTop: '10vh'}}>
            <div className="row d-flex justify-content-between align-items-end h-100">
                <div className="col-12 col-xl-12">
                    <div className="card border-1 card-registration card-registration-2">
                        <div className="card-body p-1">
                            <div className="row g-1">
                                <div className=" col-xl-8">
                                    <div className="p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div
                                                className="cart-header d-flex justify-content-between align-items-center">
                                                <h2 className="fw-bold mb-0">장바구니</h2>
                                                <i className="bi bi-cart3 mx-3" style={{fontSize: '2rem'}}></i>
                                            </div>
                                            <h6 className="mb-0 text-muted">{itemCount}개 아이템</h6>
                                        </div>
                                        <hr className="my-3"/>

                                        {items.length === 0 ? (

                                            <div className="text-center my-5">
                                                <i className="bi bi-emoji-frown my-5" style={{fontSize: '4rem'}}></i>
                                                <h3 className="my-4 bold">장바구니가 비어 있습니다.</h3>
                                                <h6 className="text-muted">장바구니에 추가한 아이템이 보이지 않으면 로그인 해주세요.</h6>
                                            </div>
                                        ) : (

                                            <div id="cartItemsContainer">
                                                {items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={`row mb-2 d-flex justify-content-between align-items-center cart-item ${animatedItems.includes(index) ? 'fade-out' : ''}`}
                                                    >
                                                        <div className="col-md-2 col-lg-2 col-xl-2">
                                                            <a href='/cart/sandbox'>
                                                                <img src={item.url} className="img-fluid rounded-3"/>
                                                            </a>

                                                        </div>
                                                        <div className="col-md-3 col-lg-3 col-xl-3 ">
                                                            <a href='/cart/sandbox'
                                                               style={{
                                                                   textDecoration: 'none',
                                                                   color: 'inherit',
                                                                   textAlign: 'left'
                                                               }}
                                                            >
                                                                <h6 className="text-muted"
                                                                    style={{
                                                                        fontSize: '0.8rem',
                                                                    }}
                                                                >{item.optionName}</h6>
                                                                <h5 className="mb-0"
                                                                    style={{
                                                                        fontSize: '1.1rem',
                                                                    }}
                                                                >{item.name}</h5>
                                                            </a>
                                                        </div>
                                                        <div
                                                            className="col-md-2 col-lg-1 col-xl-2 d-flex align-items-center">
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

                                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                            <h6 className="mb-0">₩ {item.price.toLocaleString()}</h6>
                                                        </div>
                                                        <div className="col-md-1 col-lg-1">
                                                            <button className="delete-button"
                                                                    onClick={() => handleDeleteItem(index)}>
                                                                <i className="bi bi-trash3"
                                                                   style={{fontSize: '1.2rem'}}></i>
                                                            </button>
                                                        </div>
                                                        <hr className="my-3"/>
                                                    </div>
                                                ))}

                                            </div>
                                        )}
                                        <div className="back-button-container d-flex justify-content-between">
                                            <h5
                                                className="mb-0 text-muted back-button"
                                                onClick={() => navigate(-1)}
                                                style={{cursor: 'pointer'}}
                                            >
                                                <i className="bi bi-arrow-left"></i> 뒤로가기
                                            </h5>


                                            <h6 className="delete-button"
                                                onClick={() => deleteAll()}
                                            >
                                                전체삭제 <i className="bi bi-trash3 my-1 "
                                                   style={{fontSize: '1.2rem'}}></i>

                                            </h6>

                                        </div>

                                    </div>
                                </div>
                                <div className="col-xl-4 bg-body-tertiary">
                                    <div className="p-5">
                                        <h3 className="fw-bold mb-2 mt-2 pt-1 d-flex justify-content-between">Summary</h3>
                                        <hr className="my-3"/>
                                        <div className="d-flex justify-content-between mb-3">
                                            <h5 className="text-uppercase">Total price</h5>
                                            <h5 id="totalPriceDisplay">₩ {animatedTotal.toLocaleString()}</h5>
                                        </div>

                                        {couponDiscount > 0 && (
                                            <div className="d-flex justify-content-between mb-3 my-4" id="discountRow">
                                                <h6 className="text-muted">Discount</h6>
                                                <h6 id="discountedPriceDisplay">₩ {animatedDiscountedPrice.toLocaleString()}</h6>
                                            </div>
                                        )}

                                        <h5 className="text-uppercase mb-2  d-flex justify-content-between">쿠폰</h5>

                                        <div className="form-outline d-flex ">
                                            <input type="text" id="couponApply"
                                                   className="form-control form-control-md my-1"
                                                   style={{height: '38px'}}
                                            />
                                            <button type="button"
                                                    className="btn btn-dark btn-md ms-2 align-self-end my-1"
                                                    onClick={handleCouponApply}>apply
                                            </button>
                                        </div>

                                        <hr className="my-4"/>
                                        <form id="checkoutForm" action="/public" method="POST">
                                            <div id="itemDetailsContainer"></div>
                                            <input type="hidden" id="totalPriceInput" name="totalPrice"
                                                   value={previousTotal}/>
                                            <input type="hidden" id="itemCountInput" name="itemCount"
                                                   value={itemCount}/>
                                            <button type="submit"
                                                    className="btn btn-dark btn-lg mb-1 col-lg-10 col-xl-12">결제하기
                                            </button>
                                        </form>
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

export default CartApp;
