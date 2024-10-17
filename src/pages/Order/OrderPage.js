import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderPage.css'; 

function OrderPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state?.orderSummary;

    const [userId, setUserId] = useState('');
    const [recipient, setRecipient] = useState(''); // 수령인
    const [phoneNumber, setPhoneNumber] = useState(''); // 연락처
    const [address, setAddress] = useState(''); // 배송지 
    const [requirement, setRequirement] = useState(''); // 요구사항
    const [grade, setGrade] = useState(''); // 회원 등급
    const [loading, setLoading] = useState(true); // 로딩
    const [error, setError] = useState(''); // 에러

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserData = async () => {
          const userId = 1;
            try {
                const response = await fetch(`http://localhost:8080/api/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const userData = await response.json();

                // 유저 정보 설정
                setUserId(1);
                setRecipient(userData.name);
                setPhoneNumber(userData.phoneNumber);
                setAddress(userData.address);
                setGrade(userData.grade);

                // 로딩 상태 업데이트
                setLoading(false);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류 발생:', error.message);
                setError('데이터를 가져오는 중 오류가 발생했습니다.');
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recipient || !phoneNumber || !address) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        try {
          // 주문 데이터를 DTO에 맞춰 구성
          const orderRequestData = {
            recipient: recipient,
            phoneNumber: phoneNumber,
            address: address,
            requirement: requirement,
            orderDetails: orderData.orderDetail, // 주문 상세 정보를 포함
        };

            const orderCartData = {
                userId: 1,
                cartTotalPrice: orderData.cartTotalPrice,
                orderDetails: orderData.orderDetail,
            };

                  const combinedOrderData = {
                    orderRequestDto: orderRequestData,
                    orderCartRequestDto: orderCartData,
                    userId: 1,
                };

      const response = await fetch(`http://localhost:8080/api/orders?userId=${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedOrderData),    
    });
          console.log('응답 상태:', response.status);
  
          if (response.ok) {
              // console.log('주문이 성공적으로 완료되었습니다.');
              navigate('/order-success');
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

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!orderData) {
        return <div>주문 데이터가 없습니다.</div>;
    }

    console.log(orderData);

    return (
        <div className="order-page">
            <main className="content">
                {/* Product List */}
                <section className="product-list">
                    <h6 className="section-title">상품목록</h6>
                    {orderData.orderDetail && orderData.orderDetail.length > 0 ? (
                        <ul>
                        {orderData.orderDetail.map((item, index) => (
                            <li key={index} className="product-item">
                                <img
                                    src={item.productImage}
                                    alt={item.productName}
                                    className="product-image"
                                />
                                <div className="product-details">
                                    <div className="product-name">{item.productName}</div>
                                    <div className="product-price">₩{item.productPrice}</div>
                                </div>
                                <div className="product-summary">
                                    <div className="product-quantity">수량: {item.quantity}</div>
                                    <div className="subtotal-price"></div>
                                      ₩{(item.quantity * item.productPrice)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    ) : (
                        <li>상품 정보가 없습니다.</li>
                    )}
                </section>

                {/* 회원 등급 */}
                <section className="membership">
                    <h6>회원 등급: {grade}</h6>
                </section>

                {/* 상품 정보 */}
                <section className="order-summary">
                    <div className="order-summary-left">
                        <h6>총 결제 금액</h6>
                    </div>
                    <div className="order-summary-right">
                        <div className="price-summary-item">
                            <span className="price-summary-label">쿠폰 적용 후 가격</span>
                            <span>₩{orderData.cartTotalPrice}</span>
                        </div>
                        <div className="price-summary-item">
                            <span className="price-summary-label">배송비</span>
                            <span>₩{orderData.deliveryPrice}</span>
                        </div>
                        <div className="price-summary-item">
                            <span className="price-summary-label">할인율</span>
                            <span>{orderData.discountRate * 100}%</span>
                        </div>
                        <div className="total-price">
                            <span>=</span>
                            <span className="final-price">₩{orderData.totalPrice}</span>
                        </div>
                    </div>
                </section>

                {/* 배송 정보 */}
                <section className="delivery-info">
                    <form onSubmit={handleSubmit}>
                        <label>
                            수령인
                            <input
                                type="text"
                                name="name"
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
                            <button type="button" className="order-back-button" onClick={handleBackToCart}>
                                돌아가기
                            </button>
                            <button type="submit" className="order-submit-button">
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