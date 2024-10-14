import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // useParams 추가
import { addServerCart, addLocalCart } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Product.css';
import { Modal } from 'react-bootstrap';

function SandboxApp() {
    const [items, setItems] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [hoveredImages, setHoveredImages] = useState({});
    const [isLogin, setIsLogin] = useState(true); // 더미 데이터
    const [testUserId, setTestUserId] = useState(1); // 더미 데이터
    // const [categoryId, setCategoryId] = useState();
    //const [categoryId, setCategoryId] = useState(1); // 더미 데이터

    const { categoryId } = useParams(); // URL의 categoryId 가져오기
    const MODAL_DURATION = 1000;

    useEffect(() => {


        console.log(`Selected category: ${categoryId}`);
        fetch( categoryId? `http://localhost:8080/api/products/category/${categoryId}`:`http://localhost:8080/api/products/all`)
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
        const selectedDetail = selectedOptions[item.id] || item.productDetails[0];
        const cartItem = {
            optionId: selectedDetail.id,
            quantity: item.quantity,
        };

        if (isLogin) {
            addServerCart(cartItem, testUserId);
        } else {
            addLocalCart(cartItem, selectedDetail);
        }
        showModalMessage(`${item.name}의 ${selectedDetail.name}이(가) 장바구니에 추가되었습니다.`);
    };

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

    const handleMouseEnter = (itemId, mainImage) => {
        setHoveredImages(prevImages => ({
            ...prevImages,
            [itemId]: mainImage
        }));
    };

    const handleMouseLeave = (itemId) => {
        setHoveredImages(prevImages => {
            const newImages = { ...prevImages };
            delete newImages[itemId];
            return newImages;
        });
    };

    return (
        <section>
            <div className="container" style={{ width: '100%', marginTop: '10vh' }}>
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card-body p-3">
                        <div className="row g-0">
                            <div className="col-lg-12">
                                <div className="p-1">
                                    {groupedItems.map((group, groupIndex) => (
                                        <React.Fragment key={groupIndex}>
                                            <div className="row">
                                                {group.map((item, itemIndex) => {
                                                    const selectedDetail = selectedOptions[item.id] || item.productDetails[0];
                                                    const hoveredImage = hoveredImages[item.id] || selectedDetail.mainImage;

                                                    return (
                                                        <div
                                                            className="card col-md-3 col-xl-3 border-0"
                                                            key={item.id}
                                                            style={{ animationDelay: `${(groupIndex * 4 + itemIndex) * 0.1}s` }}
                                                        >
                                                            <div>
                                                                <div>
                                                                    <Link
                                                                        to={`/product-detail?productId=${item.id}&optionId=${selectedDetail.id}`}
                                                                    >
                                                                        <img
                                                                            src={hoveredImage}
                                                                            className="card-img-top"
                                                                            alt="Item Image"
                                                                            onMouseEnter={() =>
                                                                                handleMouseEnter(item.id, item.productImages[0].imageUrl)
                                                                            }
                                                                            onMouseLeave={() => handleMouseLeave(item.id)}
                                                                        />
                                                                    </Link>
                                                                </div>
                                                                <div className="card-body">
                                                                    <Link
                                                                        to={`/product-detail?productId=${item.id}&optionId=${selectedDetail.id}`}
                                                                    >
                                                                        <h6 className="card-title fw-bold">{item.name}</h6>
                                                                        <h6>{selectedDetail.name}</h6>
                                                                        <h6>{item.description}</h6>
                                                                        <h4 className="fw-bolder">
                                                                            ￦{selectedDetail.price.toLocaleString()}
                                                                        </h4>
                                                                    </Link>
                                                                    <div className="my-3">
                                                                        <h6 style={{ fontSize: '14px' }}>다른 옵션</h6>
                                                                        <div className="thumbnail-container d-flex mb-3 gap-2">
                                                                            {item.productDetails.map((detail, index) => {
                                                                                const isSelected = selectedOptions[item.id]?.id === detail.id;
                                                                                return (
                                                                                    <div key={index} style={{ position: 'relative' }}>
                                                                                        <img
                                                                                            src={detail.mainImage}
                                                                                            alt={`Thumbnail ${index + 1}`}
                                                                                            className="thumbnail-image"
                                                                                            style={{ width: '50px', cursor: 'pointer' }}
                                                                                            onClick={() =>
                                                                                                handleOptionSelect(item.id, detail)
                                                                                            }
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
                                                                    </div>
                                                                    <h6
                                                                        onClick={() => addToCart(item)}
                                                                        style={{ fontSize: '1rem', cursor: 'pointer' }}
                                                                    >
                                                                        <i className="bi bi-cart-plus mx-1" style={{ fontSize: '1.4rem' }}></i>
                                                                        Add Cart
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
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
        </section>
    );
}

export default SandboxApp;
