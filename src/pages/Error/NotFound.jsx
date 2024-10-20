import './Error.css';
import {useLocation} from "react-router-dom";

function NotFound () {
    const location = useLocation();
    const errorMessage = location.state?.message || "페이지를 찾을 수 없습니다.";

    return (
        <div className='error-not-found'>
            <h1>404 Not Found</h1>
            <p>{errorMessage}</p>
        </div>
    );
}
export default NotFound;