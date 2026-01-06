//FRONT-END JAVASCRIPT FILE
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

    });
}
