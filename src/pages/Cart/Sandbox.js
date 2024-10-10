import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Modal} from 'react-bootstrap';

function SandboxApp() {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true); // 더미데이터
    const [testUserId, setTestUserId] = useState(1); // 더미데이터
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/cart/sandbox')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const resetStorage = () => {
        localStorage.clear();
        showModalMessage('장바구니 초기화');
    };


    const toggleLogin = () => {
        setIsLogin(prev => {
            const newLoginStatus = !prev;
            showModalMessage(newLoginStatus ? `로그인` : `로그아웃`);

            if (newLoginStatus) {
                // 로그인 시 서버에서 장바구니 데이터를 가져와 로컬 스토리지와 동기화
                syncWithServer(testUserId); // 사용자의 ID를 사용하여 동기화
            } else {
                // 로그아웃 시 로컬 스토리지 초기화
                localStorage.clear();
                setCart([]);
            }

            return newLoginStatus; // 새 로그인 상태 반환
        });
    };

    const loginStatus = () => {
        showModalMessage(`${isLogin}`)
    }

    const showModalMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => setShowModal(false), 500);
    };

    const addToCart = (item) => {
        const cartItem = {
            userId: item.userId,
            optionId: item.optionId,
            name: item.name,
            optionName: item.optionName,
            price: item.price,
            quantity: 1, // Default quantity
            maxQuantity: item.maxQuantity,
            url: item.url,
        };

        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemExists = currentCart.some(cartItem => cartItem.optionId === item.optionId);

        if (itemExists) {
            showModalMessage(`이미 장바구니에 존재합니다.`);
        } else {
            currentCart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(currentCart));
            setCart(currentCart); // Update cart state for syncing
            showModalMessage(`${item.name}이(가) 장바구니에 추가되었습니다.`);
            if (isLogin) {
                syncWithLocal(currentCart);
            }
        }
    };

    // 서버 -> 로컬
    const syncWithServer = async (userId) => {
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

            const data = await response.json(); // JSON 파싱
            localStorage.setItem('cart', JSON.stringify(data));
            setCart(data); // 로컬 스토리지 데이터를 상태에 업데이트
            showModalMessage('서버 데이터와 동기화되었습니다.');
        } catch (error) {
            console.error('동기화 에러:', error);
            showModalMessage('동기화 중 오류가 발생했습니다.');
        }
    };

    // 로컬 -> 서버
    const syncWithLocal = (cart) => {
        fetch(`http://localhost:8080/cart/syncLocal?userId=${cart[0].userId}`, {
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


    // 로컬스토리지에서 항목 삭제
    const removeFromLocalStorage = (optionId) => {
        const updatedCart = cart.filter(item => item.optionId !== optionId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart); // Update cart state for syncing
        if (isLogin) {
            syncWithLocal(updatedCart); // Sync changes to the server
        }
        showModalMessage(`옵션 ID ${optionId}가 로컬스토리지에서 삭제되었습니다.`);
    };


    return (
        <section>
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card-body p-0">
                        <div className="row g-0">
                            <div className="col-lg-12">
                                <div className="p-5">
                                    <div className="row">
                                        {items.map((item) => (
                                            <div className="col-md-3 col-xl-4" key={item.optionId}>
                                                <div className="card mb-2">
                                                    <img src={item.url} className="card-img-top" alt="Item Image"/>
                                                    <div className="card-body">
                                                        <h3 className="card-title">{item.name}</h3>
                                                        <p className="card-text">{item.price} 원</p>
                                                        <p className="card-text">OptionId : {item.optionId}</p>

                                                        <button className="btn btn-dark btn-block btn-md gap-4 m-2"
                                                                onClick={() => addToCart(item)}>
                                                            Add
                                                        </button>

                                                        {/*<button className="btn btn-dark btn-block btn-md gap-4 m-2"*/}
                                                        {/*        onClick={() => saveToDB(item)}>*/}
                                                        {/*    Add to DB*/}
                                                        {/*</button>*/}

                                                        {/* 개별 항목 삭제 버튼 추가 */}
                                                        <button className="btn btn-dark btn-block btn-md gap-4 m-2"
                                                                onClick={() => removeFromLocalStorage(item.optionId)}>
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2"
                                            onClick={() => window.location.href = '/cart'}>
                                        장바구니 이동
                                    </button>

                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2" onClick={resetStorage}>
                                        LS 초기화
                                    </button>

                                    {/*<button className="btn btn-dark btn-block btn-lg gap-4 m-2" >*/}
                                    {/*    DB 초기화*/}
                                    {/*</button>*/}

                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2" onClick={toggleLogin}>
                                        로그인 토글
                                    </button>
                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2" onClick={loginStatus}>
                                        로그인 확인
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 모달 컴포넌트 */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop={false}
            >
                <Modal.Body className="bg-dark text-white">
                    {modalMessage}
                </Modal.Body>
            </Modal>
        </section>
    );
}

export default SandboxApp;
