import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', background: '#f7f7f7', textAlign: 'center', paddingTop: '100px', height: '100vh' }}>
            <div style={{ display: 'inline-block', padding: '30px 50px', background: 'white', borderRadius: '10px', border: '1px solid #ccc' }}>
                <div style={{ fontSize: '80px', color: '#d9534f', marginBottom: '-10px' }}>403</div>
                <div style={{ fontSize: '22px', marginBottom: '20px' }}>Bạn không có quyền truy cập trang này</div>
                <Link to="/" style={{ textDecoration: 'none', color: '#337ab7', fontSize: '18px' }}>
                    ⬅ Quay về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default AccessDenied;