const BASE_URL = process.env.BASE_URL || 'https://be-roboco-production.up.railway.app/'

export const templateResetPassword = (email: string, resetLink: string) =>
    `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
        }

        .email-header {
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-20px) rotate(360deg); }
        }

        .logo {
            background: rgba(255, 255, 255, 0.2);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 2;
        }

        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .email-title {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
        }

        .email-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 2;
        }

        .email-body {
            padding: 40px 30px;
        }

        .content-section {
            margin-bottom: 30px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
            line-height: 1.7;
        }

        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(135, 206, 235, 0.3);
        }

        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(135, 206, 235, 0.4);
        }

        .security-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #87CEEB;
            margin: 25px 0;
        }

        .security-info h4 {
            color: #4682B4;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .security-info p {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }

        .email-footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .social-link {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: transform 0.3s ease;
        }

        .social-link:hover {
            transform: translateY(-2px);
        }

        .social-link svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .unsubscribe {
            font-size: 12px;
            color: #999;
        }

        .unsubscribe a {
            color: #4682B4;
            text-decoration: none;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #87CEEB 50%, transparent 100%);
            margin: 30px 0;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .email-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10.5V11.5C15.4 11.5 16 12.1 16 12.7V16.3C16 16.9 15.4 17.5 14.8 17.5H9.2C8.6 17.5 8 16.9 8 16.3V12.7C8 12.1 8.6 11.5 9.2 11.5V10.5C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.5 8.7 10.5 10.5V11.5H13.5V10.5C13.5 8.7 12.8 8.2 12 8.2Z"/>
                </svg>
            </div>
            <h1 class="email-title">Reset Password</h1>
            <p class="email-subtitle">Permintaan reset password untuk akun Anda</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <div class="content-section">
                <h2 class="greeting">Halo, ${email}!</h2>
                <p class="message">
                    Kami menerima permintaan untuk mengatur ulang password akun Anda. Jika Anda yang membuat permintaan ini, 
                    silakan klik tombol di bawah untuk melanjutkan proses reset password.
                </p>
                <div style="text-align: center;">
                    <a href="${resetLink}" class="action-button">Reset Password Saya</a>
                </div>
                <div class="security-info">
                    <h4>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#4682B4">
                            <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                        </svg>
                        Informasi Keamanan
                    </h4>
                    <p>
                        • Link ini akan kedaluwarsa dalam 24 jam<br>
                        • Jika Anda tidak meminta reset password, abaikan email ini<br>
                        • Pastikan Anda menggunakan password yang kuat dan unik
                    </p>
                </div>
            </div>

            <div class="divider"></div>

            <p style="font-size: 14px; color: #666; text-align: center;">
                Jika Anda mengalami kesulitan, silakan hubungi tim customer service kami di 
                <a href="mailto:support@perusahaan.com" style="color: #4682B4;">support@perusahaan.com</a>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p class="footer-text">
                <strong>PT. Perusahaan Teknologi Indonesia</strong><br>
                Jl. Sudirman No. 123, Jakarta 12345<br>
                © 2025 Semua Hak Dilindungi
            </p>
            
            <div class="social-links">
                <a href="#" class="social-link" title="Facebook">
                    <svg viewBox="0 0 24 24">
                        <path d="M24 12.073C24 5.405 18.627.073 12 .073S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078V12.073h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073"/>
                    </svg>
                </a>
                <a href="#" class="social-link" title="Twitter">
                    <svg viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </a>
                <a href="#" class="social-link" title="Instagram">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
            </div>
            
            <div class="unsubscribe">
                Tidak ingin menerima email ini? 
                <a href="[UNSUBSCRIBE_LINK]">Berhenti berlangganan</a>
            </div>
        </div>
    </div>
</body>
</html>`

