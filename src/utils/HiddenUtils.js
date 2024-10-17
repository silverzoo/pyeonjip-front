import React from 'react';
import { useLocation } from 'react-router-dom';

const HiddenUtils = ({ whitelist, children }) => {
    const location = useLocation();
    const isVisible = !whitelist.some(path => location.pathname.startsWith(path));

    return isVisible ? <>{children}</> : null;
};

export default HiddenUtils;
