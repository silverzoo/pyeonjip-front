import {getUserEmail} from "./authUtils";

export const addServerCart = (cart, email) => {
// 로그인 상태: 서버로 장바구니 항목 추가
fetch(`/api/cart?email=${email}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(cart),
})
    .then(response => response.json())
    .then(data => {
        console.log('데이터 Add 완료', data);
    })
    .catch(error => {
        console.error('Error adding item to server cart:', error);
    });
};

export const addLocalCart = (cart, selectedDetail) => {
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = currentCart.findIndex(cartItem => cartItem.optionId === selectedDetail.id);

    if (itemIndex !== -1) {
        currentCart[itemIndex].quantity += 1;
    } else {
        currentCart.push({ ...cart, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
}

// 로컬스토리지 -> 서버
export const syncWithLocal = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if(cart === null){
        console.log('cart is empty');
        return;
    }
    const email = getUserEmail();
    fetch(`/api/cart/sync?email=${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cart),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 좋지 않습니다. 상태 코드: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('동기화 완료:', data);
        })
        .catch(error => {
            console.error('동기화 에러:', error);
        });
};

// 서버 -> 로컬
export const syncWithServer = async (email) => {
    try {
        const response = await fetch(`/api/cart/sync?email=${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`서버 응답이 좋지 않습니다. 상태 코드: ${response.status}`);
        }

        const serverCart = await response.json(); // 서버 데이터를 JSON으로 파싱
        const localCart = JSON.parse(localStorage.getItem('cart')) || []; // 로컬 스토리지에 저장된 장바구니 데이터 가져오기

        // 서버 데이터와 로컬 스토리지 데이터를 병합
        const mergedCart = [...localCart]; // 기존 로컬 장바구니 데이터를 복사

        serverCart.forEach(serverItem => {
            const existingItem = mergedCart.find(localItem => localItem.optionId === serverItem.optionId);
            if (existingItem) {
                // 같은 항목이 로컬에 있을 경우 수량을 업데이트
                existingItem.quantity = serverItem.quantity;
            } else {
                // 로컬에 없는 항목일 경우 서버 데이터를 추가
                mergedCart.push(serverItem);
            }
        });

        // 병합된 데이터를 로컬 스토리지에 저장
        localStorage.setItem('cart', JSON.stringify(mergedCart));
        console.log('동기화 완료', mergedCart);
    } catch (error) {
        console.error('동기화 에러:', error);
    }
};

// 로컬스토리지 장바구니 업데이트
export const updateLocalStorage = (items) => {
    const target = items.map(item => ({
        optionId: item.optionId,
        quantity: item.quantity,
        //isChecked: item.isChecked
    }));
    localStorage.setItem('cart', JSON.stringify(target));
};


const buildQueryString = (cartDtos) => {
    const params = new URLSearchParams();
    cartDtos.forEach(dto => {
        params.append('optionId', dto.optionId);
        params.append('quantity', dto.quantity);
    });
    return params.toString();
};

export const fetchCartDetails = (cartDtos) => {
    const queryString = buildQueryString(cartDtos);
    return fetch(`/api/cart/detail?${queryString}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching CartDetailDto:', error);
            throw error;
        });
};

export const updateCartItemQuantity = (email, quantity, cartItem) => {
    fetch(`/api/cart/${cartItem.optionId}?email=${email}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 좋지 않습니다. 상태 코드: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('수량 변경 동기화 완료:', data);
        })
        .catch(error => {
            console.error('동기화 에러:', error);
        });
}


export const deleteCartItem = (email, optionId) => {
    fetch(`/api/cart/${optionId}?email=${email}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 좋지 않습니다. 상태 코드: ' + response.status);
            }
            if (response.status === 204) {
                return null; // 응답 본문이 없는 경우
            }
            return response.json();
        })
        .then(data => {
            console.log('서버 해당 항목 삭제 완료');
        })
        .catch(error => {
            console.error('동기화 에러:', error);
        });
}


export const deleteAllCartItems = (email) => {
    fetch(`/api/cart?email=${email}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 좋지 않습니다. 상태 코드: ' + response.status);
            }
            if (response.status === 204) {
                console.log('모든 서버 항목 삭제 완료');
            }
        })
        .catch(error => {
            console.error('서버와 동기화하는 동안 에러가 발생했습니다:', error);
        });
}
