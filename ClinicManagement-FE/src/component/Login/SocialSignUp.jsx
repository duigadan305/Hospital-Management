import React, { useState } from 'react';
import { FaFacebook, FaGithub, FaGoogle } from 'react-icons/fa';

const SocialSignUp = () => {
    const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    const CLIENT_ID = "203554124526-ld8plfc8l575cgt650sc0vfqknpk3mlg.apps.googleusercontent.com"; // Thay bằng Client ID của bạn
    const REDIRECT_URI = "http://localhost:3000"; // URL backend xử lý callback
    const RESPONSE_TYPE = "code";
    const SCOPE = "email profile";
    const [error] = useState({})
    const handleGoogleSignIn = () => {
        const authUrl = `${GOOGLE_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
        window.location.href = authUrl;
    }


    return (
        <div>
            <div className="social-media">
                <div className="social-icon" onClick={handleGoogleSignIn}>
                    <FaGoogle />
                </div>
            </div>
            {error.length && <h6 className="text-danger text-center p-2">{error}</h6>}

        </div>
    );
};

export default SocialSignUp;