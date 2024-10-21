import React, {useState} from 'react';
import ToggleIcon from '../ToggleIcon/ToggleIcon';
import {useLocation} from "react-router-dom";

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

    const isOrderActive = location.pathname.startsWith('/admin/order');
    const isProductActive = location.pathname.startsWith('/admin/product');
    const isCategoryActive = location.pathname.startsWith('/admin/category');
    const isCouponActive = location.pathname.startsWith('/admin/coupon');

    return (
        <>
            <ToggleIcon
                label="ORDER"
                to="/admin/order"
                isExpanded={expandedMenus.ORDER}
                onToggle={() => handleToggle('ORDER')}
                hasChildren={false}
                isActive={isOrderActive}
            />
            <ToggleIcon
                label="PRODUCT"
                to="/admin/product"
                isExpanded={expandedMenus.PRODUCT}
                onToggle={() => handleToggle('PRODUCT')}
                hasChildren={false}
                isActive={isProductActive}
            />
            <ToggleIcon
                label="CATEGORY"
                to="/admin/category"
                isExpanded={expandedMenus.CATEGORY}
                onToggle={()=> handleToggle('CATEGORY')}
                hasChildren={false}
                isActive={isCategoryActive}
            />
            <ToggleIcon
                label="COUPON"
                to="/admin/coupon"
                isExpanded={expandedMenus.COUPON}
                onToggle={() => handleToggle('COUPON')}
                hasChildren={false}
                isActive={isCouponActive}
            />
        </>
    );
}

export default Admin;
