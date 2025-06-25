// Dữ liệu tử vi sẽ được tải từ các file JSON riêng biệt
let horoscopeData = {};
let currentZodiac = '';
let currentDate = '';

// Danh sách các cung hoàng đạo
const zodiacSigns = [
    'bach_duong', 'kim_nguu', 'song_tu', 'cu_giai', 
    'su_tu', 'xu_nu', 'thien_binh', 'ho_cap', 
    'nhan_ma', 'ma_ket', 'bao_binh', 'song_ngu'
];

// Load thông tin cơ bản của cung hoàng đạo
async function loadZodiacInfo(zodiacSign) {
    try {
        const response = await fetch(`data/${zodiacSign}_info.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Lỗi khi tải thông tin cung ${zodiacSign}:`, error);
        return null;
    }
}

// Load dữ liệu tử vi theo ngày
async function loadDailyHoroscope(zodiacSign, date) {
    try {
        const response = await fetch(`data/daily/${zodiacSign}/${date}.json`);
        if (!response.ok) {
            throw new Error(`Không tìm thấy dữ liệu cho ngày ${date}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Lỗi khi tải dữ liệu tử vi cho ${zodiacSign} ngày ${date}:`, error);
        // Fallback: tạo dữ liệu mặc định
        return generateDefaultHoroscope(zodiacSign, date);
    }
}

// Tạo dữ liệu tử vi mặc định khi không tìm thấy file
function generateDefaultHoroscope(zodiacSign, date) {
    const zodiacNames = {
        'bach_duong': 'Bạch Dương',
        'kim_nguu': 'Kim Ngưu',
        'song_tu': 'Song Tử',
        'cu_giai': 'Cự Giải',
        'su_tu': 'Sư Tử',
        'xu_nu': 'Xử Nữ',
        'thien_binh': 'Thiên Bình',
        'ho_cap': 'Hổ Cáp',
        'nhan_ma': 'Nhân Mã',
        'ma_ket': 'Ma Kết',
        'bao_binh': 'Bảo Bình',
        'song_ngu': 'Song Ngư'
    };
    
    return {
        date: date,
        love: `Ngày ${date} sẽ mang đến những cơ hội tốt đẹp trong tình yêu cho ${zodiacNames[zodiacSign]}. Hãy mở lòng và tận hưởng những khoảnh khắc đặc biệt.`,
        career: `Trong công việc, ${zodiacNames[zodiacSign]} sẽ có nhiều cơ hội thể hiện khả năng. Hãy tự tin và nỗ lực hết mình để đạt được mục tiêu đề ra.`,
        health: `Sức khỏe của ${zodiacNames[zodiacSign]} cần được chú ý. Hãy duy trì lối sống lành mạnh và tập luyện thể dục đều đặn.`,
        lucky_number: Math.floor(Math.random() * 9) + 1,
        advice: `Hãy tin tưởng vào bản thân và những quyết định của mình. Ngày hôm nay sẽ mang đến nhiều điều tốt lành.`
    };
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    displayCurrentDate();
    loadZodiacGrid();
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
    
    // Lưu ngày hiện tại để sử dụng
    currentDate = formatDateForFile(now);
}

// Format ngày theo định dạng yyyy-mm-dd
function formatDateForFile(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Tải và hiển thị lưới cung hoàng đạo
async function loadZodiacGrid() {
    try {
        const gridContainer = document.getElementById('zodiac-grid');
        
        for (const zodiacSign of zodiacSigns) {
            const zodiacInfo = await loadZodiacInfo(zodiacSign);
            if (zodiacInfo) {
                const zodiacCard = createZodiacCard(zodiacSign, zodiacInfo);
                gridContainer.appendChild(zodiacCard);
            }
        }
    } catch (error) {
        console.error('Lỗi khi tải lưới cung hoàng đạo:', error);
        document.querySelector('.zodiac-selection').innerHTML = 
            '<h2>❌ Không thể tải dữ liệu tử vi</h2><p>Vui lòng thử lại sau.</p>';
    }
}

// Tạo thẻ cung hoàng đạo
function createZodiacCard(zodiacSign, zodiacInfo) {
    const card = document.createElement('div');
    card.className = 'zodiac-card';
    card.onclick = () => selectZodiac(zodiacSign);
    
    card.innerHTML = `
        <div class="zodiac-symbol">${zodiacInfo.symbol}</div>
        <h3>${zodiacInfo.name}</h3>
        <p class="zodiac-dates">${zodiacInfo.date_range}</p>
        <p class="zodiac-element">Nguyên tố: ${zodiacInfo.element}</p>
    `;
    
    return card;
}


// Chọn cung hoàng đạo
async function selectZodiac(zodiacSign) {
    currentZodiac = zodiacSign;
    
    // Hiển thị loading
    showLoading();
    
    try {
        // Tải thông tin cung và tử vi hàng ngày
        const [zodiacInfo, dailyHoroscope] = await Promise.all([
            loadZodiacInfo(zodiacSign),
            loadDailyHoroscope(zodiacSign, currentDate)
        ]);
        
        if (zodiacInfo && dailyHoroscope) {
            displayHoroscope(zodiacInfo, dailyHoroscope);
        } else {
            showError('Không thể tải thông tin tử vi');
        }
    } catch (error) {
        console.error('Lỗi khi chọn cung hoàng đạo:', error);
        showError('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
        hideLoading();
    }
}

// Hiển thị loading
function showLoading() {
    const zodiacSelection = document.querySelector('.zodiac-selection');
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = `
        <div class="loading-spinner"></div>
        <p>Đang tải dữ liệu tử vi...</p>
    `;
    zodiacSelection.appendChild(loadingDiv);
}

// Ẩn loading
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// Hiển thị lỗi
function showError(message) {
    const zodiacSelection = document.querySelector('.zodiac-selection');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <h2>❌ ${message}</h2>
        <button onclick="location.reload()">Thử lại</button>
    `;
    zodiacSelection.appendChild(errorDiv);
}

// Hiển thị tử vi
function displayHoroscope(zodiacInfo, dailyHoroscope) {
    // Ẩn phần chọn cung
    document.querySelector('.zodiac-selection').style.display = 'none';
    
    // Hiển thị phần tử vi
    const horoscopeDisplay = document.getElementById('horoscope-display');
    horoscopeDisplay.style.display = 'block';
    
    // Cập nhật thông tin cung
    document.getElementById('selected-zodiac-name').textContent = zodiacInfo.name;
    document.getElementById('selected-zodiac-symbol').textContent = zodiacInfo.symbol;
    document.getElementById('selected-zodiac-dates').textContent = zodiacInfo.date_range;
    document.getElementById('selected-zodiac-element').textContent = zodiacInfo.element;
    
    // Cập nhật tử vi hàng ngày
    document.getElementById('love-prediction').textContent = dailyHoroscope.love;
    document.getElementById('career-prediction').textContent = dailyHoroscope.career;
    document.getElementById('health-prediction').textContent = dailyHoroscope.health;
    document.getElementById('lucky-number').textContent = dailyHoroscope.lucky_number;
    document.getElementById('advice-text').textContent = dailyHoroscope.advice;
}

// Quay lại trang chọn cung
function backToZodiacSelection() {
    document.getElementById('horoscope-display').style.display = 'none';
    document.querySelector('.zodiac-selection').style.display = 'block';
    currentZodiac = '';
}

    
