import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { addLocalCart, addServerCart } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Product.css';
import { Modal } from 'react-bootstrap';

const MODAL_DURATION = 1000; // Modal display duration

function ProductDetail() {
    const [items, setItems] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');
    const optionId = queryParams.get('optionId');
    const [isLogin, setIsLogin] = useState(true); // 더미 데이터
    const [testUserId, setTestUserId] = useState(1); // 더미 데이터
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const [product, setProduct] = useState({
        productImages: [],
        productDetails: [],
        name: '',
        description: '',
    });

    const [selectedOption, setSelectedOption] = useState({
        mainImage: '',
        name: '',
        price: 0,
    });

    // Fetch product details by productId and optionId
    useEffect(() => {
        fetch(`http://localhost:8080/api/products/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                setProduct(data);
                console.log('(Product)data from server : ', data);

                const option = data.productDetails.find(detail => detail.id === parseInt(optionId));
                setSelectedOption(option || data.productDetails[0]); // 기본 옵션 설정

                // 원본 mainImage를 productImages 배열에 추가
                setProduct(prevProduct => ({
                    ...prevProduct,
                    productImages: [
                        { imageUrl: option ? option.mainImage : data.productImages[0].imageUrl },
                        ...data.productImages
                    ],
                }));
            })
            .catch((error) => console.error('Error fetching product details:', error));
    }, [productId, optionId]);

    const addToCart = () => {
        const cartItem = {
            optionId: selectedOption.id,
            quantity: 1,
        };

        if (isLogin) {
            addServerCart(cartItem, testUserId);
        } else {
            addLocalCart(cartItem, selectedOption);
        }
        showModalMessage(`${product.name}의 ${selectedOption.name}이(가) 장바구니에 추가되었습니다.`);
    };

    const showModalMessage = (message) => {
        setModalMessage(message);
        setShowModal(true);
        setTimeout(() => setShowModal(false), MODAL_DURATION);
    };

    const handleOptionChange = (detail) => {
        setSelectedOption(detail);
        setProduct(prevProduct => ({
            ...prevProduct,
            productImages: [
                { imageUrl: detail.mainImage },
                ...prevProduct.productImages.slice(1)
            ],
        }));
    };

    return (
        <div className="container card border-0" style={{ width: '105%' }}>
            <div className="row">

                <div className=" card border-0 col-xl-6 d-flex flex-column"
                     style={{marginTop: '30px', marginLeft: '30px'}}>
                    {/*<nav data-mdb-navbar-init className="navbar navbar-expand-lg bg-body-white">*/}
                    {/*    <div className="container-fluid">*/}
                    {/*        <nav aria-label="breadcrumb">*/}
                    {/*            <ol className="breadcrumb">*/}
                    {/*                <li className="breadcrumb-item"><a href="#">Home</a></li>*/}
                    {/*                <li className="breadcrumb-item" aria-current="page"><a href=`http://localhost:3000/category/${categoryId}`>Category</a></li>*/}
                    {/*            </ol>*/}
                    {/*        </nav>*/}
                    {/*    </div>*/}

                    {/*</nav>*/}
                    <div style={{marginLeft: '40px', flex: 1}}>
                        <img
                            src={selectedOption.mainImage}
                            alt={product.name}
                            className="img-fluid"
                            style={{width: '100%', marginTop: '20px'}}
                        />
                    </div>
                    <hr></hr>
                    <div className="d-flex my-2" style={{marginTop: '10px', marginLeft: '40px', gap: '10px'}}>
                        {product.productImages.map((img, index) => (
                            <img
                                key={index}
                                src={img.imageUrl}
                                alt={`Product Image ${index + 1}`}
                                style={{
                                    width: '70px',
                                    cursor: 'pointer',
                                    borderBottom: selectedOption.mainImage === img.imageUrl ? '1px solid gray' : '', // 밑줄 스타일 추가
                                }}
                                onClick={() => setSelectedOption({...selectedOption, mainImage: img.imageUrl})}
                            />
                        ))}
                    </div>
                </div>
                <div className="card border-0 col-xl-4" style={{marginTop: '80px', marginLeft: '80px'}}>
                    <h2>{product.name}</h2>
                    <h4>{selectedOption.name}</h4>
                    <p>{product.description}</p>
                    <h3>￦{selectedOption.price.toLocaleString()}</h3>

                    <hr></hr>

                    <div className="my-3">
                        <h6 style={{fontSize: '14px'}}>다른 옵션</h6>
                        <div className="d-flex gap-3">
                            {product.productDetails.map((detail, index) => (
                                <img
                                    key={index}
                                    src={detail.mainImage}
                                    alt={`Option ${index + 1}`}
                                    style={{
                                        width: '70px',
                                        cursor: 'pointer',
                                        borderBottom: selectedOption.id === detail.id ? '1px solid gray' : '',
                                    }}
                                    onClick={() => handleOptionChange(detail)}
                                />
                            ))}
                        </div>
                    </div>

                    <button className="btn btn-dark my-4" onClick={addToCart}>
                        <i className="bi bi-cart-plus mx-1" style={{fontSize: '1.4rem'}}></i>
                        장바구니에 담기
                    </button>

                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop={false}>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductDetail;
