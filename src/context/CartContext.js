import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { fetchCartDetails } from '../utils/cartUtils';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); // 사이드패널 열림/닫힘 상태 관리
    const { isLogin, email } = useAuth(); // 인증 상태와 이메일 가져오기

    // 장바구니 데이터 로드 함수
    const loadCartData = useCallback(async () => {
        try {
            if (isLogin) {
                const response = await fetch(`http://localhost:8080/api/cart?email=${email}`);
                const cartDetailDtos = await response.json();
                setItems(cartDetailDtos);
                console.log('Cart 동기화 완료:', cartDetailDtos);
            } else {
                const localCart = JSON.parse(localStorage.getItem('cart')) || [];
                if (localCart.length === 0) {
                    console.log('장바구니가 비어 있습니다.');
                    return;
                }
                const localDetails = await fetchCartDetails(localCart);
                setItems(localDetails);
                console.log('Cart 불러오기 완료:', localDetails);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    }, [isLogin, email]);

    // 초기 데이터 로드
    useEffect(() => {
        loadCartData();
    }, [loadCartData, isLogin]); // 로그인 상태가 바뀔 때도 다시 로드

    return (
        <CartContext.Provider value={{
            items,
            totalPrice,
            setItems,
            setTotalPrice,
            loadCartData,
        }}>
            {children}
        </CartContext.Provider>
    );
};
