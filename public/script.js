// script.js


// ** FORM DATA / CONNECTION TO BACKEND**
const form = document.getElementById('createBot');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        //personalizeion of bot config from form data
        const jobTitle = document.getElementById('jobTitle').value;
        const seniorityLevel = document.getElementById('seniorityLevel').value;
        const organization = document.getElementById('organization').value;
        const skills = document.getElementById('skills').value;
        const topicsWeightage = document.getElementById('topicsWeightage').value;
        const evaluationCriteria = document.getElementById('evaluationCriteria').value;
        const botConfig = {
            jobTitle,
            seniorityLevel,
            topicsWeightage,
            evaluationCriteria,
            organization,
            skills
        };
        //send bot config to server
        const response = await fetch('/create-bot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(botConfig)
        });

        const result = await response.json();

        if (result.interviewCode) {
            alert(`Bot created successfully!\n\nInterview Code: ${result.interviewCode}\n\nShare this code with candidates to start their interview.`);
            // Clear the form after success
            form.reset();
        } else {
            alert('Error creating bot. Please try again.');
        }

    });
}

const createInterviewBtn = document.getElementById('createInterviewBtn');
const takeInterviewBtn = document.getElementById('takeInterviewBtn');

if (takeInterviewBtn) {
    takeInterviewBtn.addEventListener('click', () => {
        window.location.href = 'interview.html';
    });
}
if (createInterviewBtn) {
    createInterviewBtn.addEventListener('click', () => {
        window.location.href = 'createbot.html';
    });
}




// ** FRONTEND JAVASCRIPT **

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            animateCounters();
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
observer.observe(statsSection);

function animateCounters() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach((element) => {
        const target = parseInt(element.dataset.target);
        let current = 0;
        const increment = target / 50;  // animate over ~50 steps

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);  // 30ms per step = ~1.5 second animation
    });
}
// Animate .not-button elements on scroll
const buttonObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.not-button').forEach((button) => {
    buttonObserver.observe(button);
});


