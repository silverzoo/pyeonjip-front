import { Link } from 'react-router-dom';

function ToggleIcon({ label, to, isExpanded, onToggle }) {

    return (
        <li onClick={onToggle}>
            <Link to={to}>
                {isExpanded ? <span className='tapMark'>-</span> : <span className='tapMark'>+</span>} &nbsp;&nbsp;{label}
            </Link>
        </li>
    );
}

export default ToggleIcon;
