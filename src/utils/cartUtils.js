
// 서버와 동기화 함수 추가
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
                throw new Error('서버 응답이 좋지 않습니다. 상태 코드: ' + response.status); // 응답 상태 코드 추가
            }
            return response.json(); // JSON 파싱
        })
        .then(data => {
            console.log('동기화 완료:', data);
        })
        .catch(error => {
            console.error('동기화 에러:', error);
        });
};