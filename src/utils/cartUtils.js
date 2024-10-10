

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

// 로컬스토리지 업데이트
export const updateLocalStorage = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
};
