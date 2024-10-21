import React, { useState } from 'react';

function CommentForm({
                         onSubmit,
                         initialTitle = '',
                         initialContent = '',
                         initialRating = 0,
                         buttonText = '작성',
                         onCancel
                     }) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [rating, setRating] = useState(initialRating);
    const [errors, setErrors] = useState({ title: '', content: '', rating: '' });

    const handleSubmit = () => {
        let newErrors = { title: '', content: '', rating: '' };

        if (!title.trim() || !content.trim()) {
            newErrors.rating = '글을 모두 작성해 주세요';
        }
        if (rating === 0) {
            newErrors.rating = '별점을 선택하세요.';
        }

        if (newErrors.title || newErrors.content || newErrors.rating) {
            setErrors(newErrors);
            return;
        }

        onSubmit({ title, content, rating });
        setTitle('');
        setContent('');
        setRating(0);
        setErrors({ title: '', content: '', rating: '' }); // Reset errors
    };

    return (
        <div>
            <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`bi bi-star${rating >= star ? '-fill' : ''} text-black cursor-pointer mx-2`}
                        onClick={() => setRating(star)}
                        style={{ fontSize: '1.2rem', marginRight: '5px', marginLeft: '5px' }}
                    ></span>
                ))}
                {errors.rating && <div className="text-danger">{errors.rating}</div>}
            </div>
            <input
                type="text"
                className={`form-control mb-2 ${errors.title ? 'is-invalid' : ''}`}
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors({ ...errors, title: '' });
                }}
            />
            {errors.title && <div className="text-danger">{errors.title}</div>}
            <textarea
                className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                rows="3"
                placeholder="댓글을 입력하세요"
                value={content}
                onChange={(e) => {
                    setContent(e.target.value);
                    if (errors.content) setErrors({ ...errors, content: '' });
                }}
            />
            {errors.content && <div className="text-danger">{errors.content}</div>}
            <div className="d-flex justify-content-end">
                <button className="btn btn-dark mt-2 px-4" onClick={handleSubmit}>
                    {buttonText}
                </button>
                {onCancel && (
                    <button className="btn btn-secondary mt-2 ms-2" onClick={onCancel}>
                        취소
                    </button>
                )}
            </div>
        </div>
    );
}

export default CommentForm;
