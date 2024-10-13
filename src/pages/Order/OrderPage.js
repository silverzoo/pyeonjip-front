import React from 'react';
import './Page.css';

function OrderPage() {
  return (
    <div className="order-page">
      <main className="content">
        {/* Product List */}
        <section className="product-list">
          <h6>상품목록</h6>
          <div className="product-item">
            <img src="path/to/product1.jpg" alt="Product 1" />
            <div>
              <p>어니언 LED 책상램프 케일리 밀라리</p>
              <p>수량: 1</p>
              <p>₩ 252,900</p>
            </div>
          </div>
          <div className="product-item">
            <img src="path/to/product2.jpg" alt="Product 2" />
            <div>
              <p>패브릭 디자인 식탁 커버의자</p>
              <p>수량: 1</p>
              <p>₩ 53,900</p>
            </div>
          </div>
        </section>

        {/* Membership Level */}
        <section className="membership">
          <h6>회원 등급</h6>
        </section>

        {/* Order Summary */}
        <section className="order-summary">
          <div className="order-summary-left">
            <p>총 결제 금액</p>

          </div>
          <div className="order-summary-right">
            <p>쿠폰 적용 후 가격</p>
            <p>배송비</p>
            <p>할인</p>
          </div>
          <div className="total-price">
            <p>₩ 306,800</p>
            <p>₩ 3,000</p>
            <p>₩ 0</p>
          
          <span>= ₩ 309,800</span>
        </div>
        </section>

    

        {/* Delivery Info */}
        <section className="delivery-info">
          <form>
            <label>
              수령인
              <input type="text" name="recipient" />
            </label>
            <label>
              연락처
              <input type="text" name="phoneNumber" />
            </label>
            <label>
              배송지 주소
              <input type="text" name="address" />
            </label>
            <label>
              주문요청사항
              <textarea name="requirement"></textarea>
            </label>
          </form>
        </section>

        {/* Action Buttons */}
        <div className="actions">
          <button className="back-button">돌아가기</button>
          <button className="submit-button">주문하기</button>
        </div>
      </main>
    </div>
  );
}

export default OrderPage;