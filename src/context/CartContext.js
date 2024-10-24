import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { fetchCartDetails } from '../utils/cartUtils';
import { useAuth } from './AuthContext';

const CartContext = createContext();
const BASE_URL = "https://dsrkzpzrzxqkarjw.tunnel-pt.elice.io";

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { isLoggedIn, email } = useAuth();

    const loadCartData = useCallback(async () => {
        try {
            if (isLoggedIn) {
                const response = await fetch(BASE_URL + `/api/cart?email=${email}`);
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
    }, [isLoggedIn, email]);

    useEffect(() => {
        loadCartData();
    }, [loadCartData, isLoggedIn]);

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
