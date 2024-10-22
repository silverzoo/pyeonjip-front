import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLayout = () => {
    const navigate = useNavigate();
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (!isAdmin) {
            toast.error("관리자 로그인이 필요합니다.", {
                position: "top-center",
                transition: Zoom,
            });

            const timer = setTimeout(() => {
                navigate("/login");
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [isAdmin, navigate]);

    return (
        <>
            <ToastContainer />
            {isAdmin ? <Outlet /> : null}
        </>
    );
};

export default AdminLayout;
