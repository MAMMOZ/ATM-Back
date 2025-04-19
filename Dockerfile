# ใช้ Bun official image
FROM oven/bun:latest

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปยัง container
COPY . .

# ติดตั้ง dependencies
RUN bun install

# ระบุพอร์ตที่แอปใช้งาน (ถ้าใช้ 3000)
EXPOSE 3000

# สั่งรันแอป
CMD ["bun", "start"]
