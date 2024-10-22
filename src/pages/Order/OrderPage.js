import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderSummary;
  const couponId = location.state?.couponId;

  const [userEmail, setUserEmail] = useState('');
  const [recipient, setRecipient] = useState(''); // 수령인
  const [phoneNumber, setPhoneNumber] = useState(''); // 연락처
  const [address, setAddress] = useState(''); // 배송지 
  const [requirement, setRequirement] = useState(''); // 요구사항
  const [grade, setGrade] = useState(''); // 회원 등급
  const [error, setError] = useState(''); // 전체 에러
  const [phoneError, setPhoneError] = useState(''); // 연락처 유효성 검사 에러 
  const [recipientError, setRecipientError] = useState(''); // 수령인 유효성 검사 에러
  const [addressError, setAddressError] = useState(''); // 배송지 유효성 검사 에러 

  // 연락처 유효성 검사
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^010\d{8}$/;
    return phoneRegex.test(phone);
  }

  // 카카오 우편번호 검색 함수
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        // 검색된 주소를 address 상태에 반영
        setAddress(data.address);
      },
    }).open();
  };

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      const userEmail = location.state?.email;

      if (!userEmail) {
        console.error("email이 없습니다.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/user/${userEmail}`);
        if (!response.ok) {
          throw new Error(`HTTP 에러 발생, 현재 상태: ${response.status}`);
        }

        const userData = await response.json();

        // 유저 정보 설정
        setUserEmail(userData.email);
        setRecipient(userData.name);
        setPhoneNumber(userData.phoneNumber);
        setAddress(userData.address);
        setGrade(userData.grade);
      } catch (error) {
        console.error('유저 데이터를 가져오는 중 오류 발생:', error.message);
        setError('유저 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };
    fetchUserData();
  }, [location.state]);

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const numbersOnly = input.replace(/\D/g, ''); // 숫자 이외의 문자는 제거
    if (numbersOnly.length <= 11) {
      setPhoneNumber(numbersOnly);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!recipient) {
      setRecipientError('수령인은 필수 입력 항목입니다.');
      hasError = true;
    } else {
      setRecipientError('');
    }

    if (!phoneNumber) {
      setPhoneError('연락처는 필수 입력 항목입니다.');
      hasError = true;
    } else if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError('유효한 연락처를 입력해 주세요.');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!address) {
      setAddressError('배송지 주소는 필수 입력 항목입니다.');
      hasError = true;
    } else {
      setAddressError('');
    }

    if (hasError) return;

    try {
      // 주문 데이터
      const orderRequestData = {
        recipient: recipient,
        phoneNumber: phoneNumber,
        address: address,
        requirement: requirement,
        orderDetails: orderData.orderDetail, // 주문 상세 정보 포함
      };
      const orderCartData = {
        userEmail: userEmail,
        cartTotalPrice: orderData.cartTotalPrice,
        orderDetails: orderData.orderDetail,
      };
      const combinedOrderData = {
        orderRequestDto: orderRequestData,
        orderCartRequestDto: orderCartData,
        userEmail: userEmail,
      };

      const response = await fetch(`http://localhost:8080/api/orders?userEmail=${userEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedOrderData),
      });
      console.log('응답 상태:', response.status);

      if (response.ok) {
        console.log('주문이 성공적으로 완료되었습니다.');

        // 장바구니 비우기 API 호출
        await fetch(`http://localhost:8080/api/cart?email=${userEmail}`, {
          method: 'DELETE',
        });
        console.log('장바구니가 성공적으로 비워졌습니다.');

        // 쿠폰 비활성화 API 호출
        if (couponId) {
          await fetch(`http://localhost:8080/api/coupon/use/${couponId}`, {
            method: 'POST',
          });
          console.log('쿠폰이 성공적으로 비활성화되었습니다.');
        }

        navigate('/order-success'); // 주문 성공 페이지 이동
      } else {
        const errorData = await response.json();
        console.error('서버 오류:', errorData);
        alert('주문에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('주문 처리 중 오류 발생:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  const handleBackToCart = () => {
    navigate('/cart'); // 돌아가기 버튼 클릭 시 장바구니 페이지로 이동
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderData) {
    return <div>주문 데이터가 없습니다.</div>;
  }

  // 가격 포맷 함수 
  const formatPriceWithWon = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  const formatPriceWithCurrency = (price) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(price);
  };

  return (
    <div className="order-page">
      {/* 상품 목록 */}
      <section className="order-product-list">
        <span className="order-section-title">상품목록</span>
        {orderData.orderDetail && orderData.orderDetail.length > 0 ? (
          <ul>
            {orderData.orderDetail.map((item, index) => (
              <li key={index} className="order-product-item">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="order-product-image"
                />
                <div className="order-product-details">
                  <div className="order-product-name">
                    {item.productName}
                  </div>
                  <div className="order-product-detail-name">{item.productDetailName}</div>
                  <div className="order-product-quantity">수량: {item.quantity}</div>
                  <div className="order-product-price">{formatPriceWithCurrency(item.productPrice)}</div>
                </div>
                <div className="order-total-price">{formatPriceWithCurrency(item.quantity * item.productPrice)}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <li>상품 정보가 없습니다.</li>
        )}
      </section>

      {/* 회원 등급 */}
      <section className="order-membership">
        <span className="order-membership">회원 등급</span>
        <span>{grade}</span>
      </section>

      {/* 주문 상품 가격 */}
      < section className="order-summary">
        <div className="order-summary-left">
          <span className="order-summary-title">총 결제 금액</span>
        </div>
        <div className="order-summary-right">
          <div className="price-summary-item">
            <span className="price-summary-label">쿠폰 적용 후 가격</span>
            <span>{formatPriceWithWon(orderData.cartTotalPrice)}</span>
          </div>
          <div className="price-summary-item">
            <span className="price-summary-label">배송비</span>
            <span>{formatPriceWithWon(orderData.deliveryPrice)}</span>
          </div>
          <div className="price-summary-item">
            <span className="price-summary-label">회원 할인</span>
            <span>{orderData.discountRate * 100}%</span>
          </div>
          <div className="total-price">
            <span className="final-price">{formatPriceWithCurrency(orderData.totalPrice)}</span>
          </div>
        </div>
      </section>

      {/* 주문 요청 정보 */}
      <section className="order-delivery-info">
        <form onSubmit={handleSubmit}>
          <div className="order-input-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ marginTop: '30px' }}>
              수령인<span className="required-star">*</span>
            </label>
            <span className="required-notice">*: 필수 입력 항목</span>
          </div>
          <input
            className={`recipient-input ${recipientError ? 'input-error' : ''}`}
            type="text"
            name="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {recipientError && <span className="error-text">{recipientError}</span>}

          <div style={{ marginTop: '-10px' }}>
            <label>
              연락처<span className="required-star">*</span>
              <div className="phone-container" style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber}
                  maxLength={11} // 최대 11자리
                  minLength={11} // 최소 11자리 
                  onChange={handlePhoneChange}
                  className={`order-input ${phoneError ? 'input-error' : ''}`}
                />
              </div>
            </label>
            {phoneError && <span className="error-text">{phoneError}</span>}
          </div>

          <label>
            배송지 주소<span className="required-star">*</span>
            <div className="address-container" style={{ position: 'relative' }}>
              <input
                className={`address-input ${addressError ? 'input-error' : ''}`}
                type="text"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                className="address-search"
                type="button"
                onClick={handleAddressSearch}
              >
                배송지 변경
              </button>
            </div>
          </label>
          {addressError && <span className="error-text">{addressError}</span>}

          <label>
            주문시 요청사항
            <textarea
              name="requirement"
              value={requirement}
              maxLength={100} // 글자수 제한 100자
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="(예: 부재 시 문 앞에 놓아주세요)"
            ></textarea>
          </label>

          <div className="order-actions">
            <button type="button" className="order-back-button" onClick={handleBackToCart}>
              돌아가기
            </button>
            <button type="submit" className="order-submit-button">
              주문하기
            </button>
          </div>
        </form>
      </section>
    </div >
  );
}

export default OrderPage;