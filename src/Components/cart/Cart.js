import React, { useEffect, useState } from 'react';

function Cart() {
    // 'data'라는 상태 변수를 선언하고, 'setData' 함수로 해당 상태를 업데이트할 수 있게 함
    const [data, setData] = useState('');

    // 컴포넌트가 처음 렌더링될 때 한 번 실행되는 useEffect 훅
    // 주로 비동기 작업이나 API 호출을 수행하는 데 사용됨
    useEffect(() => {
        // Spring Boot API에서 데이터를 가져오기 위해 fetch 요청을 보냄
        fetch('http://localhost:8080/cart')  // API 경로를 필요에 따라 수정 가능
            .then(response => response.text())  // 서버에서 문자열로 응답을 받을 경우 처리
            .then(data => setData(data))  // 받아온 데이터를 'data' 상태에 저장
            .catch(error => console.error('Error fetching data:', error));  // 에러 발생 시 콘솔에 출력
    }, []);  // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 실행되도록 함

    // 화면에 출력되는 부분
    return (
        <div>
            <h1>{data}</h1>  {/* 'data'에 저장된 값을 화면에 h1 태그로 출력 */}
        </div>
    );
}

export default Cart;
