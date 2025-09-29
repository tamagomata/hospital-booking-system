// データ
const departments = [
    { id: 1, name: '内科', description: '風邪、生活習慣病など' },
    { id: 2, name: '外科', description: 'けが、手術など' },
    { id: 3, name: '小児科', description: 'お子様の診察' },
    { id: 4, name: '眼科', description: '目の診察' }
];

// 医師データを追加
const doctors = [
    { id: 1, name: '山田 太郎', department: '内科', specialty: '消化器内科', description: '胃腸の疾患を専門に診療' },
    { id: 2, name: '佐藤 美咲', department: '内科', specialty: '循環器内科', description: '心臓・血管の疾患を専門に診療' },
    { id: 3, name: '鈴木 一郎', department: '外科', specialty: '一般外科', description: 'けがや手術を専門に診療' },
    { id: 4, name: '高橋 裕子', department: '小児科', specialty: '小児科一般', description: 'お子様の病気を優しく診療' },
    { id: 5, name: '伊藤 健二', department: '眼科', specialty: '網膜疾患', description: '目の病気を専門に診療' }
];

const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

// 状態管理
let state = {
    selectedDepartment: null,
    selectedDoctor: null,
    selectedDate: '',
    selectedTime: '',
    patientInfo: null
};

// 初期化
function init() {
    renderDepartments();
    setupEventListeners();
    updateStepIndicator(1);
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

// 医師の表示（新規追加）
function renderDoctors() {
    const container = document.getElementById('doctorsContainer');
    const departmentDoctors = doctors.filter(doctor => 
        doctor.department === state.selectedDepartment.name
    );
    
    if (departmentDoctors.length === 0) {
        container.innerHTML = '<p>該当する医師が見つかりませんでした</p>';
        return;
    }
    
    container.innerHTML = departmentDoctors.map(doctor => `
        <div class="doctor-card" onclick="selectDoctor(${doctor.id})">
            <div class="doctor-info">
                <h3>${doctor.name} 医師</h3>
                <p><strong>専門：</strong>${doctor.specialty}</p>
                <p>${doctor.description}</p>
            </div>
        </div>
    `).join('');
}

// 時間帯の表示
function renderTimeSlots() {
    const container = document.getElementById('timeSlots');
    const availableSlots = getAvailableTimeSlots();
    
    container.innerHTML = availableSlots.map(time => `
        <div class="time-slot" onclick="selectTime('${time}')">${time}</div>
    `).join('');
}

// 利用可能な時間帯を取得（新規追加）
function getAvailableTimeSlots() {
    // 実際のシステムでは医師のスケジュールから取得
    // ここでは簡易的に全時間帯を返す
    return timeSlots;
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
    
    if (pageNumber === 2) renderDoctors();
    if (pageNumber === 3) renderTimeSlots();
    if (pageNumber === 5) renderConfirmation();
    if (pageNumber === 6) renderCompletion();
    
    trackPageView(`page${pageNumber}`);
}

// ステップインジケーター更新（改良）
function updateStepIndicator(currentPage) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentPage) {
            step.classList.add('active');
        } else if (stepNumber < currentPage) {
            step.classList.add('completed');
        }
    });
}

