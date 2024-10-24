import React, { useEffect } from 'react';

function Icon({ hasChildren, hasParent }) {
    useEffect(() => {
        window.feather.replace();
    }, []);

    return (
        <span>
            {hasParent ? (
                hasChildren ? (
                    <i className="middle-folder">
                        <i data-feather="more-vertical"
                           style={{width: '10px', height: '16px', marginTop: '-3px', marginRight: '-6px'}}></i>
                        <i data-feather="more-horizontal"
                           style={{width: '10px', height: '16px', marginTop: '3px'}}></i>&nbsp;
                        <i data-feather="folder"
                           style={{width: '16px', height: '16px', marginTop: '-3px', marginRight: '3px'}}></i>&nbsp;
                    </i>
                ) : (
                    <i className="last-folder">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <i data-feather="more-vertical"
                           style={{width: '10px', height: '16px', marginTop: '-3px', marginRight: '-5px'}}></i>
                        <i data-feather="more-horizontal"
                           style={{width: '10px', height: '16px', marginTop: '3px', marginRight: '5px'}}></i>&nbsp;
                    </i>
                )
            ) : (
                <i className="top-folder">
                    <i data-feather="folder"
                       style={{width: '16px', height: '16px', marginTop: '-3px', marginRight: '3px'}}></i>&nbsp;
                </i>
            )}
        </span>
    );
}

export default Icon;