
export const addServerCart = (cart, userId) => {
// 로그인 상태: 서버로 장바구니 항목 추가
fetch(`http://localhost:8080/cart/add?userId=${userId}`, {
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

// 로컬스토리지 -> 서버
export const syncWithLocal = (cart, userId) => {

    fetch(`http://localhost:8080/cart/syncLocal?userId=${userId}`, {
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
export const syncWithServer = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/cart/syncServer?userId=${userId}`, {
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
                existingItem.quantity += serverItem.quantity;
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


export const fetchCartDetails = (cartDtos) => {
    return fetch(`http://localhost:8080/cart/detail`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartDtos),
    })
        .then(response => response.json())
        .catch(error => {
            console.error('Error fetching CartDetailDto:', error);
            throw error; // 에러 발생 시 호출한 곳에서 처리할 수 있도록 전달
        });
};

export const updateCartItemQuantity = (userId, quantity, cartItem) => {
    fetch(`http://localhost:8080/cart/${userId}/cart-items/${cartItem.optionId}`, {
        method: 'POST',
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


export const deleteCartItem = (userId, optionId) => {
    fetch(`http://localhost:8080/cart/${userId}/cart-items/${optionId}`, {
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


export const deleteAllCartItems = (userId) => {
    fetch(`http://localhost:8080/cart/${userId}/cart-items`, {
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
