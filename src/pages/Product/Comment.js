import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Comment.css'; // 추가 스타일 파일
import { useAuth } from '../../context/AuthContext'; // AuthContext 활용

function CommentSection({ productId }) {
    const [comments, setComments] = useState([]);
    const [newTitle, setNewTitle] = useState(''); // 제목 상태 추가
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0); // 추가된 별점 상태
    const [editingCommentId, setEditingCommentId] = useState(null); // 수정할 댓글 ID
    const [editingTitle, setEditingTitle] = useState(''); // 수정할 제목 상태 추가
    const [editingContent, setEditingContent] = useState('');
    const [editingRating, setEditingRating] = useState(0); // 수정할 별점 상태
    const { isLogin, email } = useAuth(); // 로그인 여부와 이메일 가져오기

    // 댓글 목록을 가져오는 useEffect
    useEffect(() => {
        fetch(`http://localhost:8080/api/comments/product/${productId}`)
            .then(response => response.json())
            .then(data => {
                setComments(data);
            })
            .catch(error => console.error('Error fetching comments:', error));
    }, [productId]);

    // 댓글 추가 함수
    const handleAddComment = () => {
        if (!newComment.trim() || !newTitle.trim() || newRating === 0) return; // 제목과 별점 체크

        const comment = { title: newTitle, content: newComment, productId, email, rating: newRating }; // 제목 포함
        fetch('http://localhost:8080/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(comment),
        })
            .then(response => response.json())
            .then(savedComment => {
                setComments(prev => [...prev, savedComment]);
                setNewTitle(''); // 입력 후 제목 초기화
                setNewComment('');
                setNewRating(0); // 입력 후 별점 초기화
            })
            .catch(error => console.error('Error adding comment:', error));
    };

    // 댓글 수정 함수
    const handleEditComment = (id, title, content, rating) => {
        setEditingCommentId(id);
        setEditingTitle(title);
        setEditingContent(content);
        setEditingRating(rating); // 기존 별점 설정
    };

    const handleUpdateComment = () => {
        if (!editingContent.trim() || !editingTitle.trim()) return;

        const updatedComment = {
            title: editingTitle,
            content: editingContent,
            rating: editingRating
        }; // 수정할 제목과 별점 포함
        fetch(`http://localhost:8080/api/comments/${editingCommentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedComment),
        })
            .then(() => {
                setComments(prev => prev.map(comment =>
                    comment.id === editingCommentId ? { ...comment, title: editingTitle, content: editingContent, rating: editingRating } : comment
                ));
                setEditingCommentId(null);
                setEditingTitle(''); // 초기화
                setEditingContent('');
                setEditingRating(0); // 초기화
            })
            .catch(error => console.error('Error updating comment:', error));
    };

    // 댓글 삭제 함수
    const handleDeleteComment = (id) => {
        fetch(`http://localhost:8080/api/comments/${id}`, { method: 'DELETE' })
            .then(() => setComments(prev => prev.filter(comment => comment.id !== id)))
            .catch(error => console.error('Error deleting comment:', error));
    };

    // 댓글 작성 여부 확인
    const hasUserCommented = comments.some(comment => comment.email === email);
    const [showInput, setShowInput] = useState(true); // 입력폼 표시 여부 상태 추가

    return (
        <div className="card border-0 p-3 rounded">
            <h5 className="mb-4">
                <i className="bi bi-chat-left-text me-2"></i>
                {comments.length}개의 리뷰
            </h5>

            {isLogin ? (
                hasUserCommented ? (
                    <></>
                ) : (
                    showInput && (
                        <div className="mb-3">
                            <div className="mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={`bi bi-star${newRating >= star ? '-fill' : ''} text-black cursor-pointer mx-2`}
                                        onClick={() => setNewRating(star)}
                                        style={{ fontSize: '1.2rem', marginRight: '5px', marginLeft: '5px' }}
                                    ></span>
                                ))}
                            </div>
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="제목을 입력하세요"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <textarea
                                className="form-control"
                                rows="3" // 줄 수 조정
                                placeholder="댓글을 입력하세요"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-dark mt-2 px-4" onClick={handleAddComment}>
                                    <i className="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    )
                )
            ) : (
                <div className="alert grey text-center">
                    <i className="bi bi-lock"></i> 댓글을 작성하려면 로그인 해주세요.
                </div>
            )}

            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="card mb-3">
                        <div className="card-body" style={{ paddingTop: '5px' }}>
                            {editingCommentId === comment.id ? (
                                <>
                                    <div>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span
                                                key={star}
                                                className={`bi bi-star${editingRating >= star ? '-fill' : ''} text-black cursor-pointer`}
                                                onClick={() => setEditingRating(star)}
                                                style={{ fontSize: '1.2rem', marginRight: '5px' }}
                                            ></span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control mb-1"
                                        value={editingTitle}
                                        onChange={(e) => setEditingTitle(e.target.value)}
                                    />
                                    <textarea
                                        className="form-control"
                                        rows="2"
                                        value={editingContent}
                                        onChange={(e) => setEditingContent(e.target.value)}
                                    />
                                    <div className="d-flex justify-content-end">
                                        <button
                                            className="btn btn-dark btn-sm mt-2"
                                            onClick={handleUpdateComment}
                                        >
                                            <i className="bi bi-check"></i> 수정 완료
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm mt-2 ms-2"
                                            onClick={() => setEditingCommentId(null)}
                                        >
                                            <i className="bi bi-x"></i> 취소
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-black mx-1 my-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star}
                                                  className={`bi bi-star${comment.rating >= star ? '-fill' : ''} `}
                                                  style={{ fontSize: '0.8rem', marginRight: '5px'}}
                                            ></span>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <h2 style={{ fontSize: '18px' }} className="fw-bolder">
                                            {comment.title} {/* 제목 표시 */}
                                        </h2>

                                        <h6 style={{ fontSize: '12px' }} className="text-muted">
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </h6>
                                    </div>

                                    <h6 style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word', fontSize: '15px' }}>
                                        {comment.content}
                                    </h6>

                                    {comment.email === email && (
                                        <div className="d-flex justify-content-end p-2">
                                            <button
                                                className="btn btn-outline-dark btn-sm mx-2"
                                                onClick={() => handleEditComment(comment.id, comment.title, comment.content, comment.rating)}
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
        </div>
    );
}

export default CommentSection;
