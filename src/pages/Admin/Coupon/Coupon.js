import React, { useState, useEffect } from 'react';
import {
    Button, Form, Table, Spinner, Container, Alert, Modal
} from 'react-bootstrap';
import {
    createCouponAPI,
    createRandomCouponAPI,
    deleteCouponAPI,
    fetchCouponsAPI,
    updateCouponAPI
} from "../../../utils/CouponUtils";

const CouponComponent = () => {
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        code: '',
        discount: 0,
        expiryDate: '',
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const data = await fetchCouponsAPI();
            setCoupons(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleModalOpen = (coupon = { code: '', discount: 0, expiryDate: '' }) => {
        setCurrentCoupon(coupon);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const saveCoupon = async () => {
        try {
            setLoading(true);
            if (currentCoupon.id) {
                await updateCouponAPI(currentCoupon);
            } else {
                await createCouponAPI(currentCoupon);
            }
            setShowModal(false);
            fetchCoupons();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteCoupon = async (id) => {
        if (window.confirm('이 쿠폰을 삭제하시겠습니까?')) {
            try {
                setLoading(true);
                await deleteCouponAPI(id);
                fetchCoupons();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const createRandomCoupon = async () => {
        const discount = prompt('할인율을 입력하세요 (0-100):', '10');
        if (discount === null) return; // 취소 버튼 클릭 시 종료
        try {
            setLoading(true);
            await createRandomCouponAPI(discount);
            fetchCoupons();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className=" card mt-5 p-4 border rounded shadow-sm" style={{ maxWidth: '900px' }}>
            <h2 className="text-center mb-4">쿠폰 관리</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-start align-items-center">
            <Button
                variant="dark"
                className="mb-4 shadow-sm"
                onClick={() => handleModalOpen()}
            >
                커스텀 쿠폰 생성
            </Button>

            <Button
                variant=""
                className="mb-4 ms-2 btn btn-outline-dark"
                onClick={createRandomCoupon}
            >
                랜덤 쿠폰 생성
            </Button>
            </div>
            <Table striped bordered hover responsive className="shadow-sm">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>쿠폰 코드</th>
                    <th>할인율</th>
                    <th>상태</th>
                    <th>만료 날짜</th>
                    <th>작업</th>
                </tr>
                </thead>
                <tbody>
                {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <tr key={coupon.id}>
                            <td>{coupon.id}</td>
                            <td>{coupon.code}</td>
                            <td>{coupon.discount}%</td>
                            <td>{coupon.active ? '활성' : '비활성'}</td>
                            <td>{new Date(coupon.expiryDate).toLocaleString()}</td>
                            <td>
                                <Button
                                    variant=""
                                    size="sm"
                                    className="me-2 btn btn-outline-dark"
                                    onClick={() => handleModalOpen(coupon)}
                                >
                                    수정
                                </Button>
                                <Button
                                    variant="dark"
                                    size="sm"
                                    onClick={() => deleteCoupon(coupon.id)}
                                >
                                    삭제
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">
                            쿠폰이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentCoupon.id ? '쿠폰 수정' : '쿠폰 생성'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="code" className="mb-3">
                            <Form.Label>쿠폰 코드</Form.Label>
                            <Form.Control
                                type="text"
                                name="code"
                                value={currentCoupon.code}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="discount" className="mb-3">
                            <Form.Label column="discount">할인율 (%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="discount"
                                value={currentCoupon.discount}
                                onChange={handleInputChange}
                                min={0}
                                max={100}
                            />
                        </Form.Group>
                        <Form.Group controlId="expiryDate" className="mb-3">
                            <Form.Label>만료 날짜</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="expiryDate"
                                value={currentCoupon.expiryDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        취소
                    </Button>
                    <Button variant="dark" onClick={saveCoupon} disabled={loading}>
                        {loading ? '저장 중...' : '저장'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CouponComponent;