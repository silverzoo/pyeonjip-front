import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './header.css';

const Header = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [showCategories, setShowCategories] = useState(false);
    const [showMenus, setShowMenus] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState({});

    useEffect(() => {
        fetch('http://localhost:8080/api/category')
            .then(response => response.json(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);

    // 최상위 카테고리를 닫았다가 다시 열 때 모든 카테고리도 닫히도록 처리
    useEffect(() => {
        if (!showCategories) {
            setExpandedCategories({});
        }
    }, [showCategories]);

    const handleShopClick = () => {
        setShowCategories(!showCategories);
    };

    const handleMenuClick = () => {
        setShowMenus(!showMenus);
    }

    const handleCategoryClick = (categoryId, event) => {
        if (event) event.stopPropagation();
        const copy = {...expandedCategories};
        copy[categoryId] = !copy[categoryId];
        setExpandedCategories(copy);
    };

    const handleChildClick = (categoryId, event) => {
        if (event) event.stopPropagation();
        handleCategoryClick(categoryId);
    };

    return (
        <div className="gnb">
            <div className='left'>
                <div className="logo">
                    <Link to="/"><img src={logo} alt="logo" width="86" /></Link>
                </div>
                <div className="menu">
                    {location.pathname.startsWith('/admin') ? (
                        <ul>
                            <li onClick={handleMenuClick}><Link to="/admin/category">
                                <span className='tapMark'>{showMenus ? '-' : '+'}</span>&nbsp;&nbsp;CATEGORY
                            </Link></li>
                            <li><Link to="/admin/order">
                                {showMenus ? <span className='tapMark'>-</span> : <span className='tapMark'>+</span>} &nbsp;&nbsp;ORDER
                            </Link></li>
                        </ul>
                    ) : (
                        <ul>
                            <li onClick={handleMenuClick}><Link to="/">
                                <span className='tapMark'>{showMenus ? '-' : '+'}</span>&nbsp;&nbsp;PROMOTION
                            </Link></li>
                            <li onClick={handleShopClick} style={{ cursor: 'pointer', position: 'relative' }}>
                                <span className='tapMark'>{showCategories ? '-' : '+'}</span>&nbsp;&nbsp;SHOP
                                {showCategories && (
                                    <div className='categoryContainer'>
                                        <ul className='category'>
                                            {categories.map(category => (
                                                    <li key={category.id} onClick={(event) => handleCategoryClick(category.id, event)}>
                                                        {/* 하위 카테고리가 있을 경우에만 tapMark를 표시 */}
                                                        <span className='tapMark'>
                                                            {category.children && category.children.length > 0 ? (expandedCategories[category.id] ? '-' : '+') : '\u00A0\u00A0'}
                                                        </span> &nbsp;{category.name}
                                                        {expandedCategories[category.id] && category.children && (
                                                            <ul className='subCategory'>
                                                                {category.children.map(child => (
                                                                    <li key={child.id} onClick={(event) => handleChildClick(child.id, event)}>
                                                                        <span className='tapMark'>
                                                                            {child.children && child.children.length > 0 ? (expandedCategories[child.id] ? '-' : '+') : '\u00A0\u00A0'}
                                                                        </span> &nbsp;&nbsp;&nbsp;{child.name}
                                                                        {/* 자식의 자식 카테고리가 있는 경우 */}
                                                                        {expandedCategories[child.id] && child.children && (
                                                                            <ul>
                                                                                {child.children.map(grandchild => (
                                                                                    <li key={grandchild.id} onClick={(event) => handleChildClick(grandchild.id, event)}>
                                                                                        <span className='tapMark'>
                                                                                        {grandchild.children && grandchild.children.length > 0 ? (expandedCategories[grandchild.id] ? '-' : '+') : '\u00A0\u00A0'}
                                                                                        </span> &nbsp;&nbsp;&nbsp;{grandchild.name}
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        )}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                            <li onClick={handleMenuClick}><Link to="/admin/order">
                                <span className='tapMark'>{showMenus ? '-' : '+'}</span>&nbsp;&nbsp;ADMIN
                            </Link></li>
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