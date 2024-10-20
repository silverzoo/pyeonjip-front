import { NavLink } from 'react-router-dom';

function ToggleIcon({ label, to, isExpanded, onToggle, hasChildren }) {

    return (

        <div onClick={onToggle} style={{ marginBottom: '10px' }}>
            <NavLink
                to={to}
                style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : 'normal',
                    textDecoration: 'none',
                })}
            >
                {hasChildren ? (
                    <span className='tapMark'>{isExpanded ? '-' : '+'}</span>
                ) : (
                    <span className='tapMark'>&nbsp;&nbsp;</span>
                )}
                &nbsp;&nbsp;{label}
            </NavLink>
        </div>
    );
}

export default ToggleIcon;
