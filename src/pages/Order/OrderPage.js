import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css';

function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderSummary;

  const [userEmail, setUserEmail] = useState('');
  const [recipient, setRecipient] = useState(''); // 수령인
  const [phoneNumber, setPhoneNumber] = useState(''); // 연락처
  const [address, setAddress] = useState(''); // 배송지 
  const [requirement, setRequirement] = useState(''); // 요구사항
  const [grade, setGrade] = useState(''); // 회원 등급
  const [error, setError] = useState(''); // 에러

  // 사용자 정보 가져오기
  useEffect(() => {
    console.log('Location state:', location.state);
    const fetchUserData = async () => {
      const userEmail = location.state?.email;

      console.log('Location state 전체:', location.state); 
      console.log('Order data:', orderData);
      console.log('User Email:', userEmail);

      if (!userEmail) {
        console.error("Order data가 없거나 email이 없습니다.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      console.error('유저 이메일이 없습니다.');
      alert('유저 이메일을 찾을 수 없습니다.');
      return;
     }

     console.log('Submitting order for userEmail:', userEmail);

     if (!recipient || !phoneNumber || !address) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

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

  console.log(orderData);

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
                  <div className="order-product-name">{item.productName}</div>
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

      {/* 주문 상품 가격 */ }
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

      {/* 주문 요청 정보 */ }
  <section className="order-delivery-info">
    <form onSubmit={handleSubmit}>
      <label style={{ marginTop: '30px' }}>
        수령인
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </label>
      <label>
        연락처
        <input
          type="text"
          name="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </label>
      <label>
        배송지 주소
        <input
          type="text"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </label>
      <label>
        주문요청사항
        <textarea
          name="requirement"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        ></textarea>
      </label>
      <div className="order-actions">
        <button type="button" className="order-back-button"  onClick={handleBackToCart}>
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