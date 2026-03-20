#!/usr/bin/env python3
"""
自动更新节假日数据脚本
从 chinese-days npm 包获取最新数据
"""

import json
import re
import requests
from pathlib import Path

def fetch_npm_data():
    """从 npm 获取 chinese-days 最新数据"""
    url = "https://cdn.jsdelivr.net/npm/chinese-days/dist/chinese-days.json"
    try:
        r = requests.get(url, timeout=30)
        return r.json()
    except Exception as e:
        print(f"获取数据失败: {e}")
        return None

def update_app_js(data):
    """更新 app.js 文件"""
    js_path = Path("app.js")
    if not js_path.exists():
        print("app.js 不存在")
        return False
    
    content = js_path.read_text(encoding='utf-8')
    
    # 按年份分组
    years_data = {}
    for date_str, info in data.items():
        year = date_str[:4]
        if year not in years_data:
            years_data[year] = {}
        years_data[year][date_str] = info
    
    # 构建新的节假日对象
    new_holidays = "const holidays = {\n"
    
    for year in sorted(years_data.keys()):
        if int(year) < 2024:
            continue
            
        year_data = years_data[year]
        new_holidays += f"    // {year}年\n"
        
        # 按节日名称分组
        by_name = {}
        for date_str, info in sorted(year_data.items()):
            name = info.get('name', '')
            typ = info.get('type', 'holiday')
            if name not in by_name:
                by_name[name] = []
            by_name[name].append((date_str, typ))
        
        for name, dates in by_name.items():
            new_holidays += f"    // {name}\n"
            for d, typ in dates:
                new_holidays += f"    '{d}': {{ type: '{typ}', name: '{name}' }},\n"
    
    new_holidays += "};"
    
    # 替换原有的 holidays 定义
    pattern = r'const holidays = \{[\s\S]*?\};'
    if re.search(pattern, content):
        content = re.sub(pattern, new_holidays, content)
        js_path.write_text(content, encoding='utf-8')
        print(f"✅ 已更新节假日数据，包含 {len(years_data)} 个年份")
        return True
    else:
        print("❌ 无法找到 holidays 定义")
        return False

def main():
    print("🚀 开始更新节假日数据...")
    
    data = fetch_npm_data()
    if data:
        if update_app_js(data):
            print("✅ 更新成功！")
        else:
            print("❌ 更新失败")
    else:
        print("❌ 获取数据失败")

if __name__ == '__main__':
    main()
