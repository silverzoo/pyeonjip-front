import React, { useState, useEffect } from 'react';
import './animation.css'; // CSS 파일 경로에 맞게 수정하세요.

function CartApp() {
    const [coupons, setCoupons] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [previousTotal, setPreviousTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [animatedTotal, setAnimatedTotal] = useState(0); // 애니메이션된 총 가격
    const [animatedDiscountedPrice, setAnimatedDiscountedPrice] = useState(0); // 애니메이션된 할인된 가격

    useEffect(() => {
        fetch('http://localhost:8080/cart')
            .then(response => response.json())
            .then(data => setCoupons(data))
            .catch(error => console.error('Error fetching data:', error));

        const storedCartItems = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(storedCartItems);
        updateTotalPrice(storedCartItems);
    }, []);

    useEffect(() => {
        updateTotalPrice(cartItems);
    }, [couponDiscount, isCouponApplied]); // 두 값이 변경될 때마다 실행

    useEffect(() => {
        if (cartItems.length > 0) {
            updateTotalPrice(cartItems);
        }
    }, [cartItems]);

    const updateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            if (item.check) {
                total += item.price * item.quantity;
            }
        });

        const discount = isCouponApplied ? total * (couponDiscount / 100) : 0;
        const discountedTotal = total - discount;

        // 애니메이션
        animateTotalPrice(discountedTotal, discount);

        // 상태 업데이트
        setPreviousTotal(total); // 실제 총 금액을 저장합니다 (할인 전 금액).
        setItemCount(items.filter(item => item.check).length);
    };

    const animateTotalPrice = (newTotal, discount) => {
        const duration = 200; // 애니메이션 지속 시간 (ms)
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
        const coupon = coupons.find(c => c.promocode === couponCode);

        if (coupon) {
            setCouponDiscount(coupon.percent);
            setIsCouponApplied(true);
            alert(`쿠폰이 적용되었습니다: ${coupon.percent}% 할인`);

        } else {
            setCouponDiscount(0);
            setIsCouponApplied(false);
            alert('유효하지 않은 쿠폰 코드입니다.');
        }
        //updateTotalPrice(cartItems);
    };

    const validateQuantity = (index, value) => {
        const min = 0;
        const max = 999;
        let validatedValue = parseInt(value, 10);
        if (isNaN(validatedValue) || validatedValue < min) {
            validatedValue = 1;
        } else if (validatedValue > max) {
            validatedValue = 999;
        }
        const newCartItems = [...cartItems];
        newCartItems[index].quantity = validatedValue;
        setCartItems(newCartItems);
        localStorage.setItem('cart', JSON.stringify(newCartItems));
        //updateTotalPrice(newCartItems);
    };

    const handleCheckboxChange = (index) => {
        const newCartItems = [...cartItems];
        newCartItems[index].check = !newCartItems[index].check;
        setCartItems(newCartItems);
        localStorage.setItem('cart', JSON.stringify(newCartItems));
        //updateTotalPrice(newCartItems);
    };

    const handleDeleteItem = (index) => {
        const newCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(newCartItems);
        localStorage.setItem('cart', JSON.stringify(newCartItems));
        //updateTotalPrice(newCartItems);
    };

    const handleCouponApply = () => {
        const couponCode = document.getElementById('form3Examplea2').value;
        applyCouponDiscount(couponCode);
    };

    return (
        <section className="h-100 h-custom" style={{ backgroundColor: '#ffffff' }}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12">
                        <div className="card card-registration card-registration-2" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-0">
                                <div className="row g-0">
                                    <div className="col-lg-8">
                                        <div className="p-5">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h1 className="fw-bold mb-0">장바구니</h1>
                                                <h6 className="mb-0 text-muted">{itemCount} 개 아이템 선택</h6>
                                            </div>
                                            <hr className="my-3" />
                                            <div id="cartItemsContainer">
                                                {cartItems.map((item, index) => (
                                                    <div key={index} className="row mb-2 d-flex justify-content-between align-items-center cart-item">
                                                        <div className="form-check col-md-1 col-lg-1">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={item.check}
                                                                onChange={() => handleCheckboxChange(index)}
                                                                data-price={item.price}
                                                                data-item-id={item.id}
                                                                data-name={item.name}
                                                                data-category={item.category}
                                                                data-image={item.image}
                                                            />
                                                            <label className="form-check-label"></label>
                                                        </div>
                                                        <div className="col-md-2 col-lg-2 col-xl-1">
                                                            <img src={item.image} className="img-fluid rounded-3" alt={item.name} />
                                                        </div>
                                                        <div className="col-md-3 col-lg-3 col-xl-3">
                                                            <h6 className="text-muted">{item.category}</h6>
                                                            <h6 className="mb-0">{item.name}</h6>
                                                        </div>
                                                        <div className="col-md-2 col-lg-1 col-xl-2">
                                                            <input
                                                                type="number"
                                                                className="form-control quantity"
                                                                value={item.quantity}
                                                                min="0"
                                                                onChange={(e) => validateQuantity(index, e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-2">
                                                            <h6 className="mb-0">₩ {item.price.toLocaleString()}</h6>
                                                        </div>
                                                        <div className="col-md-1 col-lg-1">
                                                            <button onClick={() => handleDeleteItem(index)} ><i className="bi bi-trash3"></i></button>
                                                        </div>
                                                        <hr className="my-4" />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="row mb-2 d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0 text-muted"><i className="bi bi-arrow-left"></i> 뒤로가기</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-4 bg-body-tertiary">
                                        <div className="p-5">
                                            <h3 className="fw-bold mb-2 mt-2 pt-1">Summary</h3>
                                            <hr className="my-3" />
                                            <div className="d-flex justify-content-between mb-3">
                                                <h5 className="text-uppercase">Total price</h5>
                                                <h5 id="totalPriceDisplay">₩ {animatedTotal.toLocaleString()}</h5>
                                            </div>
                                            <div className="d-flex justify-content-between mb-3" id="discountRow" style={{ display: couponDiscount > 0 ? 'flex' : 'none' }}>
                                                <h6 className="text-muted">Discount</h6>
                                                <h6 id="discountedPriceDisplay">₩ {animatedDiscountedPrice.toLocaleString()}</h6>
                                            </div>
                                            <div className="d-grid gap-2">
                                                <select className="form-select mb-4 pb-2" aria-label="Default select example">
                                                    <option selected>결제 방법 선택</option>
                                                    <option value="1">신용카드</option>
                                                    <option value="2">토스</option>
                                                    <option value="3">카카오 페이</option>
                                                    <option value="4">무통장 입금</option>
                                                </select>
                                            </div>
                                            <h5 className="text-uppercase mb-2">쿠폰</h5>
                                            <div className="mb-2">
                                                <div className="form-outline d-flex">
                                                    <input type="text" id="form3Examplea2" className="form-control form-control-md" />
                                                    <button type="button" className="btn btn-dark btn-md ms-2 align-self-end" onClick={handleCouponApply}>apply</button>
                                                </div>
                                            </div>
                                            <hr className="my-4" />
                                            <form id="checkoutForm" action="/public" method="POST">
                                                <div id="itemDetailsContainer"></div>
                                                <input type="hidden" id="totalPriceInput" name="totalPrice" value={previousTotal} />
                                                <input type="hidden" id="itemCountInput" name="itemCount" value={itemCount} />
                                                <button type="submit" className="btn btn-dark btn-lg mb-1">결제하기</button>
                                            </form>
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

export default CartApp;
