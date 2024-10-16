import { Link } from 'react-router-dom';

function ToggleIcon({ label, to, isExpanded, onToggle, isSelected, hasChildren }) {

    return (
        <li onClick={onToggle}>
            <Link to={to}
                  style={{
                      fontWeight: isSelected ? 'bold' : 'normal',
                  }}>
                {hasChildren ? (
                    isExpanded ? <span className='tapMark'>-</span> : <span className='tapMark'>+</span>
                ) : (
                    <span className='tapMark'>&nbsp;&nbsp;</span>
                )}
                &nbsp;&nbsp;{label}
            </Link>
        </li>
    );
}

export default ToggleIcon;
