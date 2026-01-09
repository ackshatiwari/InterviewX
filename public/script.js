// script.js
const form = document.getElementById('createBot');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const jobTitle = document.getElementById('jobTitle').value;
        const seniorityLevel = document.getElementById('seniorityLevel').value;
        const roleType = document.getElementById('roleType').value;
        const interviewGoal = document.getElementById('interviewGoal').value;
        const topicsWeightage = document.getElementById('topicsWeightage').value;
        const evaluationCriteria = document.getElementById('evaluationCriteria').value;
        const botConfig = {
            jobTitle,
            seniorityLevel,
            roleType,
            interviewGoal,
            topicsWeightage,
            evaluationCriteria
        };
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
