// 中国日历 - 完整版（内置农历计算，不依赖外部库）

const lunarMonths = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十','廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const gan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const zhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const animals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];

// 农历数据表（1900-2100）
const lunarInfo = [
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
];

// 节假日数据（2024-2026）
const holidays = {
    '2024-01-01': { type: 'holiday', name: '元旦' },
    '2024-02-10': { type: 'holiday', name: '春节' },
    '2024-02-11': { type: 'holiday', name: '春节' },
    '2024-02-12': { type: 'holiday', name: '春节' },
    '2024-02-13': { type: 'holiday', name: '春节' },
    '2024-02-14': { type: 'holiday', name: '春节' },
    '2024-02-15': { type: 'holiday', name: '春节' },
    '2024-02-16': { type: 'holiday', name: '春节' },
    '2024-02-17': { type: 'holiday', name: '春节' },
    '2024-04-04': { type: 'holiday', name: '清明' },
    '2024-04-05': { type: 'holiday', name: '清明' },
    '2024-04-06': { type: 'holiday', name: '清明' },
    '2024-05-01': { type: 'holiday', name: '劳动节' },
    '2024-05-02': { type: 'holiday', name: '劳动节' },
    '2024-05-03': { type: 'holiday', name: '劳动节' },
    '2024-05-04': { type: 'holiday', name: '劳动节' },
    '2024-05-05': { type: 'holiday', name: '劳动节' },
    '2024-06-10': { type: 'holiday', name: '端午' },
    '2024-09-15': { type: 'holiday', name: '中秋' },
    '2024-09-16': { type: 'holiday', name: '中秋' },
    '2024-09-17': { type: 'holiday', name: '中秋' },
    '2024-10-01': { type: 'holiday', name: '国庆' },
    '2024-10-02': { type: 'holiday', name: '国庆' },
    '2024-10-03': { type: 'holiday', name: '国庆' },
    '2024-10-04': { type: 'holiday', name: '国庆' },
    '2024-10-05': { type: 'holiday', name: '国庆' },
    '2024-10-06': { type: 'holiday', name: '国庆' },
    '2024-10-07': { type: 'holiday', name: '国庆' },
    // 2024调休
    '2024-02-04': { type: 'workday', name: '调休上班' },
    '2024-02-18': { type: 'workday', name: '调休上班' },
    '2024-04-07': { type: 'workday', name: '调休上班' },
    '2024-04-28': { type: 'workday', name: '调休上班' },
    '2024-05-11': { type: 'workday', name: '调休上班' },
    '2024-09-14': { type: 'workday', name: '调休上班' },
    '2024-09-29': { type: 'workday', name: '调休上班' },
    '2024-10-12': { type: 'workday', name: '调休上班' },
    
    // 2025节假日
    '2025-01-01': { type: 'holiday', name: '元旦' },
    '2025-01-28': { type: 'holiday', name: '春节' },
    '2025-01-29': { type: 'holiday', name: '春节' },
    '2025-01-30': { type: 'holiday', name: '春节' },
    '2025-01-31': { type: 'holiday', name: '春节' },
    '2025-02-01': { type: 'holiday', name: '春节' },
    '2025-02-02': { type: 'holiday', name: '春节' },
    '2025-02-03': { type: 'holiday', name: '春节' },
    '2025-02-04': { type: 'holiday', name: '春节' },
    '2025-04-04': { type: 'holiday', name: '清明' },
    '2025-04-05': { type: 'holiday', name: '清明' },
    '2025-04-06': { type: 'holiday', name: '清明' },
    '2025-05-01': { type: 'holiday', name: '劳动节' },
    '2025-05-02': { type: 'holiday', name: '劳动节' },
    '2025-05-03': { type: 'holiday', name: '劳动节' },
    '2025-05-04': { type: 'holiday', name: '劳动节' },
    '2025-05-05': { type: 'holiday', name: '劳动节' },
    '2025-05-31': { type: 'holiday', name: '端午' },
    '2025-06-01': { type: 'holiday', name: '端午' },
    '2025-06-02': { type: 'holiday', name: '端午' },
    '2025-10-01': { type: 'holiday', name: '国庆' },
    '2025-10-02': { type: 'holiday', name: '国庆' },
    '2025-10-03': { type: 'holiday', name: '国庆' },
    '2025-10-04': { type: 'holiday', name: '国庆' },
    '2025-10-05': { type: 'holiday', name: '国庆' },
    '2025-10-06': { type: 'holiday', name: '国庆' },
    '2025-10-07': { type: 'holiday', name: '国庆' },
    '2025-10-08': { type: 'holiday', name: '国庆' },
    // 2025调休
    '2025-01-26': { type: 'workday', name: '调休上班' },
    '2025-04-27': { type: 'workday', name: '调休上班' },
    '2025-09-28': { type: 'workday', name: '调休上班' },
    '2025-10-11': { type: 'workday', name: '调休上班' },
    
    // 2026节假日（预测）
    '2026-01-01': { type: 'holiday', name: '元旦' },
    '2026-02-17': { type: 'holiday', name: '春节' },
    '2026-02-18': { type: 'holiday', name: '春节' },
    '2026-02-19': { type: 'holiday', name: '春节' },
    '2026-02-20': { type: 'holiday', name: '春节' },
    '2026-02-21': { type: 'holiday', name: '春节' },
    '2026-02-22': { type: 'holiday', name: '春节' },
    '2026-02-23': { type: 'holiday', name: '春节' },
    '2026-02-24': { type: 'holiday', name: '春节' },
    // 2026劳动节
    '2026-05-01': { type: 'holiday', name: '劳动节' },
    '2026-05-02': { type: 'holiday', name: '劳动节' },
    '2026-05-03': { type: 'holiday', name: '劳动节' },
    '2026-05-04': { type: 'holiday', name: '劳动节' },
    '2026-05-05': { type: 'holiday', name: '劳动节' },
    // 2026清明
    '2026-04-04': { type: 'holiday', name: '清明' },
    '2026-04-05': { type: 'holiday', name: '清明' },
    '2026-04-06': { type: 'holiday', name: '清明' },
    // 2026端午
    '2026-06-19': { type: 'holiday', name: '端午' },
    '2026-06-20': { type: 'holiday', name: '端午' },
    '2026-06-21': { type: 'holiday', name: '端午' },
    // 2026中秋国庆
    '2026-10-01': { type: 'holiday', name: '国庆' },
    '2026-10-02': { type: 'holiday', name: '国庆' },
    '2026-10-03': { type: 'holiday', name: '国庆' },
    '2026-10-04': { type: 'holiday', name: '国庆' },
    '2026-10-05': { type: 'holiday', name: '国庆' },
    '2026-10-06': { type: 'holiday', name: '国庆' },
    '2026-10-07': { type: 'holiday', name: '国庆' },
    '2026-10-08': { type: 'holiday', name: '国庆' },
    '2026-09-25': { type: 'holiday', name: '中秋' },
    '2026-09-26': { type: 'holiday', name: '中秋' },
    '2026-09-27': { type: 'holiday', name: '中秋' },
    // 2026调休
    '2026-02-15': { type: 'workday', name: '调休上班' },
    '2026-02-28': { type: 'workday', name: '调休上班' },
    '2026-04-11': { type: 'workday', name: '调休上班' },
    '2026-05-09': { type: 'workday', name: '调休上班' },
    '2026-06-13': { type: 'workday', name: '调休上班' },
    '2026-09-20': { type: 'workday', name: '调休上班' },
    '2026-10-10': { type: 'workday', name: '调休上班' },
    
    // 2027节假日（预测）
    '2027-01-01': { type: 'holiday', name: '元旦' },
    '2027-02-06': { type: 'holiday', name: '春节' },
    '2027-02-07': { type: 'holiday', name: '春节' },
    '2027-02-08': { type: 'holiday', name: '春节' },
    '2027-02-09': { type: 'holiday', name: '春节' },
    '2027-02-10': { type: 'holiday', name: '春节' },
    '2027-02-11': { type: 'holiday', name: '春节' },
    '2027-02-12': { type: 'holiday', name: '春节' },
    '2027-02-13': { type: 'holiday', name: '春节' },
    '2027-04-05': { type: 'holiday', name: '清明' },
    '2027-04-06': { type: 'holiday', name: '清明' },
    '2027-04-07': { type: 'holiday', name: '清明' },
    '2027-05-01': { type: 'holiday', name: '劳动节' },
    '2027-05-02': { type: 'holiday', name: '劳动节' },
    '2027-05-03': { type: 'holiday', name: '劳动节' },
    '2027-05-04': { type: 'holiday', name: '劳动节' },
    '2027-05-05': { type: 'holiday', name: '劳动节' },
    '2027-06-09': { type: 'holiday', name: '端午' },
    '2027-06-10': { type: 'holiday', name: '端午' },
    '2027-06-11': { type: 'holiday', name: '端午' },
    '2027-09-21': { type: 'holiday', name: '中秋' },
    '2027-09-22': { type: 'holiday', name: '中秋' },
    '2027-09-23': { type: 'holiday', name: '中秋' },
    '2027-10-01': { type: 'holiday', name: '国庆' },
    '2027-10-02': { type: 'holiday', name: '国庆' },
    '2027-10-03': { type: 'holiday', name: '国庆' },
    '2027-10-04': { type: 'holiday', name: '国庆' },
    '2027-10-05': { type: 'holiday', name: '国庆' },
    '2027-10-06': { type: 'holiday', name: '国庆' },
    '2027-10-07': { type: 'holiday', name: '国庆' },
    '2027-10-08': { type: 'holiday', name: '国庆' },
    // 2027调休
    '2027-02-20': { type: 'workday', name: '调休上班' },
    '2027-04-17': { type: 'workday', name: '调休上班' },
    '2027-05-08': { type: 'workday', name: '调休上班' },
    '2027-06-12': { type: 'workday', name: '调休上班' },
    '2027-09-18': { type: 'workday', name: '调休上班' },
    '2027-10-09': { type: 'workday', name: '调休上班' },
    
    // 2028节假日（预测）
    '2028-01-01': { type: 'holiday', name: '元旦' },
    '2028-01-26': { type: 'holiday', name: '春节' },
    '2028-01-27': { type: 'holiday', name: '春节' },
    '2028-01-28': { type: 'holiday', name: '春节' },
    '2028-01-29': { type: 'holiday', name: '春节' },
    '2028-01-30': { type: 'holiday', name: '春节' },
    '2028-01-31': { type: 'holiday', name: '春节' },
    '2028-02-01': { type: 'holiday', name: '春节' },
    '2028-02-02': { type: 'holiday', name: '春节' },
    '2028-04-04': { type: 'holiday', name: '清明' },
    '2028-04-05': { type: 'holiday', name: '清明' },
    '2028-04-06': { type: 'holiday', name: '清明' },
    '2028-05-01': { type: 'holiday', name: '劳动节' },
    '2028-05-02': { type: 'holiday', name: '劳动节' },
    '2028-05-03': { type: 'holiday', name: '劳动节' },
    '2028-05-04': { type: 'holiday', name: '劳动节' },
    '2028-05-05': { type: 'holiday', name: '劳动节' },
    '2028-05-28': { type: 'holiday', name: '端午' },
    '2028-05-29': { type: 'holiday', name: '端午' },
    '2028-05-30': { type: 'holiday', name: '端午' },
    '2028-10-01': { type: 'holiday', name: '国庆' },
    '2028-10-02': { type: 'holiday', name: '国庆' },
    '2028-10-03': { type: 'holiday', name: '国庆' },
    '2028-10-04': { type: 'holiday', name: '国庆' },
    '2028-10-05': { type: 'holiday', name: '国庆' },
    '2028-10-06': { type: 'holiday', name: '国庆' },
    '2028-10-07': { type: 'holiday', name: '国庆' },
    '2028-10-08': { type: 'holiday', name: '国庆' },
    '2028-09-13': { type: 'holiday', name: '中秋' },
    '2028-09-14': { type: 'holiday', name: '中秋' },
    '2028-09-15': { type: 'holiday', name: '中秋' },
    // 2028调休
    '2028-01-22': { type: 'workday', name: '调休上班' },
    '2028-04-08': { type: 'workday', name: '调休上班' },
    '2028-05-06': { type: 'workday', name: '调休上班' },
    '2028-05-27': { type: 'workday', name: '调休上班' },
    '2028-09-10': { type: 'workday', name: '调休上班' },
    '2028-10-09': { type: 'workday', name: '调休上班' },
    
    // 2029节假日（预测）
    '2029-01-01': { type: 'holiday', name: '元旦' },
    '2029-02-13': { type: 'holiday', name: '春节' },
    '2029-02-14': { type: 'holiday', name: '春节' },
    '2029-02-15': { type: 'holiday', name: '春节' },
    '2029-02-16': { type: 'holiday', name: '春节' },
    '2029-02-17': { type: 'holiday', name: '春节' },
    '2029-02-18': { type: 'holiday', name: '春节' },
    '2029-02-19': { type: 'holiday', name: '春节' },
    '2029-02-20': { type: 'holiday', name: '春节' },
    '2029-04-04': { type: 'holiday', name: '清明' },
    '2029-04-05': { type: 'holiday', name: '清明' },
    '2029-04-06': { type: 'holiday', name: '清明' },
    '2029-05-01': { type: 'holiday', name: '劳动节' },
    '2029-05-02': { type: 'holiday', name: '劳动节' },
    '2029-05-03': { type: 'holiday', name: '劳动节' },
    '2029-05-04': { type: 'holiday', name: '劳动节' },
    '2029-05-05': { type: 'holiday', name: '劳动节' },
    '2029-06-16': { type: 'holiday', name: '端午' },
    '2029-06-17': { type: 'holiday', name: '端午' },
    '2029-06-18': { type: 'holiday', name: '端午' },
    '2029-10-01': { type: 'holiday', name: '国庆' },
    '2029-10-02': { type: 'holiday', name: '国庆' },
    '2029-10-03': { type: 'holiday', name: '国庆' },
    '2029-10-04': { type: 'holiday', name: '国庆' },
    '2029-10-05': { type: 'holiday', name: '国庆' },
    '2029-10-06': { type: 'holiday', name: '国庆' },
    '2029-10-07': { type: 'holiday', name: '国庆' },
    '2029-10-08': { type: 'holiday', name: '国庆' },
    '2029-09-22': { type: 'holiday', name: '中秋' },
    '2029-09-23': { type: 'holiday', name: '中秋' },
    '2029-09-24': { type: 'holiday', name: '中秋' },
    // 2029调休
    '2029-02-10': { type: 'workday', name: '调休上班' },
    '2029-04-07': { type: 'workday', name: '调休上班' },
    '2029-05-12': { type: 'workday', name: '调休上班' },
    '2029-06-15': { type: 'workday', name: '调休上班' },
    '2029-09-29': { type: 'workday', name: '调休上班' },
    '2029-10-13': { type: 'workday', name: '调休上班' },
    
    // 2030节假日（预测）
    '2030-01-01': { type: 'holiday', name: '元旦' },
    '2030-02-03': { type: 'holiday', name: '春节' },
    '2030-02-04': { type: 'holiday', name: '春节' },
    '2030-02-05': { type: 'holiday', name: '春节' },
    '2030-02-06': { type: 'holiday', name: '春节' },
    '2030-02-07': { type: 'holiday', name: '春节' },
    '2030-02-08': { type: 'holiday', name: '春节' },
    '2030-02-09': { type: 'holiday', name: '春节' },
    '2030-02-10': { type: 'holiday', name: '春节' },
    '2030-04-05': { type: 'holiday', name: '清明' },
    '2030-04-06': { type: 'holiday', name: '清明' },
    '2030-04-07': { type: 'holiday', name: '清明' },
    '2030-05-01': { type: 'holiday', name: '劳动节' },
    '2030-05-02': { type: 'holiday', name: '劳动节' },
    '2030-05-03': { type: 'holiday', name: '劳动节' },
    '2030-05-04': { type: 'holiday', name: '劳动节' },
    '2030-05-05': { type: 'holiday', name: '劳动节' },
    '2030-06-05': { type: 'holiday', name: '端午' },
    '2030-06-06': { type: 'holiday', name: '端午' },
    '2030-06-07': { type: 'holiday', name: '端午' },
    '2030-10-01': { type: 'holiday', name: '国庆' },
    '2030-10-02': { type: 'holiday', name: '国庆' },
    '2030-10-03': { type: 'holiday', name: '国庆' },
    '2030-10-04': { type: 'holiday', name: '国庆' },
    '2030-10-05': { type: 'holiday', name: '国庆' },
    '2030-10-06': { type: 'holiday', name: '国庆' },
    '2030-10-07': { type: 'holiday', name: '国庆' },
    '2030-10-08': { type: 'holiday', name: '国庆' },
    '2030-09-12': { type: 'holiday', name: '中秋' },
    '2030-09-13': { type: 'holiday', name: '中秋' },
    '2030-09-14': { type: 'holiday', name: '中秋' },
    // 2030调休
    '2030-02-02': { type: 'workday', name: '调休上班' },
    '2030-04-27': { type: 'workday', name: '调休上班' },
    '2030-05-11': { type: 'workday', name: '调休上班' },
    '2030-06-08': { type: 'workday', name: '调休上班' },
    '2030-09-21': { type: 'workday', name: '调休上班' },
    '2030-10-12': { type: 'workday', name: '调休上班' },
};