export const templateForgotPassword = (email: string, forgotLink: string) =>
    `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lupa Password</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            position: relative;
        }

        .email-header {
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .email-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
            animation: float 20s linear infinite;
        }

        @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            100% { transform: translateY(-20px) rotate(360deg); }
        }

        .logo {
            background: rgba(255, 255, 255, 0.2);
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 2;
        }

        .logo svg {
            width: 40px;
            height: 40px;
            fill: white;
        }

        .email-title {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 2;
        }

        .email-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
            position: relative;
            z-index: 2;
        }

        .email-body {
            padding: 40px 30px;
        }

        .content-section {
            margin-bottom: 30px;
        }

        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 15px;
        }

        .message {
            font-size: 16px;
            color: #555;
            margin-bottom: 25px;
            line-height: 1.7;
        }

        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(135, 206, 235, 0.3);
        }

        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(135, 206, 235, 0.4);
        }

        .security-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #87CEEB;
            margin: 25px 0;
        }

        .security-info h4 {
            color: #4682B4;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .security-info p {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }

        .email-footer {
            background: #f8f9fa;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer-text {
            font-size: 14px;
            color: #666;
            margin-bottom: 15px;
        }

        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }

        .social-link {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: transform 0.3s ease;
        }

        .social-link:hover {
            transform: translateY(-2px);
        }

        .social-link svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .unsubscribe {
            font-size: 12px;
            color: #999;
        }

        .unsubscribe a {
            color: #4682B4;
            text-decoration: none;
        }

        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #87CEEB 50%, transparent 100%);
            margin: 30px 0;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 10px;
                border-radius: 15px;
            }
            
            .email-header {
                padding: 30px 20px;
            }
            
            .email-body {
                padding: 30px 20px;
            }
            
            .email-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <div class="logo">
                <svg viewBox="0 0 24 24">
                    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                </svg>
            </div>
            <h1 class="email-title">Lupa Password</h1>
            <p class="email-subtitle">Permintaan pemulihan akun Anda</p>
        </div>

        <!-- Body -->
        <div class="email-body">
            <div class="content-section">
                <h2 class="greeting">Halo, ${email}!</h2>
                <p class="message">
                    Kami menerima permintaan untuk pemulihan akun Anda. Tidak masalah, hal ini sering terjadi! 
                    Klik tombol di bawah untuk membuat password baru dan mengakses kembali akun Anda.
                </p>
                <div style="text-align: center;">
                    <a href="${forgotLink}" class="action-button">Pulihkan Akun Saya</a>
                </div>
                <div class="security-info">
                    <h4>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#4682B4">
                            <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z"/>
                        </svg>
                        Tips Keamanan
                    </h4>
                    <p>
                        • Link pemulihan ini berlaku selama 2 jam<br>
                        • Gunakan kombinasi huruf besar, kecil, angka, dan simbol<br>
                        • Jangan gunakan password yang sama dengan akun lain<br>
                        • Aktifkan autentikasi dua faktor untuk keamanan extra
                    </p>
                </div>
            </div>

            <div class="divider"></div>

            <p style="font-size: 14px; color: #666; text-align: center;">
                Jika Anda mengalami kesulitan, silakan hubungi tim customer service kami di 
                <a href="mailto:support@perusahaan.com" style="color: #4682B4;">support@perusahaan.com</a>
            </p>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <p class="footer-text">
                <strong>PT. Perusahaan Teknologi Indonesia</strong><br>
                Jl. Sudirman No. 123, Jakarta 12345<br>
                © 2025 Semua Hak Dilindungi
            </p>
            
            <div class="social-links">
                <a href="#" class="social-link" title="Facebook">
                    <svg viewBox="0 0 24 24">
                        <path d="M24 12.073C24 5.405 18.627.073 12 .073S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078V12.073h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073"/>
                    </svg>
                </a>
                <a href="#" class="social-link" title="Twitter">
                    <svg viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                </a>
                <a href="#" class="social-link" title="Instagram">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
            </div>
            
            <div class="unsubscribe">
                Tidak ingin menerima email ini? 
                <a href="[UNSUBSCRIBE_LINK]">Berhenti berlangganan</a>
            </div>
        </div>
    </div>
</body>
</html>`

