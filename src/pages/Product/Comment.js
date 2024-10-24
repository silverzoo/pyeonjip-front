import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Comment.css';
import CommentForm from './CommentForm';
import {toast} from "react-toastify";

function Comment({ productId, setCommentUpdated, comments, setComments, email, isLoggedIn}) {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [showInput, setShowInput] = useState(false);
    const BASE_URL = "https://dsrkzpzrzxqkarjw.tunnel-pt.elice.io";

    const handleAddComment = async ({ title, content, rating }) => {
        const comment = { title, content, productId, email, rating };

        try {
            const response = await fetch(BASE_URL + '/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(comment),
            });

            if (!response.ok) {
                throw new Error('리뷰 저장에 실패했습니다.');
            }

            const savedComment = await response.json();
            setComments((prev) => [...prev, savedComment]);
            setShowInput(false);
            setCommentUpdated((prev) => !prev);
        } catch (err) {
            console.error('리뷰 저장 실패:', err);
            toast.error('리뷰 저장 중 문제가 발생했습니다. 다시 시도해주세요.', {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const handleUpdateComment = async ({ title, content, rating }) => {
        try {
            const response = await fetch(BASE_URL + `/api/comments/${editingCommentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, rating }),
            });

            if (!response.ok) {
                throw new Error('리뷰 수정에 실패했습니다.');
            }

            setComments((prev) =>
                prev.map((comment) =>
                    comment.id === editingCommentId
                        ? { ...comment, title, content, rating }
                        : comment
                )
            );
            setEditingCommentId(null);
            setCommentUpdated((prev) => !prev);

        } catch (err) {
            console.error('리뷰 수정 실패:', err);
            alert('리뷰 수정 중 문제가 발생했습니다.');
        }
    };

    const handleDeleteComment = async (id) => {
        try {
            const response = await fetch(BASE_URL + `/api/comments/${id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error('리뷰 삭제에 실패했습니다.');
            }

            setComments((prev) => prev.filter((comment) => comment.id !== id));
            setCommentUpdated((prev) => !prev);
        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            alert('리뷰 삭제 중 문제가 발생했습니다.');
        }
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
                                                onClick={() => setEditingCommentId(comment.id)}
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
                    <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <h4 className="my-3 text-muted">리뷰가 비어 있어요.</h4>
                    <p className="text-muted">리뷰를 작성해주시면 더 나은 서비스를 제공하는데 도움이 됩니다.</p>
                </div>
            )}

            {isLoggedIn && !hasUserCommented && (
                <div className="mb-3">
                    <button
                        className="btn btn-dark mb-2"
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
