let lessonData;
let currentSection = 0;
let textPosition = 0;
let speed = 50;
let typingInterval;

document.getElementById('fileInput').addEventListener('change', loadFile);

function loadFile(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            lessonData = JSON.parse(e.target.result);
            startLesson();
        };
        reader.readAsText(file);
    } else {
        alert('Per favore, carica un file JSON valido.');
    }
}

function startLesson() {
    document.getElementById('fileInput').style.display = 'none';
    displaySection();
}

function displaySection() {
    const section = lessonData.sections[currentSection];
    if (section) {
        textPosition = 0;
        document.getElementById('textDisplay').innerHTML = '';
        typingInterval = setInterval(() => typeWriter(section.content), speed);
    } else {
        showQuiz();
    }
}

function typeWriter(text) {
    if (textPosition < text.length) {
        document.getElementById('textDisplay').innerHTML += text.charAt(textPosition);
        textPosition++;
    } else {
        clearInterval(typingInterval);
        document.getElementById('nextButton').style.display = 'inline-block';
        document.getElementById('nextButton').onclick = () => {
            document.getElementById('nextButton').style.display = 'none';
            currentSection++;
            displaySection();
        };
    }
}

function showQuiz() {
    document.getElementById('textDisplay').style.display = 'none';
    const quizSection = document.getElementById('quizSection');
    quizSection.style.display = 'block';

    const quizDiv = document.getElementById('quiz');
    lessonData.quiz.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `<p>${q.question}</p>`;
        q.options.forEach((option, i) => {
            const optionLabel = document.createElement('label');
            optionLabel.innerHTML = `
                <input type="radio" name="question${index}" value="${option}">
                ${option}
            `;
            questionDiv.appendChild(optionLabel);
            questionDiv.appendChild(document.createElement('br'));
        });
        quizDiv.appendChild(questionDiv);
    });

    document.getElementById('submitQuiz').onclick = gradeQuiz;
}

function gradeQuiz() {
    let score = 0;
    lessonData.quiz.forEach((q, index) => {
        const options = document.getElementsByName(`question${index}`);
        options.forEach(option => {
            if (option.checked && option.value === q.answer) {
                score++;
            }
        });
    });
    alert(`Hai risposto correttamente a ${score} domande su ${lessonData.quiz.length}.`);
}
