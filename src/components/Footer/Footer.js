// components/Footer/Footer.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className=" bg-light text-dark p-4">
            <div className="container">
                <div className="row">
                    {/* 회사 정보 */}
                    <div className="col-md-6">
                        <h6>PyeonJip.com</h6>
                        <p className="small">
                            <br /> 1234 Address St. City Seoul 성수 Elice State 56789
                            <br /> Email: support@Pyeonjip.com
                            <br /> 사업자등록 번호 : 1357-90-2468
                            <br /> 사업자 : David.Kim.덕배 010-9876-5432
                            <br /> 대표자 : Elijah.Park.점자 010-1234-5678
                        </p>
                    </div>

                    {/* 정책 링크 - 우측 정렬 */}
                    <div className="col-md-6 d-flex justify-content-end align-items-center gap-3">
                        <a href="/privacy-policy" className="text-decoration-none small text-dark fw-bold">
                            개인정보처리방침
                        </a>
                        <a href="/cookie-policy" className="text-decoration-none small text-dark fw-bold">
                            쿠키 정책
                        </a>
                        <a href="/cookie-settings" className="text-decoration-none small text-dark fw-bold">
                            쿠키 설정
                        </a>
                        <a href="/terms-of-service" className="text-decoration-none small text-dark fw-bold">
                            웹사이트 이용약관
                        </a>
                    </div>
                </div>

                {/* 하단 카피라이트 */}
                <div className="d-flex justify-content-between align-items-center ">
                    <p className="mb-0 small">
                        &copy; {currentYear} Elice Cloud Track 4기 2차 프로젝트 5팀
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="btn btn-link text-dark text-decoration-none small"
                    >
                        Back to Top
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
