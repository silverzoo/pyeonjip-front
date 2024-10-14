import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './LeftSide.css';
import ToggleIcon from "./ToggleIcon/ToggleIcon";
import Category from "./Category/Category";

const LeftSide = () => {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({
        PROMOTION: false,
        SHOP: false,
        ADMIN: false,
        CATEGORY: false,
        ORDER: false,
        PRODUCT: false,
    });

    useEffect(() => {
        fetch('/api/category')
            .then(response => response.json(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);

    // 어드민페이지로 이동할 때, ORDER 탭을 디폴트로 열기
    useEffect(() => {
        if (location.pathname.startsWith('/admin/order')) {
            setExpandedMenus((prev) => ({
                ...prev,
                ADMIN: true,
                ORDER: true,
            }));
        }
    }, [location]);

    const handleTapToggle = (menuName) => {
        const currentExpandedState = expandedMenus[menuName];

        // 모든 메뉴 상태 초기화
        const newExpandedState = Object.keys(expandedMenus).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});

        // 클릭한 메뉴만 토글
        newExpandedState[menuName] = !currentExpandedState;

        setExpandedMenus(newExpandedState);
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
                                <ToggleIcon
                                    label="ORDER"
                                    to="/admin/order"
                                    isExpanded={expandedMenus.ORDER}
                                    onToggle={() => handleTapToggle('ORDER')}
                                />
                                <ToggleIcon
                                    label="PRODUCT"
                                    to="/admin/product"
                                    isExpanded={expandedMenus.PRODUCT}
                                    onToggle={() => handleTapToggle('PRODUCT')}
                                />
                                <ToggleIcon
                                    label="CATEGORY"
                                    to="/admin/category"
                                    isExpanded={expandedMenus.CATEGORY}
                                    onToggle={() => handleTapToggle('CATEGORY')}
                                />
                            </>
                        ) : (
                            <>
                                <ToggleIcon
                                    label="PROMOTION"
                                    to="/"
                                    isExpanded={expandedMenus.PROMOTION}
                                    onToggle={() => handleTapToggle('PROMOTION')}
                                />
                                <ToggleIcon
                                    label="SHOP"
                                    to="/"
                                    isExpanded={expandedMenus.SHOP}
                                    onToggle={() => handleTapToggle('SHOP')}
                                />
                                {expandedMenus.SHOP && <Category categories={categories} />}
                                <ToggleIcon
                                    label="ADMIN"
                                    to="/admin/order"
                                    isExpanded={expandedMenus.ADMIN}
                                    onToggle={() => handleTapToggle('ADMIN')}
                                />
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default LeftSide;
