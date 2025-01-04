document.addEventListener('DOMContentLoaded', () => {
    const activityForm = document.getElementById('activity-form');
    const activityInput = document.getElementById('activity-input');
    const activitiesList = document.getElementById('activities');
    const totalActivities = document.getElementById('total-activities');
    const completedActivities = document.getElementById('completed-activities');
    const completionRate = document.getElementById('completion-rate');

    let activities = JSON.parse(localStorage.getItem('activities')) || [];

    function saveActivities() {
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    function renderActivities() {
        activitiesList.innerHTML = '';
        activities.forEach((activity, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" id="activity-${index}" ${activity.completed ? 'checked' : ''}>
                <label for="activity-${index}">${activity.name} - ${activity.date}</label>
            `;
            li.querySelector('input').addEventListener('change', () => toggleActivity(index));
            activitiesList.appendChild(li);
        });
        updateWeeklyReport();
    }

    function addActivity(name) {
        const activity = {
            name,
            date: new Date().toISOString().split('T')[0],
            completed: false
        };
        activities.push(activity);
        saveActivities();
        renderActivities();
    }

    function toggleActivity(index) {
        activities[index].completed = !activities[index].completed;
        saveActivities();
        renderActivities();
    }

    function updateWeeklyReport() {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyActivities = activities.filter(
            activity => new Date(activity.date) >= oneWeekAgo
        );

        const total = weeklyActivities.length;
        const completed = weeklyActivities.filter(activity => activity.completed).length;
        const rate = total > 0 ? (completed / total * 100).toFixed(2) : 0;

        totalActivities.textContent = total;
        completedActivities.textContent = completed;
        completionRate.textContent = rate;
    }

    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const activityName = activityInput.value.trim();
        if (activityName) {
            addActivity(activityName);
            activityInput.value = '';
        }
    });

    renderActivities();
});