export const templateSendQr = async (qrCode: string, name: string, expiredAt: string) =>
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>DN ROBOCO</title>
    <!--[if mso]>
    <style type="text/css">
      table {border-collapse: collapse;}
    </style>
    <![endif]-->
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
      
      body {
        margin: 0 !important;
        padding: 0 !important;
        -webkit-text-size-adjust: 100% !important;
        -ms-text-size-adjust: 100% !important;
        -webkit-font-smoothing: antialiased !important;
      }
      
      img {
        border: 0 !important;
        outline: none !important;
        display: block;
      }
      
      table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      
      td {
        margin: 0;
        padding: 0;
      }
      
      .font-jakarta {
        font-family: 'Plus Jakarta Sans', Arial, sans-serif !important;
      }
      
      /* Responsive styles */
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        .mobile-padding {
          padding-left: 20px !important;
          padding-right: 20px !important;
        }
        
        .title {
          font-size: 24px !important;
          line-height: 32px !important;
        }
        
        .description {
          font-size: 14px !important;
          line-height: 20px !important;
        }
        
        .qr-code {
          width: 180px !important;
          height: 180px !important;
        }
        
        .qr-padding {
          padding: 24px !important;
        }
        
        .contact-table {
          width: 100% !important;
        }
        
        .contact-cell {
          display: block !important;
          width: 100% !important;
          padding: 15px 0 !important;
        }
        
        .plus-icon {
          width: 24px !important;
          height: 24px !important;
        }
        
        .footer-arrow {
          width: 32px !important;
          height: 32px !important;
        }
        
        .footer-text-img {
          width: 90% !important;
          max-width: 280px !important;
        }
      }
      
      @media only screen and (max-width: 480px) {
        .title {
          font-size: 20px !important;
          line-height: 28px !important;
        }
        
        .qr-code {
          width: 160px !important;
          height: 160px !important;
        }
        
        .qr-padding {
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff;">
    <!-- Main Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;">
      <tr>
        <td align="center" style="padding:0;">
          <!-- Content Table -->
          <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; margin:0 auto;">
            
            <!-- Logo Section -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:40px 32px 20px;">
                <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/logo_text.svg" 
                     alt="DN ROBOCO Logo" 
                     style="width:200px; max-width:80%; height:auto; display:block; margin:0 auto;" />
              </td>
            </tr>

            <!-- Plus Icons Top -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:20px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:384px;">
                  <tr>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Title Section -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:20px 32px;">
                <h1 class="title" style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:30px; line-height:38px; margin:0 0 16px 0; color:#000000; font-weight:700;">
                  ${name}
                </h1>
                <p class="description" style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:16px; line-height:24px; color:#333333; margin:0; max-width:480px;">
                  Terima kasih telah menjadi bagian dari DN Roboco 2026. dengan ini kami memberikan akses masuk dengan menggunakan QR Code yang ada di bawah ini.
                </p>
              </td>
            </tr>

            <!-- QR Code Section -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:30px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="center" class="qr-padding" style="background-color:#fbff00; padding:32px; border-radius:10px;">
                      <img src="${BASE_URL}/qr/${qrCode}" 
                           alt="QR Code" 
                           class="qr-code"
                           style="width:200px; height:200px; display:block; margin:0 auto;" />
                    </td>
                  </tr>
                </table>
                <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:12px; font-style:italic; color:#555555; margin:12px 0 0 0;">
                  Berlaku hingga ${expiredAt}
                </p>
              </td>
            </tr>

            <!-- Plus Icons Bottom -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:20px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:384px;">
                  <tr>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                    <td align="center" width="33.33%" style="padding:0 8px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/plus.svg" 
                           alt="Plus" 
                           class="plus-icon"
                           style="width:30px; height:30px; display:block; margin:0 auto;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Contact Section -->
            <tr>
              <td align="center" class="mobile-padding" style="padding:30px 32px;">
                <h2 style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:18px; font-weight:bold; font-style:italic; margin:0 0 24px 0; color:#000000;">
                  Contact Person
                </h2>
                <table role="presentation" class="contact-table" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:500px;">
                  <tr>
                    <td class="contact-cell" align="center" style="padding:10px 20px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/logo.svg" 
                           alt="Logo" 
                           style="width:60px; height:60px; display:block; margin:0 auto 12px;" />
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-weight:bold; font-size:14px; margin:0 0 6px 0; color:#000000;">
                        mahendra alif
                      </p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:12px; margin:2px 0; color:#333333;">
                        +6288236457475
                      </p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:12px; margin:2px 0; color:#333333;">
                        https://wa.me/6288236457475
                      </p>
                    </td>
                    <td class="contact-cell" align="center" style="padding:10px 20px;">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/logo.svg" 
                           alt="Logo" 
                           style="width:60px; height:60px; display:block; margin:0 auto 12px;" />
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-weight:bold; font-size:14px; margin:0 0 6px 0; color:#000000;">
                        alif mahendra
                      </p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:12px; margin:2px 0; color:#333333;">
                        +6288236457475
                      </p>
                      <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:12px; margin:2px 0; color:#333333;">
                        https://wa.me/6288236457475
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer Section -->
            <tr>
              <td align="center" style="background-color:#f6f6f6; padding:30px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
                  <tr>
                    <td align="center" style="padding:0 0 16px 0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:0 8px;">
                            <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/arrow-right.svg" 
                                 alt="Arrow" 
                                 class="footer-arrow"
                                 style="width:40px; height:40px; display:block; transform:rotate(180deg);" />
                          </td>
                          <td style="padding:0 8px;">
                            <p style="font-family:'Plus Jakarta Sans',Arial,sans-serif; font-size:18px; font-weight:600; margin:0; color:#000000; white-space:nowrap;">
                              DN ROBOCO.
                            </p>
                          </td>
                          <td style="padding:0 8px;">
                            <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/arrow-right.svg" 
                                 alt="Arrow" 
                                 class="footer-arrow"
                                 style="width:40px; height:40px; display:block;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center">
                      <img src="https://hyivuspmgvtunjrmykdp.supabase.co/storage/v1/object/public/email/footer_text.svg" 
                           alt="Footer Text" 
                           class="footer-text-img"
                           style="width:100%; max-width:300px; height:auto; display:block; margin:0 auto;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
