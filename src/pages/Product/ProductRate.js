import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function ProductRate({ productId }) {
    const [comments, setComments] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromQuery = queryParams.get('productId');
        const idToFetch = productId || idFromQuery;

        if (idToFetch) {
            fetch(`http://localhost:8080/api/comments/product-rating/${idToFetch}`)
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setComments(data);
                    } else {
                        setComments([]);
                    }
                })
                .catch((error) =>
                    console.error('댓글을 가져오는 중 오류 발생:', error)
                );
        }
    }, [productId, location.search]);

    const calculateAverageRating = () => {
        if (comments.length === 0) return 0;
        const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
        return (totalRating / comments.length).toFixed(1);
    };

    const averageRating = calculateAverageRating();

    return (
        <div className="text-black my-1 d-flex align-items-center" style={{ fontSize: '11px', color: '#818181' }}>
            <span
                className="bi bi-star-fill"
                style={{ marginRight: '3px', color: '#818181' }}
            ></span>
            <span style={{ marginRight: '6px', fontWeight: 'bold', color: '#818181' }}>{averageRating}</span>
            <span style={{ marginRight: '10px', fontWeight: 'bold', color: '#818181' }}>({comments.length})</span>
        </div>
    );
}

export default ProductRate;
