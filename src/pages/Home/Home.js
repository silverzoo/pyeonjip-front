import React, { useEffect } from 'react';
import { Carousel, initMDB } from 'mdb-ui-kit';
import './Home.css';

const CategoryList = () => {
    useEffect(() => {
        initMDB({ Carousel }); // 컴포넌트 마운트 시 초기화
    }, []);


    const categories = [
        {
            img: 'https://www.ikea.com/kr/ko/images/products/grimsbu-bed-frame-grey__1101950_pe866876_s5.jpg?f=xl',
            name: '침대',
            link: '/category/1',
        },
        {
            img: 'https://www.ikea.com/ext/ingkadam/m/255fe3636d46b260/original/PH188179.jpg?f=xxxl',
            name: '소파',
            link: '/category/2',
        },
        {
            img: 'https://www.ikea.com/kr/ko/images/products/micke-corner-workstation-white__0921924_pe788003_s5.jpg?f=xl',
            name: '테이블',
            link: '/category/3',
        },
        {
            img: 'https://www.ikea.com/kr/ko/images/products/vihals-cabinet-with-sliding-glass-doors-white__1239670_pe919000_s5.jpg?f=xl',
            name: '진열장',
            link: '/category/4',
        },
        {
            img: 'https://www.ikea.com/kr/ko/images/products/bergmund-bar-stool-with-backrest-white-rommele-dark-blue-white__0941005_pe795271_s5.jpg?f=xl',
            name: '의자',
            link: '/category/5',
        },
        {
            img: 'https://www.ikea.com/kr/ko/images/products/solvinden-led-table-lamp-battery-operated-outdoor-white__1237028_pe917799_s5.jpg?f=xl',
            name: '더 많은 상품',
            link: '/category',
        },
    ];

    return (
        <div style={{ paddingTop: '5%', width: '960px' }}>


            <div
                id="carouselExampleCaptions"
                className="carousel slide"
                data-mdb-ride="carousel"
                data-mdb-carousel-init=""
            >
                {/* Carousel Indicators */}
                <div className="carousel-indicators">
                    <button
                        type="button"
                        data-mdb-target="#carouselExampleCaptions"
                        data-mdb-slide-to="0"
                        className="active"
                        aria-current="true"
                        aria-label="Slide 1"
                    ></button>
                    <button
                        type="button"
                        data-mdb-target="#carouselExampleCaptions"
                        data-mdb-slide-to="1"
                        aria-label="Slide 2"
                    ></button>
                    <button
                        type="button"
                        data-mdb-target="#carouselExampleCaptions"
                        data-mdb-slide-to="2"
                        aria-label="Slide 3"
                    ></button>
                </div>

                {/* Carousel Inner */}
                <div className="card">
                    <div className="carousel-inner">
                        {/* Carousel Items */}
                        <div className="carousel-item active">
                            <img
                                src="https://eo246y8edo3.exactdn.com/wp-content/uploads/2023/09/konfurb-harmony-home-office-chair.jpg?strip=all&lossy=1&ssl=1"
                                className="d-block w-100"
                                alt="Wild Landscape"
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <div className="carousel-caption d-none d-md-block h-50">
                                <h3>매일 머무르고 싶은 홈 오피스</h3>
                                <h6>편안하고 모던한 환경에 여가 공간과 업무 공간이 결합되었어요.</h6>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img
                                src="https://www.ikea.com/images/lappnycklar-blakullen-6cf0f449b7725249d90b19636b9428b3.jpg?f=sg"
                                className="d-block w-100"
                                alt="Wild Landscape"
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <div className="carousel-caption d-none d-md-block h-50">
                                <h3>밤마다 숙면할 수 있는 컬러풀한 침실</h3>
                                <h6>
                                    풍부한 색상이 돋보이는 모던한 침실이지만 차분하고 조화로운
                                    느낌도 갖춘다면 매일 밤 숙면 고민은 없겠죠?
                                </h6>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img
                                src="https://www.ikea.com/ext/ingkadam/m/145b69d715a93770/original/PH199354.jpg?f=sg"
                                className="d-block w-100"
                                alt="Exotic Fruits"
                                style={{ height: '300px', objectFit: 'cover' }}
                            />
                            <div className="carousel-caption d-none d-md-block h-50">
                                <h3>대담하고 모던한 스타일의 현관</h3>
                                <h6>
                                    신중하게 고른 가구와 액세서리를 추가하면 공간에 대담한
                                    분위기를 쉽게 연출할 수 있어요.
                                </h6>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-mdb-target="#carouselExampleCaptions"
                        data-mdb-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-mdb-target="#carouselExampleCaptions"
                        data-mdb-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            {/* 환영 메시지 및 홈페이지 설명 */}
            <div className="card border-0 my-4">
            <div className="welcome-message text-center mb-4">
                <h3>편집에 오신것을 환영합니다!</h3>
                <p>공간에 다양한 이야기를 불어넣어 보세요</p>
            </div>
            </div>
            {/* Category Cards */}
            <div className="d-flex flex-wrap justify-content-around mt-4">
                {categories.map((category, index) => (
                    <a
                        key={index}
                        href={category.link}
                        className="card border-0 mb-3 position-relative category-card"
                        style={{ width: '18rem', textDecoration: 'none' }}
                    >
                        <img
                            src={category.img}
                            className="card-img-top"
                            alt={category.name}
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                aspectRatio: '1/1', // 정사각형 비율 유지
                            }}
                        />
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-white">
                            <h3 className="card-title">{category.name}</h3>
                        </div>
                    </a>
                ))}
            </div>

            {/* 카테고리 설명 */}
            <div className="text-center mt-4">
                <p>다양한 신제품들로 아늑하고 편안한 공간을 연출해 보세요.</p>
            </div>
        </div>
    );
};

export default CategoryList;
