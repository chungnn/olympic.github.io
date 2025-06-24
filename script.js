// Dữ liệu các thử thách
const challenges = [
    {
        pattern: ['circle', 'square', 'circle', 'square'],
        correct: 'circle',
        script: 'Con nhìn này, một hình tròn rồi đến một hình vuông. Cứ lặp đi lặp lại như vậy. Theo con, hình tiếp theo là gì nhỉ?'
    },
    {
        pattern: ['square', 'square', 'circle', 'square', 'square'],
        correct: 'circle',
        script: 'Con xem, có hai hình vuông rồi một hình tròn, rồi lại hai hình vuông. Vậy hình tiếp theo sẽ là gì?'
    },
    {
        pattern: ['circle', 'triangle', 'circle', 'triangle'],
        correct: 'circle',
        script: 'Bé nhìn thấy không, hình tròn và hình tam giác cứ xen kẽ nhau. Hình tiếp theo sẽ là gì nhỉ?'
    },
    {
        pattern: ['triangle', 'circle', 'square', 'triangle', 'circle'],
        correct: 'square',
        script: 'Có ba hình khác nhau: tam giác, tròn, vuông, rồi lại tam giác, tròn. Theo con thì hình tiếp theo là gì?'
    },
    {
        pattern: ['square', 'circle', 'circle', 'square', 'circle'],
        correct: 'circle',
        script: 'Con thấy quy luật gì trong dãy hình này không? Một hình vuông, hai hình tròn, rồi một hình vuông, một hình tròn...'
    }
];

let currentChallenge = 0;
let selectedAnswer = null;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    displayCurrentDate();
    generateChallenge();
});

// Hiển thị ngày hiện tại
function displayCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('current-date').textContent = now.toLocaleDateString('vi-VN', options);
}

// Tạo thử thách mới
function generateNewChallenge() {
    currentChallenge = (currentChallenge + 1) % challenges.length;
    generateChallenge();
    clearResult();
}

// Hiển thị thử thách
function generateChallenge() {
    const challenge = challenges[currentChallenge];
    
    // Hiển thị dãy hình
    displayPattern(challenge.pattern);
    
    // Tạo các lựa chọn
    createAnswerOptions(challenge.correct);
    
    // Cập nhật kịch bản cho bố mẹ
    updateParentScript(challenge.script);
    
    selectedAnswer = null;
}

// Hiển thị dãy hình
function displayPattern(pattern) {
    const container = document.getElementById('shape-sequence');
    container.innerHTML = '';
    
    pattern.forEach((shapeType, index) => {
        const shape = createShape(shapeType);
        shape.style.animationDelay = `${index * 0.2}s`;
        shape.classList.add('animate-in');
        container.appendChild(shape);
    });
}

// Tạo hình dạng
function createShape(type) {
    const shape = document.createElement('div');
    shape.className = `shape ${type}`;
    
    if (type === 'triangle') {
        // Tạo tam giác đặc biệt
        shape.innerHTML = '';
    }
    
    return shape;
}

// Tạo các lựa chọn đáp án
function createAnswerOptions(correctAnswer) {
    const container = document.getElementById('answer-options');
    container.innerHTML = '';
    
    // Tạo danh sách các hình có thể có
    const allShapes = ['circle', 'square', 'triangle'];
    
    // Trộn để tạo thứ tự ngẫu nhiên
    const shuffledShapes = shuffleArray([...allShapes]);
    
    shuffledShapes.forEach(shapeType => {
        const option = document.createElement('div');
        option.className = 'option';
        option.onclick = () => selectAnswer(option, shapeType, correctAnswer);
        
        const shape = createShape(shapeType);
        shape.style.width = '50px';
        shape.style.height = '50px';
        if (shapeType === 'triangle') {
            shape.style.borderLeftWidth = '25px';
            shape.style.borderRightWidth = '25px';
            shape.style.borderBottomWidth = '43px';
        }
        
        option.appendChild(shape);
        container.appendChild(option);
    });
}

// Trộn mảng
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Xử lý khi chọn đáp án
function selectAnswer(optionElement, selectedShape, correctAnswer) {
    // Xóa selection cũ
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Đánh dấu lựa chọn hiện tại
    optionElement.classList.add('selected');
    selectedAnswer = selectedShape;
    
    // Kiểm tra đáp án sau một chút delay
    setTimeout(() => {
        checkAnswer(optionElement, selectedShape, correctAnswer);
    }, 500);
}

// Kiểm tra đáp án
function checkAnswer(optionElement, selectedShape, correctAnswer) {
    const resultDiv = document.getElementById('result');
    
    if (selectedShape === correctAnswer) {
        optionElement.classList.remove('selected');
        optionElement.classList.add('correct');
        resultDiv.textContent = '🎉 Tuyệt vời! Bé đã tìm ra đáp án đúng!';
        resultDiv.className = 'result success';
        
        // Hiệu ứng pháo hoa
        createConfetti();
    } else {
        optionElement.classList.remove('selected');
        optionElement.classList.add('wrong');
        
        // Hiển thị đáp án đúng
        document.querySelectorAll('.option').forEach(opt => {
            const shape = opt.querySelector('.shape');
            if (shape && shape.classList.contains(correctAnswer)) {
                opt.classList.add('correct');
            }
        });
        
        resultDiv.textContent = '🤔 Chưa đúng rồi. Hãy thử quan sát kỹ hơn nhé!';
        resultDiv.className = 'result error';
    }
}

// Xóa kết quả
function clearResult() {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';
    resultDiv.className = 'result';
    
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
}

// Cập nhật kịch bản cho bố mẹ
function updateParentScript(script) {
    document.getElementById('parent-script').textContent = script;
}

// Tạo hiệu ứng pháo hoa khi đúng
function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// CSS cho hiệu ứng rơi
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes animate-in {
        0% {
            transform: scale(0) rotate(180deg);
            opacity: 0;
        }
        100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: animate-in 0.5s ease forwards;
    }
`;
document.head.appendChild(style);
