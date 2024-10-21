import React, { useState, useEffect } from 'react';
import {useAuth} from "../../../context/AuthContext";
import {useNavigate} from "react-router-dom";

export const fetchGetCategories = async () => {
    const response = await fetch('/api/category');
    return await response.json();
}

function AdminCategory() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await fetchGetCategories();
                setCategories(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        getCategories();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <div className="admin-category-container">
                <div>
                    <h2>어드민 홈페이지 - 카테고리 관리</h2>
                    <ul>
                        {categories.map((category) => (
                            <li key={category.id}>{category.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminCategory;