// 24节气数据（简化版，每个节气大约在特定日期）
const solarTerms2025 = {
    '2025-01-05': '小寒', '2025-01-20': '大寒',
    '2025-02-03': '立春', '2025-02-18': '雨水',
    '2025-03-05': '惊蛰', '2025-03-20': '春分',
    '2025-04-04': '清明', '2025-04-20': '谷雨',
    '2025-05-05': '立夏', '2025-05-21': '小满',
    '2025-06-05': '芒种', '2025-06-21': '夏至',
    '2025-07-07': '小暑', '2025-07-22': '大暑',
    '2025-08-07': '立秋', '2025-08-23': '处暑',
    '2025-09-07': '白露', '2025-09-23': '秋分',
    '2025-10-08': '寒露', '2025-10-23': '霜降',
    '2025-11-07': '立冬', '2025-11-22': '小雪',
    '2025-12-07': '大雪', '2025-12-21': '冬至'
};

const solarTerms2026 = {
    '2026-01-05': '小寒', '2026-01-20': '大寒',
    '2026-02-04': '立春', '2026-02-18': '雨水',
    '2026-03-05': '惊蛰', '2026-03-20': '春分',
    '2026-04-05': '清明', '2026-04-20': '谷雨',
    '2026-05-05': '立夏', '2026-05-21': '小满',
    '2026-06-05': '芒种', '2026-06-21': '夏至',
    '2026-07-07': '小暑', '2026-07-22': '大暑',
    '2026-08-07': '立秋', '2026-08-23': '处暑',
    '2026-09-07': '白露', '2026-09-23': '秋分',
    '2026-10-08': '寒露', '2026-10-23': '霜降',
    '2026-11-07': '立冬', '2026-11-22': '小雪',
    '2026-12-07': '大雪', '2026-12-21': '冬至'
};

