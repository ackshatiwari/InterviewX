// script.js

if (document.getElementById('syncGoogleJobs')) {
    document.getElementById('syncGoogleJobs').addEventListener('click', async () => {
        document.getElementById('googleJobsForm').style.display = 'block';
    });
}


if (document.getElementById('googleJobsForm')) {
    document.getElementById('googleJobsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = document.getElementById('googleJobsQuery').value;
        document.getElementById('loader-line-1').style.display = 'block';
        const response = await fetch('/googleJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        const result = await response.json();
        const raw = result.jobs || [];
        const jobs = raw.map(j => ({
            title: j.title || j.job_title || '',
            company: j.company || j.company_name || '',
            description: (j.description || j.description_html || j.snippet || '').trim()
        }));

        const jobsList = document.getElementById('googleJobsList');
        jobsList.innerHTML = '';
        document.getElementById('loader-line-1').style.display = 'none';

        if (jobs.length === 0) {
            jobsList.innerHTML = '<div class="muted">No jobs found.</div>';
            return;
        }

        alert('Click on the job that you are posting for to pre-fill the interview bot configuration form with relevant questions and evaluation criteria.');

        const ul = document.createElement('ul');
        ul.className = 'google-jobs-ul';

        jobs.forEach((job, idx) => {
            const li = document.createElement('li');
            li.className = 'job-card';
            li.tabIndex = 0;
            li.dataset.index = idx;
            li.dataset.title = job.title;
            li.dataset.company = job.company;
            li.dataset.description = job.description;

            const titleEl = document.createElement('div');
            titleEl.className = 'job-title';
            titleEl.textContent = job.title || 'Untitled';

            const companyEl = document.createElement('div');
            companyEl.className = 'job-company';
            companyEl.textContent = job.company || '';

            const descEl = document.createElement('div');
            descEl.className = 'job-desc';
            descEl.textContent = job.description || '';

            li.appendChild(titleEl);
            li.appendChild(companyEl);
            li.appendChild(descEl);

            li.addEventListener('click', async () => {
                // mark selected
                document.querySelectorAll('.job-card.selected').forEach(el => el.classList.remove('selected'));
                li.classList.add('selected');


                document.getElementById('loader-line-1').style.display = 'block';

                const response = await fetch('/analyzeJobDescription', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ description: job.description })
                });
                const analysisResult = await response.json();

                const payload = analysisResult.analysis || {};
                const analysisObj = Array.isArray(payload) ? payload[0] : payload || {};

                const hardSoftSkills = analysisObj['Hard/Soft skills required'];
                const topicsWeightage = analysisObj['Topics & Weightage'];
                const evaluationCriteria = analysisObj['Evaluation Criteria'];
                const seniorityLevel = analysisObj['Seniority Level'];

                const hardSoftField = document.getElementById('skills');
                const topicsField = document.getElementById('topicsWeightage');
                const evalCriteriaField = document.getElementById('evaluationCriteria');
                const titleField = document.getElementById('jobTitle');
                const orgField = document.getElementById('organization');
                const seniorityField = document.getElementById('seniorityLevel');

                console.log('Hard/Soft Skills:', hardSoftSkills);
                console.log('Topics & Weightage:', topicsWeightage);
                console.log('Evaluation Criteria:', evaluationCriteria);

                if (hardSoftField) hardSoftField.value = hardSoftSkills || '';
                if (topicsField) topicsField.value = topicsWeightage || '';
                if (evalCriteriaField) evalCriteriaField.value = evaluationCriteria || '';
                if (titleField) titleField.value = job.title || '';
                if (orgField) orgField.value = job.company || '';
                if (seniorityField) seniorityField.value = seniorityLevel || '';

                document.getElementById('loader-line-1').style.display = 'none';
            });

            li.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') li.click();
            });

            ul.appendChild(li);
        });

        jobsList.appendChild(ul);

    });
}


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


