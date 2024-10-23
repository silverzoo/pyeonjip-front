import React, { useState } from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';
import { useLocation } from "react-router-dom";

function Admin() {
    const location = useLocation();
    const [expandedMenus, setExpandedMenus] = useState({
        ORDER: false,
        PRODUCT: false,
        CATEGORY: false,
        COUPON: false,
    });

    const handleToggle = (menuName) => {
        setExpandedMenus((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    return (
        <>
            <ToggleIcon
                label="ORDER"
                to="/admin/order"
                isExpanded={expandedMenus.ORDER}
                onToggle={() => handleToggle('ORDER')}
                hasChildren={false}
            />
            <ToggleIcon
                label="PRODUCT"
                to="/admin/product"
                isExpanded={expandedMenus.PRODUCT}
                onToggle={() => handleToggle('PRODUCT')}
                hasChildren={false}
            />
            <ToggleIcon
                label="CATEGORY"
                to="/admin/category"
                isExpanded={expandedMenus.CATEGORY}
                onToggle={() => handleToggle('CATEGORY')}
                hasChildren={false}
            />
            <ToggleIcon
                label="COUPON"
                to="/admin/coupon"
                isExpanded={expandedMenus.COUPON}
                onToggle={() => handleToggle('COUPON')}
                hasChildren={false}
            />
        </>
    );
}

export default Admin;
