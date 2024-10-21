import { NavLink } from 'react-router-dom';

function ToggleIcon({ label, to, isExpanded, onToggle, hasChildren, isActive }) {

    return (

        <div style={{ marginBottom: '10px' }}>
            <NavLink
                to={to}
                style={{
                    fontWeight: isActive ? 'bold' : 'normal',
                }}
                onClick={hasChildren ? onToggle : undefined}
            >
                {hasChildren ? (
                    <span className='tapMark' onClick={onToggle}>{isExpanded ? '-' : '+'}</span>
                ) : (
                    <span className='tapMark' onClick={onToggle}>&nbsp;&nbsp;</span>
                )}
                &nbsp;&nbsp;{label}
            </NavLink>
        </div>
    );
}

export default ToggleIcon;
