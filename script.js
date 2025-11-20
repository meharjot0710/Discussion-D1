let questions = []; // In-memory storage
let selectedQuestionId = null;

const questionForm = document.getElementById('question-form');
const questionList = document.getElementById('question-list');
const rightPane = document.getElementById('right-pane');

// Handle question form submission
questionForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('question-title').value.trim();
    const content = document.getElementById('question-content').value.trim();
    if (title && content) {
        const question = {
            id: Date.now(),
            title: title,
            content: content,
            responses: [],
            resolved: false
        };
        questions.push(question);
        renderQuestions();
        questionForm.reset();
    }
});

// Render question list in left pane
function renderQuestions() {
    questionList.innerHTML = '';
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = `question-item ${question.resolved ? 'resolved' : ''}`;
        questionDiv.innerHTML = `<strong>${question.title}</strong>`;
        questionDiv.addEventListener('click', () => showQuestionDetails(question.id));
        questionList.appendChild(questionDiv);
    });
}

// Show question details, response form, and responses
function showQuestionDetails(id) {
    selectedQuestionId = id;
    const question = questions.find(q => q.id === id);
    if (!question) return;

    rightPane.innerHTML = `
        <h2>Question</h2>
        <div class="question-details">
            <strong>${question.title}</strong>
            <p>${question.content}</p>
            ${question.resolved ? '<p><em>Resolved</em></p>' : '<button class="resolve-btn" onclick="resolveQuestion(' + id + ')">Resolve</button>'}
        </div>
        <h3>Post a Response</h3>
        <form id="response-form" class="response-form">
            <input type="text" id="response-name" placeholder="Your Name" required>
            <textarea id="response-comment" placeholder="Your Comment" required></textarea>
            <button type="submit">Submit Response</button>
        </form>
        <h3>Responses</h3>
        <div id="response-list"></div>
    `;

    // Render responses
    const responseList = document.getElementById('response-list');
    question.responses.forEach(response => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response-item';
        responseDiv.innerHTML = `<strong>${response.name}</strong>: ${response.comment}`;
        responseList.appendChild(responseDiv);
    });

    // Handle response form submission
    const responseForm = document.getElementById('response-form');
    responseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('response-name').value.trim();
        const comment = document.getElementById('response-comment').value.trim();
        if (name && comment) {
            question.responses.push({ name, comment });
            renderQuestions(); // Update resolved status
            showQuestionDetails(id); // Refresh right pane
            responseForm.reset();
        }
    });
}

// Resolve a question
function resolveQuestion(id) {
    const question = questions.find(q => q.id === id);
    if (question) {
        question.resolved = true;
        renderQuestions();
        showQuestionDetails(id);
    }
}

// Initial render
renderQuestions();