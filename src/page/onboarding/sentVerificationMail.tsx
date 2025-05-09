import React from 'react'
import { useLocation } from 'react-router-dom';

function SentVerificationMail() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const email: string | null = searchParams.get('email');
  return (
    <div className='page-container'>
    <div className="container-404">
    <h1>Password Reset</h1>
    <p>An Email has been sent to <strong>{email}</strong> with instruction for resetting your password <br/> and click the reset link Provided.</p>
    <br/>
    <p><strong>NOTE: Reset link will become invalid in 30 minutes.</strong></p>
</div>
<style>
        {`
         .page-container {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
    }
    .container-404 {
        text-align: center;
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .container-404 h1 {
        color: black;
    }
    .container-404 p {
        color: #5a5a5a;
    }
    .container-404 a {
        color: #0275d8;
        text-decoration: none;
    }
        `}
    </style>
</div>
  )
}

export default SentVerificationMail