const solarTerms2027 = {
    '2027-01-05': '小寒', '2027-01-20': '大寒',
    '2027-02-04': '立春', '2027-02-19': '雨水',
    '2027-03-06': '惊蛰', '2027-03-21': '春分',
    '2027-04-05': '清明', '2027-04-20': '谷雨',
    '2027-05-05': '立夏', '2027-05-21': '小满',
    '2027-06-06': '芒种', '2027-06-21': '夏至',
    '2027-07-07': '小暑', '2027-07-23': '大暑',
    '2027-08-07': '立秋', '2027-08-23': '处暑',
    '2027-09-07': '白露', '2027-09-23': '秋分',
    '2027-10-08': '寒露', '2027-10-23': '霜降',
    '2027-11-07': '立冬', '2027-11-22': '小雪',
    '2027-12-07': '大雪', '2027-12-22': '冬至'
};

const solarTerms2028 = {
    '2028-01-06': '小寒', '2028-01-21': '大寒',
    '2028-02-04': '立春', '2028-02-19': '雨水',
    '2028-03-05': '惊蛰', '2028-03-20': '春分',
    '2028-04-04': '清明', '2028-04-20': '谷雨',
    '2028-05-05': '立夏', '2028-05-21': '小满',
    '2028-06-05': '芒种', '2028-06-21': '夏至',
    '2028-07-07': '小暑', '2028-07-22': '大暑',
    '2028-08-07': '立秋', '2028-08-23': '处暑',
    '2028-09-07': '白露', '2028-09-23': '秋分',
    '2028-10-08': '寒露', '2028-10-23': '霜降',
    '2028-11-07': '立冬', '2028-11-22': '小雪',
    '2028-12-06': '大雪', '2028-12-21': '冬至'
};

