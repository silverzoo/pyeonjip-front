import React, { useState, useEffect } from 'react';
import { Collapse, initMDB } from 'mdb-ui-kit';
import { useLocation } from 'react-router-dom';
import { addLocalCart, addServerCart } from "../../utils/cartUtils";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Product.css';
import { Modal } from 'react-bootstrap';
initMDB({ Collapse });

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

    useEffect(() => {
        initMDB({ Collapse }); // 아코디언 초기화
    }, []);

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



                <div className="accordion accordion-flush my-5" id="accordionFlushExample">
                    {/*1번 아코디언*/}
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingOne">
                            <button
                                data-mdb-collapse-init
                                className="accordion-button collapsed"
                                type="button"
                                style={{fontWeight: 'bold', fontSize: '23px'}}
                                data-mdb-target="#flush-collapseOne"
                                aria-expanded="false"
                                aria-controls="flush-collapseOne"
                            >
                                제품 설명
                            </button>
                        </h2>
                        <div
                            id="flush-collapseOne"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingOne"
                            data-mdb-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body" style={{}}>
                                해당 제품은 공간에 자연스럽게 어우러지는 디자인과 실용성을 갖춘 제품입니다. <br/>
                                다양한 인테리어 스타일에 매칭하기 좋으며, 일상에서 편안한 사용감을 제공합니다. <br/>
                                깔끔한 디테일과 다용도로 활용 가능한 구조가 특징이며, 필요에 따라 여러 용도로 사용할 수 있습니다.


                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingTwo">
                            <button
                                data-mdb-collapse-init
                                className="accordion-button collapsed"
                                type="button"
                                style={{fontWeight: 'bold', fontSize: '23px'}}
                                data-mdb-target="#flush-collapseTwo"
                                aria-expanded="false"
                                aria-controls="flush-collapseTwo"
                            >
                                치수
                            </button>
                        </h2>
                        <div
                            id="flush-collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingTwo"
                            data-mdb-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                <h5>{product.description}</h5><br></br>
                                제품 치수는 측정 방식에 따라 ±1~3cm 오차가 발생할 수 있습니다. 설치 공간을 충분히 확인 후 구매해 주세요.

                            </div>
                        </div>
                    </div>
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-headingThree">
                            <button
                                data-mdb-collapse-init
                                className="accordion-button collapsed"
                                type="button"
                                style={{fontWeight: 'bold', fontSize: '23px'}}
                                data-mdb-target="#flush-collapseThree"
                                aria-expanded="false"
                                aria-controls="flush-collapseThree"
                            >
                                리뷰
                            </button>
                        </h2>
                        <div
                            id="flush-collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="flush-headingThree"
                            data-mdb-parent="#accordionFlushExample"
                        >
                            <div className="accordion-body">
                                {/*   리뷰 바디    */}
                                <div className="text-center my-2 ">
                                    <i className="bi bi-emoji-frown  my-5" style={{fontSize: '3rem'}}></i>
                                    <h3 className="my-4 bold">리뷰가 비어 있어요.</h3>
                                    <h6 className="text-muted">리뷰를 작성해주시면 더 나은 서비스를 제공하는데 도움이 됩니다.</h6>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop={false}>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
        </div>
    );
}

export default ProductDetail;
