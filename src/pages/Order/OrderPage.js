import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderPage.css';      

function OrderPage() {
  const [recipient, setRecipient] = useState(''); // 수령인
  const [phoneNumber, setPhoneNumber] = useState(''); // 연락처
  const [address, setAddress] = useState(''); // 배송지 
  const [requirement, setRequirement] = useState(''); // 요구사항
  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템
  const [loading, setLoading] = useState(true); // 로딩
  const [error, setError] = useState(''); // 에러
  const [grade, setGrade] = useState(''); // 회원 등급
  const [totalPrice, setTotalPrice] = useState(0); // 결제 금액 
  const navigate = useNavigate(); // 

  // 장바구니 상품 및 사용자 정보 가져오기
  useEffect(() => {
    const fetchCartItemsAndUserInfo = async () => {
      try {
        // 임의의 사용자 데이터 설정
        setRecipient('홍길동');
        setPhoneNumber('010-1234-5678');
        setAddress('서울특별시 중구');
        setGrade('BRONZE');
        
        // 임의의 장바구니 데이터 설정 
        const cartData = [
          { id: 1, productName: '상품1', price: 10000, quantity: 1 },
          { id: 2, productName: '상품2', price: 20000, quantity: 2 }
        ];
        setCartItems(cartData);

        // 회원 등급에 따른 할인율 및 배송비 계산
        //const discountRate = grade === 'VIP' ? 0.1 : grade === 'GOLD' ? 0.05 : 0;
        //const shippingCost = grade === 'VIP' ? 0 : 3000;

        //const cartTotal = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);  // 장바구니 총 가격
        //const discount = cartTotal * discountRate;  // 할인 금액 계산
        //const finalPrice = cartTotal - discount + shippingCost;  // 최종 결제 금액 계산
        const finalPrice = 50000;
        
        setTotalPrice(finalPrice);  // 총 결제 금액 상태 업데이트
        setLoading(false);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error.message);
        setError('데이터를 가져오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchCartItemsAndUserInfo();
  }, [cartItems, grade]); // 장바구니, 회원 등급 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipient || !phoneNumber || !address) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    // 주문 데이터 생성
    const orderData = {
      recipient,
      phoneNumber,
      requirement,
      orderDetails: cartItems.map(item => ({
        productName: item.productName,
        productPrice: item.price,
        quantity: item.quantity,
      })),
      address,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderData);
      if (response.status === 200) {
        alert('주문이 성공적으로 생성되었습니다!');
        navigate('/'); // 주문 성공 후 메인 페이지로 이동
      }
    } catch (error) {
      console.error('주문 생성 중 오류 발생:', error);
      alert('주문 생성에 실패했습니다.');
    }
  };

  const handleBackToCart = () => {
    navigate('/cart'); // 돌아가기 버튼 클릭 시 장바구니 페이지로 이동
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-page">
      <main className="content">
        {/* Product List */}
        <section className="product-list">
          <h6>상품목록</h6>
          {cartItems.map(item => (
            <div className="product-item" key={item.id}>
              <img src={item.imageUrl} alt={item.productName} />
              <div>
                <p>{item.productName}</p>
                <p>수량: {item.quantity}</p>
                <p>₩ {item.price}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 회원 등급 */}
        <section className="membership">
          <h6>회원 등급: {grade}</h6>
        </section>

        {/* 상품 정보*/}
        <section className="order-summary">
          <div className="order-summary-left">
            <h6>총 결제 금액</h6>
          </div>
          <div className="order-summary-right">
            <div className="price-summary-item">
              <span className="price-summary-label">쿠폰 적용 후 가격</span>
              <span>1,699,000원</span>
            </div>
            <div className="price-summary-item">
              <span className="price-summary-label">배송비</span>
              <span>3000원</span>
            </div>
            <div className="price-summary-item">
              <span className="price-summary-label">할인</span>
              <span>0</span>
            </div>
            <div className="total-price">
              <span>=</span>
              <span className="final-price">₩{totalPrice}</span>
            </div>
          </div>
        </section>


        {/* 배송 정보*/}
        <section className="delivery-info">
          <form onSubmit={handleSubmit}>
            <label>
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
            <div className="actions">
              <button type="button" className="back-button" onClick={handleBackToCart}>
                돌아가기
              </button>
              <button type="submit" className="submit-button">
                주문하기
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

export default OrderPage;