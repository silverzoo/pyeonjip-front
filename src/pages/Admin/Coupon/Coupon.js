import React, { useState, useEffect } from 'react';
import { Button, Form, Table } from 'react-bootstrap';

const CouponComponent = () => {
    const [discount, setDiscount] = useState(0);
    const [coupons, setCoupons] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 추가

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        // Fetch coupons logic here
        try {
            const response = await fetch('http://localhost:8080/coupons'); // Fetch coupons from the backend
            if (!response.ok) {
                throw new Error('쿠폰 목록을 불러오는 데 실패했습니다.');
            }
            const data = await response.json();
            setCoupons(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // 쿠폰 생성
    const createCoupon = async () => {
        setLoading(true); // 로딩 시작
        try {
            const response = await fetch('http://localhost:8080/coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ discount }),
            });

            if (!response.ok) {
                throw new Error('쿠폰 생성에 실패했습니다.');
            }

            const coupon = await response.json();
            console.log(coupon);
            setDiscount(0); // 입력값 초기화
            fetchCoupons(); // 쿠폰 목록 갱신
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="container col-xl-12" style={{ width: '900px' }}>
            <h2>쿠폰 생성 및 조회</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <Form>
                <Form.Group controlId="discount">
                    <Form.Label column={discount}>할인율 (%)</Form.Label>
                    <Form.Control
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="할인율을 입력하세요"
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={createCoupon}
                    disabled={loading} // 로딩 중일 때 비활성화
                >
                    {loading ? '생성 중...' : '쿠폰 생성'}
                </Button>
            </Form>
            <h3 className="mt-4">쿠폰 목록</h3>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>쿠폰 코드</th>
                    <th>할인율</th>
                    <th>상태</th>
                    <th>만료 날짜</th>
                </tr>
                </thead>
                <tbody>
                {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                        <td>{coupon.id}</td>
                        <td>{coupon.code}</td>
                        <td>{coupon.discount / 100}%</td>
                        <td>{coupon.active ? '활성' : '비활성'}</td>
                        <td>{new Date(coupon.expiryDate).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default CouponComponent;
