const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let holidaysData = null;

async function init() {
    await loadHolidays();
    renderCalendar(currentYear, currentMonth);
    setupEventListeners();
}

async function loadHolidays() {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/chinese-days/dist/chinese-days.json');
        holidaysData = await response.json();
    } catch (error) {
        holidaysData = {};
    }
}

function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function getLunarYearName(year) {
    const offset = year - 1900 + 36;
    return `${gan[offset%10]}${zhi[offset%12]}年 (${animals[offset%12]}年)`;
}

function isHoliday(date) {
    if (!holidaysData) return {isHoliday:false,isWorkday:false,name:''};
    const dateStr = formatDate(date);
    const dayInfo = holidaysData[dateStr];
    if (dayInfo) return {isHoliday:dayInfo.type==='holiday',isWorkday:dayInfo.type==='workday',name:dayInfo.name||''};
    const dayOfWeek = date.getDay();
    if (dayOfWeek===0 || dayOfWeek===6) return {isHoliday:true,isWorkday:false,name:'周末'};
    return {isHoliday:false,isWorkday:false,name:''};
}

function renderCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    document.getElementById('yearMonth').textContent = `${year}年${month+1}月`;
    document.getElementById('lunarYear').textContent = getLunarYearName(year);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    
    for (let i = firstDay-1; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'day day-other-month';
        div.innerHTML = `<span class="day-number">${daysInPrevMonth-i}</span>`;
        calendar.appendChild(div);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const div = document.createElement('div');
        div.className = 'day';
        
        if (date.toDateString() === today.toDateString()) div.classList.add('day-today');
        
        const holidayInfo = isHoliday(date);
        if (holidayInfo.isHoliday && !div.classList.contains('day-today')) div.classList.add('day-holiday');
        if (holidayInfo.isWorkday) div.classList.add('day-workday');
        
        const dayOfWeek = date.getDay();
        if ((dayOfWeek===0 || dayOfWeek===6) && !div.classList.contains('day-today') && !holidayInfo.isHoliday) {
            div.classList.add('day-weekend');
        }
        
        let lunarText = '';
        let festivalText = '';
        
        try {
            if (window.chineseDays) {
                const lunarDate = window.chineseDays.getLunarDate(formatDate(date));
                if (lunarDate) {
                    lunarText = lunarDate.lunarDay === 1 ? lunarDate.lunarMonthName : lunarDate.lunarDayName;
                    if (lunarDate.solarTerm) festivalText = lunarDate.solarTerm;
                    else if (lunarDate.lunarFestival) festivalText = lunarDate.lunarFestival;
                    else if (lunarDate.gregorianFestival) festivalText = lunarDate.gregorianFestival;
                }
            }
            if (!festivalText && holidayInfo.name) festivalText = holidayInfo.name;
        } catch (e) {}
        
        div.innerHTML = `
            <span class="day-number">${day}</span>
            <span class="day-lunar">${festivalText || lunarText || ''}</span>
        `;
        div.addEventListener('click', () => showDayDetail(date, lunarText, festivalText, holidayInfo));
        calendar.appendChild(div);
    }
    
    const remaining = 42 - (firstDay + daysInMonth);
    for (let i = 1; i <= remaining; i++) {
        const div = document.createElement('div');
        div.className = 'day day-other-month';
        div.innerHTML = `<span class="day-number">${i}</span>`;
        calendar.appendChild(div);
    }
}

function showDayDetail(date, lunarText, festivalText, holidayInfo) {
    const modal = document.getElementById('dayModal');
    const modalBody = document.getElementById('modalBody');
    const weekdays = ['周日','周一','周二','周三','周四','周五','周六'];
    
    let html = `<div class="modal-date">${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${weekdays[date.getDay()]}</div>`;
    
    if (window.chineseDays) {
        const lunarDate = window.chineseDays.getLunarDate(formatDate(date));
        if (lunarDate) {
            html += `<div class="modal-lunar">农历：${lunarDate.lunarYearName}年 ${lunarDate.lunarMonthName}${lunarDate.lunarDayName}</div>`;
        }
    }
    
    if (festivalText) html += `<div class="modal-festival">${festivalText}</div>`;
    if (holidayInfo.isHoliday) html += `<div class="modal-festival">休息日 🏖️</div>`;
    if (holidayInfo.isWorkday) html += `<div style="color:#e74c3c;font-weight:bold;">调休上班 💼</div>`;
    
    modalBody.innerHTML = html;
    modal.style.display = 'block';
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentYear, currentMonth);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentYear, currentMonth);
    });
    
    document.getElementById('todayBtn').addEventListener('click', () => {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        renderCalendar(currentYear, currentMonth);
    });
    
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('dayModal').style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('dayModal');
        if (e.target === modal) modal.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', init);