const solarTerms2029 = {
    '2029-01-05': '小寒', '2029-01-20': '大寒',
    '2029-02-03': '立春', '2029-02-18': '雨水',
    '2029-03-05': '惊蛰', '2029-03-20': '春分',
    '2029-04-04': '清明', '2029-04-20': '谷雨',
    '2029-05-05': '立夏', '2029-05-21': '小满',
    '2029-06-05': '芒种', '2029-06-21': '夏至',
    '2029-07-07': '小暑', '2029-07-22': '大暑',
    '2029-08-07': '立秋', '2029-08-23': '处暑',
    '2029-09-07': '白露', '2029-09-23': '秋分',
    '2029-10-08': '寒露', '2029-10-23': '霜降',
    '2029-11-07': '立冬', '2029-11-22': '小雪',
    '2029-12-07': '大雪', '2029-12-21': '冬至'
};

const solarTerms2030 = {
    '2030-01-05': '小寒', '2030-01-20': '大寒',
    '2030-02-04': '立春', '2030-02-19': '雨水',
    '2030-03-06': '惊蛰', '2030-03-21': '春分',
    '2030-04-05': '清明', '2030-04-20': '谷雨',
    '2030-05-05': '立夏', '2030-05-21': '小满',
    '2030-06-06': '芒种', '2030-06-21': '夏至',
    '2030-07-07': '小暑', '2030-07-23': '大暑',
    '2030-08-07': '立秋', '2030-08-23': '处暑',
    '2030-09-07': '白露', '2030-09-23': '秋分',
    '2030-10-08': '寒露', '2030-10-23': '霜降',
    '2030-11-07': '立冬', '2030-11-22': '小雪',
    '2030-12-07': '大雪', '2030-12-22': '冬至'
};

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 农历计算函数
function getLunarDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    const baseDate = new Date(1900, 0, 31);
    let offset = Math.floor((date - baseDate) / 86400000);
    
    let lunarYear = 1900;
    let daysInLunarYear = 0;
    
    for (let i = 1900; i < 2100 && offset > 0; i++) {
        daysInLunarYear = getLunarYearDays(i);
        offset -= daysInLunarYear;
        lunarYear++;
    }
    
    if (offset < 0) {
        offset += daysInLunarYear;
        lunarYear--;
    }
    
    const lunarYearData = lunarInfo[lunarYear - 1900];
    const leapMonth = lunarYearData & 0xf;
    let isLeap = false;
    let lunarMonth = 1;
    let daysInLunarMonth = 0;
    
    for (let i = 1; i <= 12; i++) {
        daysInLunarMonth = getLunarMonthDays(lunarYear, i);
        if (offset < daysInLunarMonth) break;
        offset -= daysInLunarMonth;
        lunarMonth++;
    }
    
    const lunarDay = offset + 1;
    
    const ganIndex = (lunarYear - 4) % 10;
    const zhiIndex = (lunarYear - 4) % 12;
    
    return {
        lunarYear: lunarYear,
        lunarMonth: lunarMonth,
        lunarDay: lunarDay,
        lunarYearName: `${gan[ganIndex]}${zhi[zhiIndex]}年`,
        lunarMonthName: lunarMonths[lunarMonth - 1] + '月',
        lunarDayName: lunarDays[lunarDay - 1],
        animal: animals[zhiIndex]
    };
}

