import { Button, Result } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
    {/* <div className="container-404">
    <h1>403 - Not Authorized</h1>
    <p>Sorry, you do not have the necessary permissions to access this page.</p>
    <p><a href="/">Go back to the login page</a></p> */}
{/* </div> */}
<Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={<Link to="/"><Button type="primary">Back to the login Page</Button></Link>}
  />
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
        color: #d9534f;
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

export default NotFound