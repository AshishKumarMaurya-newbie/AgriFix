// 1. IMPORT FIREBASE DIRECTLY HERE
import { firebaseConfig } from '../config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. LANGUAGE SWITCHER LOGIC
    // =========================================
    const langBtn = document.getElementById('lang-switch');
    let currentLang = 'en'; 

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'hi' : 'en';
        
        if (currentLang === 'en') {
            langBtn.innerHTML = '<span id="current-lang">हिंदी</span> / EN';
        } else {
            langBtn.innerHTML = '<span id="current-lang">EN</span> / हिंदी';
        }

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (window.translations && window.translations[currentLang] && window.translations[currentLang][key]) {
                element.innerHTML = window.translations[currentLang][key];
            } else if (typeof translations !== 'undefined' && translations[currentLang][key]) {
                // Fallback for global scope
                element.innerHTML = translations[currentLang][key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (typeof translations !== 'undefined' && translations[currentLang][key]) {
                element.placeholder = translations[currentLang][key];
            }
        });
    });

    // =========================================
    // 2. VIDEO ACCORDION LOGIC
    // =========================================
    const stepCards = document.querySelectorAll('.step-card');

    stepCards.forEach(card => {
        card.addEventListener('click', () => {
            removeActiveClasses();
            card.classList.add('active');
        });
        card.addEventListener('mouseenter', () => {
            removeActiveClasses();
            card.classList.add('active');
        });
    });

    function removeActiveClasses() {
        stepCards.forEach(card => {
            card.classList.remove('active');
        });
    }

    // =========================================
    // 3. MOBILE MENU TOGGLE
    // =========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'rgba(253, 251, 247, 0.95)';
            navLinks.style.width = '100%';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid #ddd';
        }
    });

    // =========================================
    // 4. FIREBASE CONTACT FORM SUBMIT (FIXED)
    // =========================================
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const submitBtn = contactForm.querySelector('.send-btn');
        const originalBtnText = submitBtn.innerText;

        const comment = contactForm.querySelector('textarea').value;
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;

        submitBtn.disabled = true;
        submitBtn.innerText = currentLang === 'en' ? "Sending..." : "भेज रहा है...";

        try {
            // UPDATED: Using 'addDoc', 'collection', and 'db' directly.
            // No more 'window.' prefixes needed.
            await addDoc(collection(db, "contacts"), {
                name: name,
                email: email,
                message: comment,
                timestamp: new Date()
            });

            const msg = (typeof translations !== 'undefined') ? translations[currentLang]['alert_sent'] : "Message Sent!";
            alert(msg);
            contactForm.reset(); 

        } catch (error) {
            console.error("FIREBASE ERROR:", error);
            alert("Failed: " + error.message); 
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = originalBtnText;
        }
    });

});