import './Error.css';
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect} from "react";

function NotFound () {
    const navigate = useNavigate();

    useEffect(() => {
        // 아이콘을 교체하는 함수
        window.feather.replace();
    }, []);

    return (
        <div className='error-not-found card border-0' style={{marginTop: '150px'}}>
            <i className="bi bi-emoji-frown" style={{fontSize: '6rem', color: '#333333'}}></i>
            <h1 className='not-found-title ' >404 Not Found</h1>
            <div className='not-found-content'>
                <p>존재하지 않는 주소를 입력하셨거나,</p>
                <p>요청하신 페이지의 주소가 변경, 삭제되어 찾을 수 없습니다.</p>
            </div>
            <div className='error-back-btn'>
                <button onClick={() => { navigate('/');}}>
                    <i data-feather="arrow-left"
                       style={{width: '14px', height: '14px', marginTop: '-3px', marginRight: '3px'}}></i>
                    <span>GO HOME</span>
                </button>
            </div>

        </div>

    );
}

export default NotFound;