import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SandboxApp() {
    const [items, setItems] = useState([]);
    const [itemExistsInDB, setItemExistsInDB] = useState({});

    // 데이터 가져오는 함수
    useEffect(() => {
        fetch('http://localhost:8080/cart/sandbox')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // 로컬스토리지 초기화
    const resetStorage = () => {
        localStorage.clear();
        alert('장바구니 초기화');
    };

    // 로컬스토리지에 아이템 추가
    const addToCart = (item) => {
        const cartItem = {
            userId: item.userId,
            optionId: item.optionId,
            name: item.name,
            optionName: item.optionName,
            price: item.price,
            quantity: item.quantity,
            maxQuantity: item.maxQuantity,
            url: item.url,
            check: true,
        };

        let cart = localStorage.getItem('cart');
        if (!cart) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }

        const itemExists = cart.some(cartItem => cartItem.optionId === item.optionId);

        if (itemExists) {
            alert(`이미 장바구니에 존재합니다.`);
        } else {
            cart.push(cartItem);
            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`장바구니에 추가되었습니다. ${item.name}`);
            updateDBStatus();
        }
    };

    // 서버에 항목 삭제
    const deleteFromDB = (item) => {
        fetch(`http://localhost:8080/cart/delete?userId=${item.userId}&optionId=${item.optionId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('네트워크 응답이 좋지 않습니다.');
                }
                alert(`DB에서 ${item.name}가 삭제되었습니다.`);
                updateDBStatus();
            })
            .catch(error => {
                console.error('삭제 중 오류 발생:', error);
                alert('삭제할 수 없습니다.');
            });
    };

    // 서버에 장바구니 저장
    const saveToDB = (item) => {
        const cartItem = {
            userId: item.userId,
            optionId: item.optionId,
            quantity: item.quantity,
            name: item.name
        };

        // 중복 확인
        fetch(`http://localhost:8080/cart/checkDuplicate?userId=${cartItem.userId}&optionId=${cartItem.optionId}`)
            .then(response => response.json())
            .then(exists => {
                if (exists) {
                    alert('이미 DB에 존재하는 옵션입니다.');
                } else {
                    // 중복이 아닐 경우 DB에 저장
                    fetch('http://localhost:8080/cart/save', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(cartItem),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('네트워크 응답이 좋지 않습니다.');
                            }
                            return response.json();
                        })
                        .then(data => {
                            alert(`DB에 장바구니가 저장되었습니다. ${item.name}`);
                            updateDBStatus();
                        })
                        .catch(error => {
                            console.error('DB에 저장하는 중 오류 발생:', error);
                            alert('DB에 저장하는 중 오류가 발생했습니다.');
                        });
                }
            })
            .catch(error => {
                console.error('중복 확인 중 오류 발생:', error);
                alert('중복 확인 중 오류가 발생했습니다.');
            });
    };

    // DB 상태 업데이트 함수
    const updateDBStatus = () => {
        items.forEach(item => {
            fetch(`http://localhost:8080/cart/checkDuplicate?userId=${item.userId}&optionId=${item.optionId}`)
                .then(response => response.json())
                .then(exists => {
                    setItemExistsInDB(prev => ({ ...prev, [item.optionId]: exists }));
                })
                .catch(error => console.error('Error checking existence:', error));
        });
    };

    return (
        <section >
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
                                                            Add to LS
                                                        </button>

                                                        <button className="btn btn-dark btn-block btn-md gap-4 m-2"
                                                                onClick={() => saveToDB(item)}>
                                                            Add to DB
                                                        </button>

                                                        {itemExistsInDB[item.optionId] ? ( // DB에 항목이 존재하면 버튼 표시
                                                            <button className="btn btn-dark btn-block btn-md gap-4 m-2"
                                                                    onClick={() => deleteFromDB(item)}>
                                                                Remove to DB
                                                            </button>
                                                        ) : null}
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

                                    <button className="btn btn-dark btn-block btn-lg gap-4 m-2" onClick={resetStorage}>
                                        DB 초기화
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default SandboxApp;
