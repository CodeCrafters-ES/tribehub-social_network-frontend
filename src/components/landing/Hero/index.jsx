import React from 'react';
import { useScrollAnimation } from '../../../hooks/useScrollAnimation';
import LoginForm from '../../landing/LoginForm';
import '../../../styles/index.css';

const Hero = () => {

    const [ref, isVisible] = useScrollAnimation();

    return (
        <section
            id="hero"
            className="hero"
        >
            <div className='container'>
                <div className="hero-content">
                    <div className={`hero-text ${isVisible ? 'animate-in' : ''}`}>
                        <h1>TribeHub</h1>
                        <h2>Conecta con el mundo de una nueva manera</h2>
                        <h3>Descubre una red social que redefine las conexiones humanas. Comparte, conecta y crea comunidades auténticas en un espacio diseñado para ti.</h3>
                    </div>

                    <LoginForm />
                </div>
            </div>

        </section>
    )
}

export default Hero;
