import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthForm from '../components/auth/AuthForm';
import '../App.css';
import registerBg from '../assets/register-bg.jpg';

const auth = () => {
  return (
    <>
      <Navbar />
      <div
        className="min-vh-100 w-100 position-relative overflow-hidden"
        style={{ background: `url(${registerBg}) center center/cover no-repeat` }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ background: 'var(--glass-bg)', zIndex: 1 }}
        />
        <div
          className="container position-relative py-5 mt-5"
          style={{ zIndex: 2 }}
        >
          <div className="row align-items-center g-4 mt-5">
            <div className="col-lg-6 col-12 text-center text-lg-start">
              <h1 className="mb-0" style={{ fontSize: 'calc(2.5rem + 1vw)', fontFamily: 'Bebas Neue, Impact, sans-serif', fontWeight: 'bold', letterSpacing: 2, color: '#ffffff' }}>
                WATCH MOVIES<br /><span className="text-danger">CINAVERSE</span>
              </h1>
              <p className="text-white opacity-75 mt-3 d-none d-lg-block" style={{ maxWidth: '400px' }}>
                Dive into a world of endless entertainment. Join Cinaverse today and experience cinema like never before.
              </p>
            </div>
            <div className="col-lg-6 col-12 d-flex justify-content-center justify-content-lg-end">
              <div className="w-100" style={{ maxWidth: '480px' }}>
                <AuthForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default auth;
