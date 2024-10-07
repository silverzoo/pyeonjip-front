import React, { useEffect, useState } from 'react';

function Cart() {
    const [data, setData] = useState('');

    useEffect(() => {
        // Fetching the data from Spring Boot API
        fetch('http://localhost:8080/cart')  // Adjust the URL if needed
            .then(response => response.text())  // Since you're returning a plain string
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h1>{data}</h1>
        </div>
    );
}

export default Cart;