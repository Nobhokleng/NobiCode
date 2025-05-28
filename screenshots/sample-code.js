// Sample code for consistent screenshots
// Use this code snippet when demonstrating the code review functionality

function calculateUserScore(user, activities) {
    let score = 0;
    
    if (!user || !activities) {
        return score;
    }
    
    for (let i = 0; i < activities.length; i++) {
        const activity = activities[i];
        
        if (activity.type === 'login') {
            score += 10;
        } else if (activity.type === 'purchase') {
            score += activity.amount * 0.1;
        } else if (activity.type === 'review') {
            score += 25;
        }
        
        // Bonus for recent activities
        const daysSince = (Date.now() - activity.timestamp) / (1000 * 60 * 60 * 24);
        if (daysSince < 7) {
            score *= 1.2;
        }
    }
    
    return Math.round(score);
}

// Usage example
const user = { id: 123, name: 'John Doe' };
const userActivities = [
    { type: 'login', timestamp: Date.now() - 86400000 },
    { type: 'purchase', amount: 50, timestamp: Date.now() - 172800000 },
    { type: 'review', timestamp: Date.now() - 259200000 }
];

const finalScore = calculateUserScore(user, userActivities);
