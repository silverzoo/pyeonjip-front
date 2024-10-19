import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ProductDetailRate({ productId, commentUpdated }) {
    const [comments, setComments] = useState([]);
    const location = useLocation();

    const fetchComments = () => {
        const queryParams = new URLSearchParams(location.search);
        const idFromQuery = queryParams.get('productId');
        const idToFetch = productId || idFromQuery;

        if (idToFetch) {
            fetch(`http://localhost:8080/api/comments/product/${idToFetch}`)
                .then((response) => response.json())
                .then((data) => {
                    setComments(Array.isArray(data) ? data : []);
                })
                .catch((error) => console.error('댓글을 가져오는 중 오류 발생:', error));
        }
    };

    useEffect(() => {
        fetchComments(); // 컴포넌트가 처음 렌더링될 때 호출
    }, [productId, location.search, commentUpdated]);

    const calculateAverageRating = () => {
        if (comments.length === 0) return 0;
        const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
        return (totalRating / comments.length).toFixed(1);
    };

    const averageRating = calculateAverageRating();

    return (
        <div className="text-black my-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`bi bi-star${averageRating >= star ? '-fill' : ''}`}
                    style={{ fontSize: '0.8rem', marginRight: '5px' }}
                ></span>
            ))}
            <span> ({comments.length})</span>
        </div>
    );
}

export default ProductDetailRate;
