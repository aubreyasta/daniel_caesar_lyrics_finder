import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <div className="about-content">
                <h1>About This Project</h1>
                <p>
                    This is a full-stack web application I built to combine my love for
                    Daniel Caesar's music with my passion for web development and data science.
                </p>
                <p>
                    The app uses fuzzy string matching to search through Daniel Caesar's complete
                    discography, making it easy to find that lyric that's stuck in your head.
                </p>

                <h2>Built With</h2>
                <ul>
                    <li>React + Vite (Frontend)</li>
                    <li>FastAPI + Python (Backend)</li>
                    <li>FuzzyWuzzy (Search Algorithm)</li>
                </ul>

                <h2>Connect With Me</h2>
                <div className="social-links">
                    <a href="https://github.com/aubreyasta" className="social-card">
                        <div className="social-icon">💻</div>
                        <div className="social-info">
                            <h3>GitHub</h3>
                            <p>Check out my other projects</p>
                        </div>
                    </a>
                    <a href="https://www.linkedin.com/in/aubreyasta/" className="social-card">
                        <div className="social-icon">💼</div>
                        <div className="social-info">
                            <h3>LinkedIn</h3>
                            <p>Let's connect professionally</p>
                        </div>
                    </a>
                    <a href="https://www.instagram.com/aubreyasta_/" className="social-card">
                        <div className="social-icon">📸</div>
                        <div className="social-info">
                            <h3>Instagram</h3>
                            <p>Follow my journey</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default About;