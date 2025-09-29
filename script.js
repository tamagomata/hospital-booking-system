// データ
const departments = [
    { id: 1, name: '内科', description: '風邪、生活習慣病など' },
    { id: 2, name: '外科', description: 'けが、手術など' },
    { id: 3, name: '小児科', description: 'お子様の診察' },
    { id: 4, name: '眼科', description: '目の診察' }
];

const timeSlots = [
    '09:00', '10:00', '11:00', '13:00',
    '14:00', '15:00', '16:00'
];

// 状態管理
let state = {
    selectedDepartment: null,
    selectedDate: '',
    selectedTime: ''
};

// 初期化
function init() {
    renderDepartments();
    setupEventListeners();
}

// 診療科の表示
function renderDepartments() {
    const grid = document.getElementById('departmentGrid');
    grid.innerHTML = departments.map(dept => `
        <div class="department-card" onclick="selectDepartment(${dept.id})">
            <h3>${dept.name}</h3>
            <p>${dept.description}</p>
        </div>
    `).join('');
}

// 時間帯の表示
function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    container.innerHTML = timeSlots.map(time => `
        <div class="time-slot" onclick="selectTime('${time}')">${time}</div>
    `).join('');
}

// イベントリスナーの設定
function setupEventListeners() {
    const dateInput = document.getElementById('appointment-date');
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.addEventListener('change', (e) => {
        state.selectedDate = e.target.value;
    });
}

// ページ表示
function showPage(pageNumber) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`page${pageNumber}`).classList.add('active');
    
    updateStepIndicator(pageNumber);
    
    if (pageNumber === 2) renderTimeSlots();
    if (pageNumber === 3) renderConfirmation();
    if (pageNumber === 4) renderCompletion();
}

// 診療科選択
function selectDepartment(deptId) {
    state.selectedDepartment = departments.find(d => d.id === deptId);
    document.querySelectorAll('.department-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

// 時間選択
function selectTime(time) {
    state.selectedTime = time;
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

// 確認画面の表示
function renderConfirmation() {
    const container = document.getElementById('confirmationDetails');
    container.innerHTML = `
        <div style="text-align: left; background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h3>予約内容</h3>
            <p><strong>診療科：</strong>${state.selectedDepartment.name}</p>
            <p><strong>日時：</strong>${state.selectedDate} ${state.selectedTime}</p>
        </div>
    `;
}

// 完了画面の表示
function renderCompletion() {
    const container = document.getElementById('completionDetails');
    container.innerHTML = `
        <p>予約が完了しました！</p>
        <div style="text-align: left; background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>診療科：</strong>${state.selectedDepartment.name}</p>
            <p><strong>日時：</strong>${state.selectedDate} ${state.selectedTime}</p>
            <p><strong>予約番号：</strong>RSV${Date.now().toString().slice(-6)}</p>
        </div>
    `;
}

// ステップインジケーター更新
function updateStepIndicator(currentPage) {
    document.querySelectorAll('.step').forEach((step, index) => {
        step.classList.toggle('active', index + 1 === currentPage);
    });
}

// 予約完了
function completeReservation() {
    if (!state.selectedDepartment || !state.selectedDate || !state.selectedTime) {
        alert('すべての項目を選択してください');
        return;
    }
    showPage(4);
}

// 初期化実行
init();

// データ保存機能を追加（script.jsに追記）
function saveReservation() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    reservations.push({
        id: Date.now(),
        ...state,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('reservations', JSON.stringify(reservations));
}

// 予約一覧表示機能
function showReservationList() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    console.log('保存された予約:', reservations);
}

// フロントエンドからAPI呼び出し
async function saveToServer(reservationData) {
    try {
        const response = await fetch('http://localhost:5000/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData)
        });
        return await response.json();
    } catch (error) {
        console.error('保存エラー:', error);
        // エラー時はローカルストレージに保存
        saveToLocal(reservationData);
    }
}

// 使用状況トラッキング（script.jsに追加）
const usageStats = {
    startTime: Date.now(),
    pageViews: {},
    errors: []
};

function trackPageView(pageName) {
    if (!usageStats.pageViews[pageName]) {
        usageStats.pageViews[pageName] = 0;
    }
    usageStats.pageViews[pageName]++;
}

function trackError(error) {
    usageStats.errors.push({
        error: error.message,
        timestamp: new Date().toISOString(),
        page: currentPage
    });
}