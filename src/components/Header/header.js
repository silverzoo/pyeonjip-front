import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './header.css'; // CSS 파일이 있다고 가정합니다.

const Header = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isShopOpen, setIsShopOpen] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8080/api/category')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);

    const handleToggle = (categoryId) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const handleShopToggle = () => {
        setIsShopOpen(prev => !prev);
        if (!isShopOpen) {
            setExpandedCategories({}); // SHOP이 열릴 때 모든 카테고리 상태 초기화
        }
    };

    const renderCategories = (categories) => {
        return (
            <ul>
                {categories.map(category => (
                    <li key={category.id}>
                        <button onClick={() => handleToggle(category.id)}>
                            {category.name}
                        </button>
                        {expandedCategories[category.id] && category.child && category.child.length > 0 && (
                            <div style={{ paddingLeft: '20px' }}>
                                {renderCategories(category.child)} {/* 재귀 호출로 하위 카테고리 렌더링 */}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="gnb">
            <div className='left'>
                <div className="logo">
                    <Link to="/"><img src={logo} alt="logo" width="80" /></Link>
                </div>
                <div className="menu">
                    {location.pathname.startsWith('/admin') ? (
                        <ul>
                            <li><Link to="/admin/category">CATEGORY</Link></li>
                            <li><Link to="/admin/order">ORDER</Link></li>
                        </ul>
                    ) : (
                        <ul>
                            <li><Link to="/">PROMOTION</Link></li>
                            <li onClick={handleShopToggle} style={{ cursor: 'pointer', position: 'relative' }}>
                                {isShopOpen ? '-' : '+'} SHOP
                                {isShopOpen && (
                                    <div className="dropdown" style={{ position: 'absolute', zIndex: 1000 }}>
                                        {renderCategories(categories)} {/* 카테고리 렌더링 */}
                                    </div>
                                )}
                            </li>
                            <li><Link to="/admin/order">ADMIN</Link></li>
                            <li><Link to="/cart">CART</Link></li>
                            <li><Link to="/cart/sandbox">SANDBOX</Link></li>
                        </ul>
                    )}
                </div>
            </div>
            {/*<div className='right'>*/}
            {/*    <div>로그인</div>*/}
            {/*    <div>장바구니</div>*/}
            {/*</div>*/}
        </div>
    );
};

export default Header;