function getLunarYearDays(year) {
    let sum = 348;
    const info = lunarInfo[year - 1900];
    for (let i = 0x8000; i > 0x8; i >>= 1) {
        sum += (info & i) ? 1 : 0;
    }
    return sum + getLeapDays(year);
}

function getLunarMonthDays(year, month) {
    const info = lunarInfo[year - 1900];
    return (info & (0x10000 >> month)) ? 30 : 29;
}

function getLeapDays(year) {
    const info = lunarInfo[year - 1900];
    if (getLeapMonth(year)) {
        return (info & 0x10000) ? 30 : 29;
    }
    return 0;
}

function getLeapMonth(year) {
    return lunarInfo[year - 1900] & 0xf;
}

// 获取农历年份名称
function getLunarYearName(year) {
    const offset = year - 1900 + 36;
    return `${gan[offset % 10]}${zhi[offset % 12]}年 (${animals[offset % 12]}年)`;
}

// 格式化日期
function formatDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// 获取节假日信息
function getHolidayInfo(date) {
    const dateStr = formatDate(date);
    const info = holidays[dateStr];
    
    if (info) {
        return { isHoliday: info.type === 'holiday', isWorkday: info.type === 'workday', name: info.name };
    }
    
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return { isHoliday: true, isWorkday: false, name: '周末' };
    }
    
    return { isHoliday: false, isWorkday: false, name: '' };
}

