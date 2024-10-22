import React, { useState, useEffect } from 'react';
import {
    Button, Form, Container, Alert, Modal
} from 'react-bootstrap';
import {
    createCouponAPI,
    createRandomCouponAPI,
    deleteCouponAPI,
    fetchCouponsAPI,
    updateCouponAPI
} from "../../../utils/CouponUtils";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';

const CouponComponent = () => {
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showRandomCouponModal, setShowRandomCouponModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [currentCoupon, setCurrentCoupon] = useState({
        code: '',
        discount: 0,
        expiryDate: '',
        active: true, // 활성화 상태 추가
    });
    const [randomDiscount, setRandomDiscount] = useState(10);
    const [couponToDelete, setCouponToDelete] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const data = await fetchCouponsAPI();
            setCoupons(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleModalOpen = (coupon = { code: '', discount: 0, expiryDate: '', active: true }) => {
        setCurrentCoupon(coupon);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = () => {
        setCurrentCoupon((prev) => ({ ...prev, active: !prev.active })); // 활성화 상태 토글
    };

    const saveCoupon = async () => {
        try {
            if (currentCoupon.id) {
                await updateCouponAPI(currentCoupon);
            } else {
                await createCouponAPI(currentCoupon);
            }
            setShowModal(false);
            fetchCoupons();
        } catch (err) {
            setError(err.message);
        }
    };

    const confirmDeleteCoupon = (id) => {
        setCouponToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteCoupon = async () => {
        if (couponToDelete) {
            try {
                await deleteCouponAPI(couponToDelete);
                setShowDeleteModal(false);
                fetchCoupons();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleRandomCouponModalOpen = () => {
        setRandomDiscount(10);
        setShowRandomCouponModal(true);
    };

    const createRandomCoupon = async () => {
        try {
            await createRandomCouponAPI(randomDiscount);
            setShowRandomCouponModal(false);
            fetchCoupons();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Container className="card border-0 p-5 border rounded" style={{ marginTop: '20px' }}>
            <h2 className="text-center mb-5">쿠폰 관리</h2>

            <MDBTable border responsive className="rounded hvlo-table my-5">
                <MDBTableHead>
                    <tr>
                        <th>ID</th>
                        <th>쿠폰 코드</th>
                        <th>할인율</th>
                        <th>상태</th>
                        <th>만료 날짜</th>
                        <th>작업</th>
                    </tr>
                </MDBTableHead>
                <MDBTableBody>
                    {coupons.length > 0 ? (
                        coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td className="align-content-center justify-content-center">{coupon.id}</td>
                                <td className="align-content-center">{coupon.code}</td>
                                <td className="align-content-center">{coupon.discount}%</td>
                                <td className="align-content-center">{coupon.active ? '활성' : '비활성'}</td>
                                <td className="align-content-center">{new Date(coupon.expiryDate).toLocaleString()}</td>
                                <td>
                                    <Button
                                        variant=""
                                        size="sm"
                                        className="me-2 btn btn-outline-dark my-3"
                                        onClick={() => handleModalOpen(coupon)}
                                    >
                                        수정
                                    </Button>
                                    <Button
                                        variant="dark"
                                        size="sm"
                                        onClick={() => confirmDeleteCoupon(coupon.id)}
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
                </MDBTableBody>
            </MDBTable>
            <div className="d-flex justify-content-end align-items-center">
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
                    onClick={handleRandomCouponModalOpen}
                >
                    랜덤 쿠폰 생성
                </Button>
            </div>

            {/* 커스텀 쿠폰 모달 */}
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
                            <Form.Label>할인율 (%)</Form.Label>
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
                        <Form.Group controlId="active" className="mb-3">
                            <Form.Check
                                type="switch"
                                label="활성화 상태"
                                checked={currentCoupon.active}
                                onChange={handleToggleActive}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => setShowModal(false)}>
                        취소
                    </Button>
                    <Button variant="dark" onClick={saveCoupon}>
                        저장
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 랜덤 쿠폰 모달 */}
            <Modal show={showRandomCouponModal} onHide={() => setShowRandomCouponModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>랜덤 쿠폰 생성</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="randomDiscount" className="mb-3">
                            <Form.Label>할인율 (%)</Form.Label>
                            <Form.Control
                                type="number"
                                name="randomDiscount"
                                value={randomDiscount}
                                onChange={(e) => setRandomDiscount(e.target.value)}
                                min={0}
                                max={100}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => setShowRandomCouponModal(false)}>
                        취소
                    </Button>
                    <Button variant="dark" onClick={createRandomCoupon}>
                        생성
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* 쿠폰 삭제 확인 모달 */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>쿠폰 삭제 확인</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>이 쿠폰을 삭제하시겠습니까?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-dark" onClick={() => setShowDeleteModal(false)}>
                        취소
                    </Button>
                    <Button variant="dark" onClick={deleteCoupon}>
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>

            {error && <Alert variant="danger">{error}</Alert>}
        </Container>
    );
};

export default CouponComponent;
