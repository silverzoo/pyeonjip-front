import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    const [isLogin, setIsLogin] = useState(true);
    const [testUserId, setTestUserId] = useState(1);
    const { categoryId } = useParams();
    const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 추가
    const MODAL_DURATION = 1000;

    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    useEffect(() => {
        console.log(`Selected category: ${categoryId}`);
        const fetchProducts = async () => {
            try {
                if (!categoryId) {
                    const response = await fetch(`http://localhost:8080/api/products/all-pages?page=${currentPage}&size=8`);
                    const data = await response.json();
                    setItems(prevItems => currentPage === 0 ? data.content : [...prevItems, ...data.content]); // 기존 아이템과 병합
                    setHasMore(data.content.length > 0); // 더 많은 상품이 있는지 설정
                    console.log('상품 리스트 불러오기 완료:', data.content);
                } else {
                    const categoryResponse = await fetch(`http://localhost:8080/api/category?categoryIds=${categoryId}`);
                    const categoryIds = await categoryResponse.json();
                    console.log('Leaf 카테고리 불러오기 완료:', categoryIds);

                    const queryParams = categoryIds.map(id => `categoryIds=${id}`).join('&');
                    const productResponse = await fetch(`http://localhost:8080/api/products/categories?${queryParams}`);
                    const products = await productResponse.json();
                    setItems(products);
                    setHasMore(false); // 카테고리 기반 상품 리스트는 더 이상 페이지네이션이 필요 없으므로 false로 설정

                    console.log('상품 리스트 불러오기 완료:', products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [categoryId, currentPage]);

    useEffect(() => {
        if (currentPage === 0) {
            // 첫 페이지 로드 시에만 애니메이션 키 업데이트
            setAnimationKey(prevKey => prevKey + 1);
        }
    }, [currentPage]);

    const loadMoreItems = () => {
        if (hasMore) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            // Check if the user has scrolled to the bottom
            if (scrollTop + windowHeight >= documentHeight - 1 && hasMore && !loading) {
                setLoading(true); // 로딩 시작
                setTimeout(() => {
                    loadMoreItems(); // 무한 스크롤 로딩 시 추가 아이템 로드
                    setLoading(false); // 로딩 종료
                }, 1000); // 1초 후 페이지 증가
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hasMore, loading]);

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
        <section key={animationKey}>
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
                                                                        <h6 style={{ fontSize: '14px' }}>옵션</h6>
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
                                                                        style={{ fontSize: '14px', color: 'black', cursor: 'pointer' }}>
                                                                        장바구니에 추가
                                                                    </h6>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                {loading && <div className="spinner-border text-center" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>}
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>{modalMessage}</Modal.Body>
            </Modal>
        </section>
    );
}

export default SandboxApp;
