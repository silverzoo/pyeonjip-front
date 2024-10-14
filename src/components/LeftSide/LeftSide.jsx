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
        SHOP: false,
        ADMIN: false,
        CATEGORY: false,
        ORDER: false,
        PRODUCT: false,
    });

    useEffect(() => {
        fetch('/api/category')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        const path = location.pathname;

        const newState = {
            SHOP: false,
            ADMIN: false,
            CATEGORY: false,
            ORDER: false,
            PRODUCT: false,
        };

        if (path.startsWith('/admin')) {
            newState.ADMIN = true;
            if (path.startsWith('/admin/order')) {
                newState.ORDER = true;
            }
            if (path.startsWith('/admin/product')) {
                newState.PRODUCT = true;
            }
            if (path.startsWith('/admin/category')) {
                newState.CATEGORY = true;
            }
        }

        if (path.startsWith('/category')) {
            newState.SHOP = true;
        }

        setExpandedMenus(newState);
    }, [location]);

    const handleTapToggle = (menuName) => {
        const currentExpandedState = expandedMenus[menuName];

        const newExpandedState = Object.keys(expandedMenus).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});

        newExpandedState[menuName] = !currentExpandedState;

        setExpandedMenus(newExpandedState);
    };

    return (
        <div className='container'>
            <div className="logo">
                <Link to="/"><img src={logo} alt="logo" width="86" /></Link>
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
                                label="SHOP"
                                to="/category"
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
    );
};

export default LeftSide;