// 获取节气
function getSolarTerm(date) {
    const dateStr = formatDate(date);
    const year = date.getFullYear();
    
    const termMap = {
        2025: solarTerms2025,
        2026: solarTerms2026,
        2027: solarTerms2027,
        2028: solarTerms2028,
        2029: solarTerms2029,
        2030: solarTerms2030
    };
    
    if (termMap[year]) {
        return termMap[year][dateStr] || '';
    }
    return '';
}

// 传统节日
function getTraditionalFestival(lunarDate) {
    const festivals = {
        '正月初一': '春节',
        '正月十五': '元宵',
        '五月初五': '端午',
        '七月初七': '七夕',
        '七月十五': '中元',
        '八月十五': '中秋',
        '九月初九': '重阳',
        '腊月初八': '腊八',
        '腊月廿三': '小年',
        '腊月三十': '除夕',
        '腊月廿九': '除夕'
    };
    const key = lunarDate.lunarMonthName + lunarDate.lunarDayName;
    return festivals[key] || '';
}

// 渲染日历
function renderCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    const yearMonth = document.getElementById('yearMonth');
    const lunarYear = document.getElementById('lunarYear');
    
    calendar.innerHTML = '';
    yearMonth.textContent = `${year}年${month + 1}月`;
    lunarYear.textContent = getLunarYearName(year);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    
    // 上月的日期
    for (let i = firstDay - 1; i >= 0; i--) {
        const div = document.createElement('div');
        div.className = 'day day-other-month';
        div.innerHTML = `<span class="day-number">${daysInPrevMonth - i}</span>`;
        calendar.appendChild(div);
    }
    
    // 当月的日期
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const div = document.createElement('div');
        div.className = 'day';
        
        // 今天
        if (date.toDateString() === today.toDateString()) {
            div.classList.add('day-today');
        }
        
        // 节假日
        const holidayInfo = getHolidayInfo(date);
        if (holidayInfo.isHoliday && !div.classList.contains('day-today')) {
            div.classList.add('day-holiday');
        }
        if (holidayInfo.isWorkday) {
            div.classList.add('day-workday');
        }
        
        // 周末
        const dayOfWeek = date.getDay();
        if ((dayOfWeek === 0 || dayOfWeek === 6) && !div.classList.contains('day-today') && !holidayInfo.isHoliday) {
            div.classList.add('day-weekend');
        }
        
        // 农历信息
        const lunarDate = getLunarDate(date);
        const solarTerm = getSolarTerm(date);
        const festival = getTraditionalFestival(lunarDate);
        
        // 显示优先级：节气 > 节日 > 农历日期
        let displayText = solarTerm || festival || holidayInfo.name;
        if (!displayText) {
            displayText = lunarDate.lunarDay === 1 ? lunarDate.lunarMonthName : lunarDate.lunarDayName;
        }
        
        // 农历文字样式
        let lunarClass = 'day-lunar';
        if (solarTerm || festival || holidayInfo.name) {
            lunarClass += ' highlight';
        }
        
        div.innerHTML = `
            <span class="day-number">${day}</span>
            <span class="${lunarClass}">${displayText}</span>
        `;
        
        // 点击事件
        div.addEventListener('click', () => showDayDetail(date, lunarDate, holidayInfo, solarTerm, festival));
        
        calendar.appendChild(div);
    }
    
    // 下月的日期
    const totalCells = firstDay + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        const div = document.createElement('div');
        div.className = 'day day-other-month';
        div.innerHTML = `<span class="day-number">${i}</span>`;
        calendar.appendChild(div);
    }
}

