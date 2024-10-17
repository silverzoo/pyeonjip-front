import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../logo.svg';
import './LeftSide.css';
import ToggleIcon from "./ToggleIcon/ToggleIcon";
import Category from "./Tab/Category";
import AdminMenu from "./Tab/AdminMenu";

const LeftSide = () => {
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

        if (path.startsWith('/category') || path.startsWith('/product-detail')) {
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
                <Link to="/"><img src={logo} alt="logo" width="86"/></Link>
            </div>
            <div className="menu">
                <ul>
                    <ToggleIcon
                        label="SHOP"
                        to="/category"
                        isExpanded={expandedMenus.SHOP}
                        onToggle={() => handleTapToggle('SHOP')}
                        hasChildren={true}
                    />
                    {expandedMenus.SHOP && <Category categories={categories}/>}
                    <ToggleIcon
                        label="ADMIN"
                        to="/admin"
                        isExpanded={expandedMenus.ADMIN}
                        onToggle={() => handleTapToggle('ADMIN')}
                        hasChildren={true}
                    />
                    {expandedMenus.ADMIN && <AdminMenu/>}
                </ul>
            </div>
        </div>
    );
};

export default LeftSide;
