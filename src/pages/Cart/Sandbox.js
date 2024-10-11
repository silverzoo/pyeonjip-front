import React, { useState, useEffect } from 'react';
import { syncWithLocal, syncWithServer, fetchCartDetails } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal } from 'react-bootstrap';

function SandboxApp() {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false); // 더미데이터
    const [testUserId, setTestUserId] = useState(1); // 더미데이터

    const MODAL_DURATION = 500

    // CartDto 먼저 가져오기
    useEffect(() => {
        fetch('http://localhost:8080/cart/sandbox')
            .then(response => response.json())
            .then(cartDtos => {
                fetchCartDetails(cartDtos)
                    .then(cartDetails => setItems(cartDetails)) // CartDetailDto 데이터를 items 상태로 설정
                    .catch(error => console.error('Error fetching CartDetailDto:', error));
            })
            .catch(error => console.error('Error fetching CartDto:', error));
    }, []);

    const resetStorage = () => {
        showModalMessage('장바구니 초기화');
        localStorage.clear(); // 메시지 설정 후 로컬 스토리지 초기화
    };

    const handleLoginToggle = () => {
        setIsLogin(prev => {
            const newLoginStatus = !prev;
            showModalMessage(newLoginStatus ? `로그인 완료` : `로그아웃 완료`);

            if (newLoginStatus) {
                syncWithServer(testUserId);
                let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
                syncWithLocal(currentCart, testUserId);
            } else {
                let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
                syncWithLocal(currentCart, testUserId);
                localStorage.clear();
            }
            return newLoginStatus; // 새 로그인 상태 반환
        });
    };

    const showModalMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => setShowModal(false), MODAL_DURATION);
    };

    const addToCart = (item) => {
        const cartItem = {
            optionId: item.optionId,
            quantity: item.quantity,
            //isChecked: true,
        };

        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = currentCart.findIndex(cartItem => cartItem.optionId === item.optionId);

        if (itemIndex !== -1) {
            // 이미 장바구니에 존재할 경우 수량을 1 늘림
            currentCart[itemIndex].quantity += 1;
            showModalMessage(`장바구니에 ${item.name}의 수량이 1 증가했습니다.`);
        } else {
            currentCart.push(cartItem);
            showModalMessage(`${item.name}이(가) 장바구니에 추가되었습니다.`);
        }

        localStorage.setItem('cart', JSON.stringify(currentCart));

        if (isLogin) {
            syncWithLocal(currentCart, testUserId); // 로그인 상태일 때만 동기화
        }
    };

    return (
        <section>
            <div className="container h-100 card">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card-body p-0">
                        <div className="row g-0">
                            <div className="col-lg-12">
                                <div className="p-5">
                                    <div className="row">
                                        {items.map((item) => (
                                            <div className="col-md-3 col-xl-4" key={item.optionId}>
                                                <div className="card mb-2">
                                                    <img src={item.url} className="card-img-top" alt="Item Image" />
                                                    <div className="card-body">
                                                        <h3 className="card-title">{item.name}</h3>
                                                        <h6>{item.optionName}</h6>
                                                        <h6>{item.price}원</h6>
                                                        <h6>OptionId : {item.optionId}</h6>
                                                        <div className="d-flex justify-content-center">
                                                            <button
                                                                className="btn btn-dark btn-block btn-md col-xl-8 gap-4 m-2"
                                                                onClick={() => addToCart(item)}>
                                                                Add
                                                            </button>
                                                        </div>
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

                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2"
                                            onClick={handleLoginToggle}>
                                        {isLogin ? '로그아웃' : '로그인'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop={false}>
                <Modal.Body className="bg-dark text-white">
                    {modalMessage}
                </Modal.Body>
            </Modal>
        </section>
    );
}

export default SandboxApp;
