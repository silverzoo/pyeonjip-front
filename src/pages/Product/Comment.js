import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Comment.css';
import { useAuth } from '../../context/AuthContext';
import CommentForm from './CommentForm'; // CommentForm 불러오기

function Comment({ productId }) {
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const { isLogin, email } = useAuth();
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/api/comments/product/${productId}`)
            .then((response) => response.json())
            .then((data) => {
                // Ensure the data is an array
                if (Array.isArray(data)) {
                    setComments(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setComments([]); // Set an empty array if the data is not valid
                }
            })
            .catch((error) => console.error('Error fetching comments:', error));
    }, [productId]);

    const handleAddComment = ({ title, content, rating }) => {
        const comment = { title, content, productId, email, rating };
        fetch('http://localhost:8080/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment),
        })
            .then((response) => response.json())
            .then((savedComment) => {
                setComments((prev) => [...prev, savedComment]);
                setShowInput(false); // 작성 완료 후 입력폼 닫기
                window.location.reload();
            })
            .catch((error) => console.error('Error adding comment:', error));
    };

    const handleUpdateComment = ({ title, content, rating }) => {
        fetch(`http://localhost:8080/api/comments/${editingCommentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, rating }),
        })
            .then(() => {
                setComments((prev) =>
                    prev.map((comment) =>
                        comment.id === editingCommentId
                            ? { ...comment, title, content, rating }
                            : comment
                    )
                );
                setEditingCommentId(null);
                window.location.reload();
            })
            .catch((error) => console.error('Error updating comment:', error));
    };

    const handleDeleteComment = (id) => {
        fetch(`http://localhost:8080/api/comments/${id}`, { method: 'DELETE' })
            .then(() => setComments((prev) => prev.filter((comment) => comment.id !== id)))
            .catch((error) => console.error('Error deleting comment:', error));
        window.location.reload();
    };

    const hasUserCommented = comments.some((comment) => comment.email === email);

    return (
        <div className="card border-0 p-3 rounded">
            <h6 className="mb-1">
                <i className="bi bi-chat-left-text me-2"></i>
                {comments.length}개의 리뷰
            </h6>
            <hr />

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="card mb-1 border-0">
                        <div className="card-body" style={{ paddingTop: '5px' }}>
                            {editingCommentId === comment.id ? (
                                <CommentForm
                                    onSubmit={handleUpdateComment}
                                    initialTitle={comment.title}
                                    initialContent={comment.content}
                                    initialRating={comment.rating}
                                    buttonText="수정 완료"
                                    onCancel={() => setEditingCommentId(null)}
                                />
                            ) : (
                                <>
                                    <div className="text-black my-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span
                                                key={star}
                                                className={`bi bi-star${comment.rating >= star ? '-fill' : ''}`}
                                                style={{ fontSize: '0.8rem', marginRight: '5px' }}
                                            ></span>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h2 style={{ fontSize: '18px' }} className="fw-bolder">
                                            {comment.title}
                                        </h2>
                                        <h6 style={{ fontSize: '12px' }} className="text-muted">
                                            {new Date(comment.updatedAt || comment.createdAt).toLocaleString()}
                                        </h6>
                                    </div>
                                    <h6 style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', fontSize: '15px' }}>
                                        {comment.content}
                                    </h6>

                                    {comment.email === email && (
                                        <div className="d-flex justify-content-end p-2">
                                            <button
                                                className="btn btn-outline-dark btn-sm mx-2"
                                                onClick={() =>
                                                    setEditingCommentId(comment.id)
                                                }
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button
                                                className="btn btn-dark btn-sm"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    )}
                                    <hr />
                                </>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center mt-4">
                    <i className="bi bi-emoji-frown" style={{fontSize: '3rem', color: '#6c757d'}}></i>
                    <h4 className="my-3 text-muted">리뷰가 비어 있어요.</h4>
                    <p className="text-muted">
                        리뷰를 작성해주시면 더 나은 서비스를 제공하는데 도움이 됩니다.
                    </p>
                </div>
            )}

            {isLogin && !hasUserCommented && (
                <div className="mb-3">
                    <button
                        className="btn btn-dark mb-2 "
                        onClick={() => setShowInput((prev) => !prev)}
                    >
                        {showInput ? '취소' : '리뷰 작성하기'}
                    </button>
                    {showInput && <CommentForm onSubmit={handleAddComment} />}
                </div>
            )}
        </div>
    );
}

export default Comment;