// 診療科選択
function selectDepartment(deptId) {
    state.selectedDepartment = departments.find(d => d.id === deptId);
    document.querySelectorAll('.department-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

// 医師選択（新規追加）
function selectDoctor(doctorId) {
    state.selectedDoctor = doctors.find(d => d.id === doctorId);
    document.querySelectorAll('.doctor-card').forEach(card => {
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

// 患者情報を取得（新規追加）
function getPatientInfo() {
    return {
        name: document.getElementById('patient-name').value,
        kana: document.getElementById('patient-kana').value,
        tel: document.getElementById('patient-tel').value,
        email: document.getElementById('patient-email').value,
        memo: document.getElementById('patient-memo').value,
        registeredAt: new Date().toISOString()
    };
}

// 確認画面の表示（改良）
function renderConfirmation() {
    const container = document.getElementById('confirmationDetails');
    state.patientInfo = getPatientInfo();
    
    container.innerHTML = `
        <div class="confirmation-section">
            <h3>診察情報</h3>
            <div class="confirmation-detail">
                <strong>診療科：</strong>
                <span>${state.selectedDepartment.name}</span>
            </div>
            <div class="confirmation-detail">
                <strong>担当医師：</strong>
                <span>${state.selectedDoctor.name} 医師</span>
            </div>
            <div class="confirmation-detail">
                <strong>診療日時：</strong>
                <span>${state.selectedDate} ${state.selectedTime}</span>
            </div>
        </div>
        <div class="confirmation-section">
            <h3>患者情報</h3>
            <div class="confirmation-detail">
                <strong>お名前：</strong>
                <span>${state.patientInfo.name}</span>
            </div>
            <div class="confirmation-detail">
                <strong>ふりがな：</strong>
                <span>${state.patientInfo.kana || '未入力'}</span>
            </div>
            <div class="confirmation-detail">
                <strong>電話番号：</strong>
                <span>${state.patientInfo.tel}</span>
            </div>
            <div class="confirmation-detail">
                <strong>メールアドレス：</strong>
                <span>${state.patientInfo.email || '未入力'}</span>
            </div>
            <div class="confirmation-detail">
                <strong>症状・ご要望：</strong>
                <span>${state.patientInfo.memo || 'なし'}</span>
            </div>
        </div>
    `;
}

// 完了画面の表示（改良）
function renderCompletion() {
    const reservationId = 'RSV' + Date.now().toString().slice(-8);
    const container = document.getElementById('completionDetails');
    
    container.innerHTML = `
        <div class="confirmation-section">
            <h3>予約詳細</h3>
            <div class="confirmation-detail">
                <strong>予約番号：</strong>
                <span>${reservationId}</span>
            </div>
            <div class="confirmation-detail">
                <strong>診療科：</strong>
                <span>${state.selectedDepartment.name}</span>
            </div>
            <div class="confirmation-detail">
                <strong>担当医師：</strong>
                <span>${state.selectedDoctor.name} 医師</span>
            </div>
            <div class="confirmation-detail">
                <strong>診療日時：</strong>
                <span>${state.selectedDate} ${state.selectedTime}</span>
            </div>
            <div class="confirmation-detail">
                <strong>患者氏名：</strong>
                <span>${state.patientInfo.name}</span>
            </div>
        </div>
    `;
    
    // 予約を保存
    saveReservation(reservationId);
}

// 入力バリデーション（新規追加）
function validatePatientInfo() {
    const patientInfo = getPatientInfo();
    
    if (!patientInfo.name || patientInfo.name.trim() === '') {
        alert('お名前を入力してください');
        return false;
    }
    
    if (!patientInfo.tel || patientInfo.tel.trim() === '') {
        alert('電話番号を入力してください');
        return false;
    }
    
    // 電話番号の簡易バリデーション
    const telRegex = /^[0-9-+()]+$/;
    if (!telRegex.test(patientInfo.tel)) {
        alert('正しい電話番号を入力してください');
        return false;
    }
    
    return true;
}

// ページ遷移前のバリデーション（新規追加）
function validateAndProceed(nextPage) {
    try {
        switch (nextPage) {
            case 2:
                if (!state.selectedDepartment) {
                    alert('診療科を選択してください');
                    return;
                }
                break;
            case 3:
                if (!state.selectedDoctor) {
                    alert('医師を選択してください');
                    return;
                }
                break;
            case 4:
                if (!state.selectedDate || !state.selectedTime) {
                    alert('日時を選択してください');
                    return;
                }
                break;
            case 5:
                if (!validatePatientInfo()) {
                    return;
                }
                break;
        }
        showPage(nextPage);
    } catch (error) {
        trackError(error);
        alert('エラーが発生しました。もう一度お試しください。');
    }
}

// 予約完了（改良）
function completeReservation() {
    if (!state.selectedDepartment || !state.selectedDoctor || !state.selectedDate || !state.selectedTime) {
        alert('すべての項目を選択してください');
        return;
    }
    
    showPage(6);
}

// データ保存機能（改良）
function saveReservation(reservationId) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const reservation = {
        id: reservationId,
        department: state.selectedDepartment.name,
        doctor: state.selectedDoctor.name,
        doctorId: state.selectedDoctor.id,
        date: state.selectedDate,
        time: state.selectedTime,
        patient: state.patientInfo,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    // サーバーにも保存を試みる
    saveToServer(reservation).catch(error => {
        console.log('サーバー保存に失敗しましたが、ローカルには保存されています:', error);
    });
    
    console.log('予約が保存されました:', reservation);
}

// 予約一覧表示機能
function showReservationList() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    console.log('保存された予約:', reservations);
    return reservations;
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
        throw error;
    }
}

// 使用状況トラッキング
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
    console.log(`ページ閲覧: ${pageName}`, usageStats.pageViews);
}

function trackError(error) {
    const errorInfo = {
        error: error.message,
        timestamp: new Date().toISOString(),
        page: `page${getCurrentPage()}`
    };
    usageStats.errors.push(errorInfo);
    console.error('エラーが発生しました:', errorInfo);
}

function getCurrentPage() {
    const activePage = document.querySelector('.page.active');
    return activePage ? activePage.id.replace('page', '') : 'unknown';
}

// 初期化実行
init();