// 显示日期详情
function showDayDetail(date, lunarDate, holidayInfo, solarTerm, festival) {
    const modal = document.getElementById('dayModal');
    const modalBody = document.getElementById('modalBody');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    let html = `
        <div class="modal-date">${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}</div>
        <div class="modal-lunar">农历：${lunarDate.lunarYearName} ${lunarDate.lunarMonthName}${lunarDate.lunarDayName}</div>
        <div class="modal-animal">生肖：${lunarDate.animal}</div>
    `;
    
    if (solarTerm) {
        html += `<div class="modal-term">🌾 24节气：${solarTerm}</div>`;
    }
    
    if (festival) {
        html += `<div class="modal-festival">🎉 传统节日：${festival}</div>`;
    }
    
    if (holidayInfo.name && holidayInfo.name !== '周末') {
        html += `<div class="modal-festival">🏖️ ${holidayInfo.name}</div>`;
    }
    
    if (holidayInfo.isHoliday) {
        html += `<div style="color:#27ae60;font-weight:bold;">✅ 休息日</div>`;
    } else if (holidayInfo.isWorkday) {
        html += `<div style="color:#e74c3c;font-weight:bold;">💼 调休上班</div>`;
    }
    
    modalBody.innerHTML = html;
    modal.style.display = 'block';
}

// 设置事件监听
function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentYear, currentMonth);
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
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
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar(currentYear, currentMonth);
    setupEventListeners();
});
