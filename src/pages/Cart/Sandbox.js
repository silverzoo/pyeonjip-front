import React, { useState, useEffect } from 'react';
import { syncWithLocal, syncWithServer, fetchCartDetails, addServerCart } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Sandbox.css';
import { Modal } from 'react-bootstrap';

function SandboxApp() {
    const [items, setItems] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true); // 더미데이터
    const [testUserId, setTestUserId] = useState(1); // 더미데이터
    const [categoryId, setCategoryId] = useState(1); // 더미데이터

    const MODAL_DURATION = 2500;

    // categoryId에 따른 제품 불러오기
    useEffect(() => {
        fetch(`http://localhost:8080/api/products/category/${categoryId}`)
            .then(response => response.json())
            .then(data => {
                setItems(data);
                console.log('상품 불러오기 완료:', data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [categoryId]);

    const showModalMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => setShowModal(false), MODAL_DURATION);
    };

    const addToCart = (item) => {
        const selectedDetail = selectedOptions[item.id] || item.productDetails[0]; // 선택된 옵션 또는 기본 옵션 사용
        const cartItem = {
            optionId: selectedDetail.id,
            quantity: item.quantity,
        };

        if (isLogin) {
            addServerCart(cartItem, testUserId);
        } else {
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemIndex = currentCart.findIndex(cartItem => cartItem.optionId === selectedDetail.id);

            if (itemIndex !== -1) {
                currentCart[itemIndex].quantity += 1;
            } else {
                currentCart.push(cartItem);
            }
            localStorage.setItem('cart', JSON.stringify(currentCart));
        }

        showModalMessage(`${item.name}의 ${selectedDetail.name}이(가) 장바구니에 추가되었습니다.`);
    };

    // 옵션 썸네일 클릭 시 선택된 옵션 업데이트
    const handleOptionSelect = (itemId, detail) => {
        setSelectedOptions(prevOptions => ({
            ...prevOptions,
            [itemId]: detail,
        }));
    };

    const groupedItems = [];
    for (let i = 0; i < items.length; i += 4) {
        groupedItems.push(items.slice(i, i + 4));
    }

    return (
        <section>
            <div className="container" style={{ width: '100%', marginTop: '10vh' }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card-body p-0">
                        <div className="row g-0">
                            <div className="col-lg-12">
                                <div className="p-1">
                                    {groupedItems.map((group, groupIndex) => (
                                        <React.Fragment key={groupIndex}>
                                            <div className="row">
                                                {group.map((item, itemIndex) => {
                                                    const selectedDetail = selectedOptions[item.id] || item.productDetails[0];
                                                    return (
                                                        <div
                                                            className="card col-md-3 col-xl-3 border-0"
                                                            key={item.id}
                                                            style={{ animationDelay: `${(groupIndex * 4 + itemIndex) * 0.1}s` }}
                                                        >
                                                            <div>
                                                                <img src={selectedDetail.mainImage} className="card-img-top" alt="Item Image" />
                                                                <div className="card-body">
                                                                    <a href="/cart/sandbox">
                                                                        <h6 className="card-title fw-bold">{item.name}</h6>
                                                                        <h6>{selectedDetail.name}</h6>
                                                                        <h6>{item.description}</h6>
                                                                        <h4 className="fw-bolder">
                                                                            ￦{selectedDetail.price.toLocaleString()}
                                                                        </h4>
                                                                    </a>
                                                                    <h6 style={{ fontSize: '12px' }}>다른 옵션</h6>
                                                                    <div className="thumbnail-container d-flex mb-3 gap-2">
                                                                        {item.productDetails.map((detail, index) => {
                                                                            const isSelected = selectedOptions[item.id]?.id === detail.id;
                                                                            return (
                                                                                <div key={index} style={{ position: 'relative' }}>
                                                                                    <img
                                                                                        src={detail.mainImage}
                                                                                        alt={`Thumbnail ${index + 1}`}
                                                                                        className="thumbnail-image"
                                                                                        style={{
                                                                                            width: '50px',
                                                                                            cursor: 'pointer',
                                                                                            //border: isSelected ? '2px solid #000000' : 'none',
                                                                                            borderRadius: '4px',
                                                                                        }}
                                                                                        onClick={() => handleOptionSelect(item.id, detail)}
                                                                                    />
                                                                                    {isSelected && (
                                                                                        <div
                                                                                            style={{
                                                                                                position: 'absolute',
                                                                                                bottom: '-3px',
                                                                                                left: 0,
                                                                                                right: 0,
                                                                                                height: '1px',
                                                                                                backgroundColor: '#afafaf',
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                    <h6 onClick={() => addToCart(item)} className="mx-2">
                                                                        <i className="bi bi-cart-plus" style={{ fontSize: '1.7rem', cursor: 'pointer' }}></i>
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {groupIndex < groupedItems.length - 1 && <hr className="my-3" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop={false}>
                <Modal.Body className="bg-dark text-white">{modalMessage}</Modal.Body>
            </Modal>
        </section>
    );
}

export default SandboxApp;
