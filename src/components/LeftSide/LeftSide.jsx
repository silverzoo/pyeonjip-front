import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './LeftSide.css';
import ToggleIcon from "./ToggleIcon/ToggleIcon";
import Category from "./Tab/Category";
import Admin from "./Tab/Admin";
import { useAuth } from "../../context/AuthContext";

const LeftSide = () => {
    const { isAdmin } = useAuth();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({
        SHOP: false,
        ADMIN: false,
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
        };

        if (path.startsWith('/admin')) {
            newState.ADMIN = true;
        }

        if (path.startsWith('/category')) {
            newState.SHOP = true;
        }

        setExpandedMenus(newState);
    }, [location]);

    const handleTapToggle = (menuName) => {
        const currentExpandedState = expandedMenus[menuName];
        setExpandedMenus(prevState => ({
            ...prevState,
            [menuName]: !currentExpandedState,
        }));
    };

    return (
        <div className='left-side-container'>
            <div className="left-side-logo">
                <Link to="/"><img src={logo} alt="logo" width="88"/></Link>
            </div>
            <div className="left-side-menu">
                <ToggleIcon
                    label="SHOP"
                    to="/category/all"
                    isExpanded={expandedMenus.SHOP}
                    onToggle={() => handleTapToggle('SHOP')}
                    hasChildren={true}
                    className={`toggle-icon ${expandedMenus.SHOP ? 'expanded' : ''}`}
                />
                <div className={`collapse-content ${expandedMenus.SHOP ? 'expanded' : ''}`}>
                    {expandedMenus.SHOP && <Category categories={categories} />}
                </div>
                {/*<div style={{ height: '15px' }} />*/}
                {isAdmin && (
                    <ToggleIcon
                        label="ADMIN"
                        to="/admin"
                        isExpanded={expandedMenus.ADMIN}
                        onToggle={() => handleTapToggle('ADMIN')}
                        hasChildren={true}
                        className={`toggle-icon ${expandedMenus.ADMIN ? 'expanded' : ''}`}
                    />
                )}
                <div className={`collapse-content ${expandedMenus.ADMIN ? 'expanded' : ''}`}>
                    {expandedMenus.ADMIN && <Admin />}
                </div>
            </div>
        </div>
    );
};

export default LeftSide;
