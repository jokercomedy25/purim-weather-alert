# Purim Weather & Alert V1.1 — Free-First Architecture

ต้นแบบพร้อม Deploy สำหรับ `jupurim.com/alert` โดยเน้น **ไม่เพิ่มค่า API รายเดือน** ใน V1.1

## แหล่งข้อมูล

- **MET Norway Locationforecast** — พยากรณ์อากาศทั่วโลก, ฟรี, อนุญาตเชิงพาณิชย์ภายใต้ CC BY 4.0, ต้องให้เครดิต และต้องใส่ User-Agent ที่ระบุตัวตนของบริการ
- **TMD Warning RSS** — ใช้แสดงประกาศเตือนภัยทางการ โดยแยกจาก Purim Risk ให้ชัดเจน
- **OpenStreetMap Nominatim** — ใช้ค้นหาพื้นที่แบบผู้ใช้กดค้นหาเองเท่านั้น, ห้าม autocomplete, จำกัดการใช้งานและควร cache ผลลัพธ์
- **ThaiWater** — เตรียม Water Data Adapter (ตัวเชื่อมข้อมูลน้ำ) สำหรับ `/Rainfall` และ `/Runoff`; ยังไม่เปิดเป็น Live ใน V1.1 จนกว่าจะยืนยัน Endpoint และเงื่อนไขการเผยแพร่

## Production Gate ที่ต้องผ่านก่อนเปิดจริง

1. ตรวจและยืนยันสิทธิ์ TMD สำหรับการนำ Feed/ข้อมูลมาแสดงภายใต้แบรนด์ JuPurim/Purim หากอาจถูกตีความว่าเกี่ยวข้องกับการใช้เชิงพาณิชย์
2. ทดสอบ TMD RSS ว่ารูปแบบ XML ปัจจุบันตรงกับ parser
3. ตั้ง Cache (เก็บข้อมูลชั่วคราว) ลดการเรียก MET Norway และ Nominatim ซ้ำ
4. ตั้ง Monitoring (ระบบตรวจสถานะ) สำหรับ `/api/weather`, `/api/tmd-warning`, `/api/geocode`
5. เพิ่ม Rate Limit (จำกัดความถี่) ให้ `/api/geocode` เพื่อไม่ให้เกินนโยบาย Nominatim

## โครงไฟล์

- `index.html` — หน้าเว็บ V1.1
- `api/weather.js` — Proxy (ตัวกลาง) ไป MET Norway พร้อม User-Agent และ Cache
- `api/geocode.js` — Proxy ไป Nominatim, ค้นหาเฉพาะประเทศไทย
- `api/tmd-warning.js` — Proxy ไป TMD Warning RSS
- `api/health.js` — Health Check (ตรวจสถานะระบบ)
- `vercel.json` — ตั้งค่า Header พื้นฐาน

## การ Deploy

วางโฟลเดอร์นี้เป็นโปรเจกต์บนแพลตฟอร์มที่รองรับ Serverless Function (ฟังก์ชันฝั่งเซิร์ฟเวอร์) แบบ Node.js แล้วผูก path `/alert` หรือ deploy เป็นโปรเจกต์ย่อยก่อนทดสอบ จากนั้นค่อยเชื่อมกับ `jupurim.com/alert`.

## หลักความปลอดภัยของข้อมูล

- AI ไม่มีสิทธิ์สร้างตัวเลขอากาศ ระดับน้ำ หรือประกาศเตือนเอง
- Purim Risk ต้องแสดงว่าเป็นการประเมินจากระบบ ไม่ใช่ประกาศทางการ
- เมื่อมีประกาศราชการ ให้แสดงแหล่งที่มาและลิงก์ต้นทาง
