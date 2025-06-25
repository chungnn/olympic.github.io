// Dữ liệu tử vi sẽ được tải từ file JSON
let horoscopeData = null;

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    displayCurrentDate();
    loadHoroscopeData();
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

// Tải dữ liệu tử vi từ file JSON
async function loadHoroscopeData() {
    try {
        const response = await fetch('horoscope-data.json');
        horoscopeData = await response.json();
        displayZodiacGrid();
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu tử vi:', error);
        // Fallback: hiển thị thông báo lỗi
        document.querySelector('.zodiac-selection').innerHTML = 
            '<h2>❌ Không thể tải dữ liệu tử vi</h2><p>Vui lòng thử lại sau.</p>';
    }
}

// Hiển thị lưới 12 cung hoàng đạo
function displayZodiacGrid() {
    const zodiacGrid = document.getElementById('zodiac-grid');
    zodiacGrid.innerHTML = '';

    // Danh sách các cung hoàng đạo theo thứ tự
    const zodiacOrder = [
        'bach_duong', 'kim_nguu', 'song_tu', 'cu_giai',
        'su_tu', 'xu_nu', 'thien_binh', 'ho_cap',
        'nhan_ma', 'ma_ket', 'bao_binh', 'song_ngu'
    ];

    zodiacOrder.forEach(zodiacKey => {
        const zodiac = horoscopeData.zodiac_signs[zodiacKey];
        if (zodiac) {
            const card = createZodiacCard(zodiacKey, zodiac);
            zodiacGrid.appendChild(card);
        }
    });
}

// Tạo card cho từng cung hoàng đạo
function createZodiacCard(key, zodiac) {
    const card = document.createElement('div');
    card.className = 'zodiac-card';
    card.onclick = () => showHoroscope(key);
    
    card.innerHTML = `
        <span class="symbol">${zodiac.symbol}</span>
        <div class="name">${zodiac.name}</div>
        <div class="dates">${zodiac.dates}</div>
    `;
    
    return card;
}

// Hiển thị tử vi cho cung hoàng đạo được chọn
function showHoroscope(zodiacKey) {
    const zodiac = horoscopeData.zodiac_signs[zodiacKey];
    if (!zodiac) return;

    // Ẩn phần chọn cung hoàng đạo
    document.querySelector('.zodiac-selection').style.display = 'none';
    
    // Hiển thị phần tử vi
    const horoscopeDisplay = document.getElementById('horoscope-display');
    horoscopeDisplay.style.display = 'block';

    // Cập nhật thông tin cung hoàng đạo
    document.getElementById('zodiac-name').textContent = zodiac.name;
    document.getElementById('zodiac-symbol').textContent = zodiac.symbol;
    document.getElementById('zodiac-dates').textContent = zodiac.dates;
    document.getElementById('zodiac-element').textContent = zodiac.element;
    document.getElementById('zodiac-planet').textContent = zodiac.planet;
    document.getElementById('zodiac-lucky-numbers').textContent = zodiac.lucky_numbers.join(', ');
    document.getElementById('zodiac-lucky-colors').textContent = zodiac.lucky_colors.join(', ');
    document.getElementById('zodiac-personality').textContent = zodiac.personality;

    // Lấy dự đoán cho ngày hiện tại (hoặc ngày mặc định)
    const todayPrediction = zodiac.daily_predictions[0]; // Lấy dự đoán đầu tiên
    
    document.getElementById('love-prediction').textContent = todayPrediction.love;
    document.getElementById('career-prediction').textContent = todayPrediction.career;
    document.getElementById('health-prediction').textContent = todayPrediction.health;
    document.getElementById('daily-lucky-number').textContent = todayPrediction.lucky_number;
    document.getElementById('daily-advice').textContent = todayPrediction.advice;
}

// Quay lại trang chọn cung hoàng đạo
function goBack() {
    document.querySelector('.zodiac-selection').style.display = 'block';
    document.getElementById('horoscope-display').style.display = 'none';
}

// Hàm tạo dự đoán ngẫu nhiên cho các ngày khác (tùy chọn mở rộng)
function generateRandomPrediction(zodiacKey) {
    const lovePredictions = [
        "Tình yêu sẽ có những bất ngờ thú vị. Hãy mở lòng đón nhận.",
        "Mối quan hệ hiện tại sẽ được củng cố mạnh mẽ hơn.",
        "Cơ hội gặp gỡ người mới rất cao trong ngày hôm nay.",
        "Tình cảm gia đình sẽ được ưu tiên hơn tình yêu.",
        "Sự lãng mạn sẽ tràn ngập cuộc sống của bạn."
    ];
    
    const careerPredictions = [
        "Công việc thuận lợi, có thể có cơ hội thăng tiến.",
        "Hãy cẩn thận trong các quyết định quan trọng.",
        "Sự sáng tạo sẽ được đánh giá cao trong công việc.",
        "Mối quan hệ đồng nghiệp sẽ hỗ trợ bạn rất nhiều.",
        "Đây là thời điểm tốt để bắt đầu dự án mới."
    ];
    
    const healthPredictions = [
        "Sức khỏe ổn định, hãy duy trì chế độ sinh hoạt tốt.",
        "Cần chú ý nghỉ ngơi và tránh căng thẳng.",
        "Hoạt động thể thao sẽ mang lại nhiều lợi ích.",
        "Chế độ ăn uống cần được quan tâm đặc biệt.",
        "Tinh thần thoải mái sẽ giúp cải thiện sức khỏe."
    ];
    
    return {
        love: lovePredictions[Math.floor(Math.random() * lovePredictions.length)],
        career: careerPredictions[Math.floor(Math.random() * careerPredictions.length)],
        health: healthPredictions[Math.floor(Math.random() * healthPredictions.length)],
        lucky_number: Math.floor(Math.random() * 99) + 1,
        advice: "Hãy luôn giữ thái độ tích cực và tin tưởng vào bản thân."
    };
}