import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Spinner, Container, Row, Col, Alert } from 'react-bootstrap';

const CouponComponent = () => {
    const [discount, setDiscount] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/coupon');
            if (!response.ok) throw new Error('쿠폰 목록을 불러오는 데 실패했습니다.');
            const data = await response.json();
            setCoupons(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const createCoupon = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/coupon?discount=${discount}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ discount }),
            });
            if (!response.ok) throw new Error('쿠폰 생성에 실패했습니다.');
            setDiscount(0);
            fetchCoupons();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteCoupon = async (id) => {
        if (window.confirm('이 쿠폰을 삭제하시겠습니까?')) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/coupon?id=${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('쿠폰 삭제에 실패했습니다.');
                fetchCoupons();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Container className="mt-5 p-4 border rounded shadow-sm" style={{ maxWidth: '900px' }}>
            <h2 className="text-center mb-4">ADMIN - COUPON MANAGEMENT</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form className="mb-4">
                <Row className="align-items-center">
                    <Col xs={8}>
                        <Form.Group controlId="discount">
                            <Form.Label style={{fontWeight: 'bold'}}>할인율 (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="할인율을 입력하세요"
                                min={0}
                                max={100}
                                className="shadow-sm"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={4} className="text-end">
                        <Button
                            variant="dark"
                            className="w-100 shadow-sm"
                            onClick={createCoupon}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />{' '}
                                    생성 중...
                                </>
                            ) : (
                                '쿠폰 생성'
                            )}
                        </Button>
                    </Col>
                </Row>
            </Form>

            <h3 className="mb-3">쿠폰 목록</h3>
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
                                    variant="dark"
                                    size="md"
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
        </Container>
    );
};

export default CouponComponent;
