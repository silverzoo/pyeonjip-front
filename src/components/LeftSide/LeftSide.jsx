import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import logo from '../../logo.svg';
import './LeftSide.css';
import ToggleIcon from "./ToggleIcon/ToggleIcon";
import Category from "./Tab/Category";
import Admin from "./Tab/Admin";
import { useAuth } from "../../context/AuthContext";
import {fetchGetCategories} from "../../api/AdminUtils";

const LeftSide = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({
        SHOP: false,
        ADMIN: false,
    });

    useEffect(() => {
        const fetchData = () => {
            fetchGetCategories()
                .then(data => {
                    setCategories(data);
                })
                .catch(error => {
                    alert(error.message);
                    navigate('/');
                });
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        const path = location.pathname;

        const newState = {
            SHOP: path.startsWith('/category'),
            ADMIN: path.startsWith('/admin'),
        };

        setExpandedMenus(newState);
    }, [location]);

    const handleTapToggle = (menuName) => {
        const currentExpandedState = expandedMenus[menuName];
        setExpandedMenus(prevState => ({
            ...prevState,
            [menuName]: !currentExpandedState,
        }));
    };

    const isShopActive = expandedMenus.SHOP;
    const isAdminActive = location.pathname.startsWith('/admin');

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
                    isActive={isShopActive}
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
                        isActive={isAdminActive}
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
