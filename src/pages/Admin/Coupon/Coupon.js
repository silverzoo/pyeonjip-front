import React, { useState, useEffect } from 'react';
import {
    Button, Form, Container, Modal, Alert
} from 'react-bootstrap';
import {
    createCouponAPI,
    createRandomCouponAPI,
    deleteCouponAPI,
    fetchCouponsAPI,
    updateCouponAPI
} from "../../../utils/CouponUtils";
import { MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { ToastContainer, toast } from 'react-toastify'; // Import Toast components
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

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
        active: true,
    });
    const [randomDiscount, setRandomDiscount] = useState(10);
    const [couponToDelete, setCouponToDelete] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        const data = await fetchCouponsAPI();
        setCoupons(data);
    };

    const handleModalOpen = (coupon = { code: '', discount: 0, expiryDate: '', active: true }) => {
        setCurrentCoupon(coupon);
        setShowModal(true);
        setError(''); // Reset error message
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCoupon((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = () => {
        setCurrentCoupon((prev) => ({ ...prev, active: !prev.active }));
    };

    const validateCoupon = () => {
        const isDuplicate = coupons.some(coupon => coupon.code === currentCoupon.code && coupon.id !== currentCoupon.id);
        if (isDuplicate) {
            setShowModal(false);
            toast.error("중복된 코드이름입니다.", {
                position: "top-center",
                autoClose: 2000,
            });
            return false;
        }
        if (currentCoupon.discount < 0 || currentCoupon.discount > 99 || !currentCoupon.code.trim()
            || currentCoupon.discount === '' || currentCoupon.discount === null || !currentCoupon.expiryDate) {
            setShowModal(false);
            toast.error("올바른 값을 입력해 주세요", {
                position: "top-center",
                autoClose: 2000,
            });
            return false;
        }
        setError('');
        return true;
    };

    const saveCoupon = async () => {
        if (!validateCoupon()) return; // Validate before proceeding

        try {
            if (currentCoupon.id) {
                await updateCouponAPI(currentCoupon);
            } else {
                await createCouponAPI(currentCoupon);
            }

            // Close the modal and fetch coupons only after saving is successful
            setShowModal(false);
            fetchCoupons();
            toast.success("쿠폰이 저장되었습니다.", {
                position: "top-center",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error("올바른 값을 입력해 주세요", {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    const confirmDeleteCoupon = (id) => {
        setCouponToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteCoupon = async () => {
        if (couponToDelete) {
            await deleteCouponAPI(couponToDelete);
            setShowDeleteModal(false);
            fetchCoupons();
            toast.success("쿠폰이 삭제되었습니다.",{
                position: "top-center",
                    autoClose: 2000,}
        )
        }
    };

    const handleRandomCouponModalOpen = () => {
        setRandomDiscount(10);
        setShowRandomCouponModal(true);
    };

    const createRandomCoupon = async () => {
        await createRandomCouponAPI(randomDiscount);
        setShowRandomCouponModal(false);
        fetchCoupons();
        toast.success("쿠폰이 생성되었습니다.",{
            position: "top-center",
            autoClose: 2000,}
        )
    };

    return (
        <Container className="card border-0 p-5 border rounded" style={{ marginTop: '20px' }}>
            <ToastContainer /> {/* Add ToastContainer here */}
            <h2 className="text-center mb-5">쿠폰 관리</h2>

            {error && <Alert variant="danger">{error}</Alert>} {/* Display error messages */}

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

            {/* 삭제 확인 모달 */}
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
        </Container>
    );
};

export default CouponComponent;
