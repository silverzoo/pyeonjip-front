import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function CommentSection({ productId }) {
    const [comments, setComments] = useState([]);
    const location = useLocation();

    useEffect(() => {
        // productId가 null일 경우 URL 쿼리 파라미터에서 가져오기
        const queryParams = new URLSearchParams(location.search);
        const idFromQuery = queryParams.get('productId');

        // 최종적으로 사용할 productId 결정
        const idToFetch = productId || idFromQuery;

        if (idToFetch) {
            fetch(`http://localhost:8080/api/comments/product/${idToFetch}`)
                .then((response) => response.json())
                .then((data) => {
                    if (Array.isArray(data)) {
                        setComments(data); // 배열인 경우에만 상태 업데이트
                    } else {
                        console.error('응답 데이터가 배열이 아닙니다:', data);
                        setComments([]); // 기본값으로 빈 배열 설정
                    }
                })
                .catch((error) => console.error('댓글을 가져오는 중 오류 발생:', error));
        }
    }, [productId, location.search]); // location.search를 의존성 배열에 추가

    // 평균 별점 계산
    const calculateAverageRating = () => {
        if (comments.length === 0) return 0;
        const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
        return (totalRating / comments.length).toFixed(1); // 소수점 한 자리까지 반올림
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

export default CommentSection;
