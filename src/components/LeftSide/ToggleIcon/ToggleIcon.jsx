import { NavLink } from 'react-router-dom';

function ToggleIcon({ label, to, isExpanded, onToggle, isSelected, hasChildren }) {

    return (
        <li onClick={onToggle}>
            <NavLink
                to={to}
                style={({ isActive }) => ({
                    fontWeight: isActive ? 'bold' : 'normal',
                })}
            >
                {hasChildren ? (
                    isExpanded ? <span className='tapMark'>-</span> : <span className='tapMark'>+</span>
                ) : (
                    <span className='tapMark'>&nbsp;&nbsp;</span>
                )}
                &nbsp;&nbsp;{label}
            </NavLink>
        </li>
    );
}

export default ToggleIcon;
