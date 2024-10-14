import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './LeftSide.css';
import ToggleIcon from "./ToggleIcon/ToggleIcon";
import Category from "./Category/Category";

const LeftSide = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [isShopExpanded, setIsShopExpanded] = useState(false);

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

    const handleShopToggle = () => {
        setIsShopExpanded(prev => !prev);
    };

    return (
        <>
            <div className='container'>
                <div className="logo">
                    <Link to="/"><img src={logo} alt="logo" width="86"/></Link>
                </div>
                <div className="menu">
                    <ul>
                        {location.pathname.startsWith('/admin') ? (
                            <>
                                <ToggleIcon label="CATEGORY" to="/admin/category"/>
                                <ToggleIcon label="ORDER" to="/admin/order"/>
                            </>
                        ) : (
                            <>
                                <ToggleIcon label="PROMOTION" to="/"/>
                                <ToggleIcon
                                    label="SHOP"
                                    to="/"
                                    isExpanded={isShopExpanded}
                                    onToggle={handleShopToggle}
                                />
                                {/*<li onClick={handleShopToggle}>*/}
                                {/*    <span className='tapMark'>{isShopExpanded ? '-' : '+'}</span>*/}
                                {/*    &nbsp;SHOP*/}
                                {/*</li>*/}
                                {isShopExpanded && <Category categories={categories} />}
                                <ToggleIcon label="ADMIN" to="/admin/order"/>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            {/*<div className='right'>*/}
            {/*    <div>로그인</div>*/}
            {/*    <div>장바구니</div>*/}
            {/*</div>*/}
        </>
    );
};

export default LeftSide;