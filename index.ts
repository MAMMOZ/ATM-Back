// index.ts
import { Elysia, t } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import mongoose from 'mongoose';
import { Bot, Botxp } from './models/Bot';
import { cors } from '@elysiajs/cors';

await mongoose.connect('mongodb://cm9ny1d8w0009bsmn30yr5sa0:faGztd5abq30OfuOiJIBHm1x@161.246.127.24:9018/?readPreference=primary&ssl=false'); // แก้ตาม Mongo URI

const app = new Elysia();
app.use(cors());

app.use(swagger({
    path: '/docs', // เรียกผ่าน http://localhost:3000/swagger
    documentation: {
      info: {
        title: 'Roblox Bot API',
        version: '1.0.0'
      }
    }
  }));

app.post('/addbot', async ({ body }) => {
    const { username_bot, money_pocket, money_hand, money_bank, status } = body;
  
    if (!username_bot) {
      return { success: false, message: 'username_bot is required' };
    }
  
    const existingBot = await Bot.findOne({ username_bot });
  
    let updateData = {
      money_pocket,
      money_hand,
      money_bank,
      status,
    };
  
    // ถ้ามี bot นี้อยู่แล้ว ให้เก็บค่าเดิมลง prev_*
    if (existingBot) {
      updateData = {
        ...updateData,
        prev_money_hand: existingBot.money_hand || 0,
        prev_money_bank: existingBot.money_bank || 0,
        status : existingBot.status || 1,
        last_updated: new Date() // อัปเดตเวลาที่บอทอัปเดตล่าสุด
      };
    }
  
    const updatedBot = await Bot.findOneAndUpdate(
      { username_bot },
      updateData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  
    return { success: true, bot: updatedBot };
  }, {
    body: t.Object({
        username_bot: t.String(),
        money_pocket: t.Number(),
        money_hand: t.Number(),
        money_bank: t.Number(),
        status: t.Number()
      }),
  });
  


  app.get('/get', async () => {
    const bots = await Bot.find();
  
    let pocketMoney = 0;
    let bankMoney = 0;
    let sessionEarnings = 0;
    let totalHourlyRate = 0;
    const currentTime = new Date();
  
    // ตรวจสอบและอัปเดต status ของบอทที่ไม่ได้ส่งข้อมูลมาใน 6 นาที
    bots.forEach(bot => {
      const lastUpdated = new Date(bot.last_updated); // สมมติว่า `last_updated` คือเวลาที่บอทส่งข้อมูลล่าสุด
      const diffMinutes = (currentTime - lastUpdated) / 60000; // คำนวณเวลาเป็นนาที
  
      if (diffMinutes > 6) {
        bot.status = 0; // อัปเดตสถานะเป็น 0 ถ้าเกิน 6 นาที
        bot.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      }
    });
  
    const data = bots.map(bot => {
      const hourly_rate = (bot.money_hand || 0) + (bot.money_bank || 0);
      const prev_hand = bot.prev_money_hand || 0;
      const prev_bank = bot.prev_money_bank || 0;
      const change = (bot.money_hand - prev_hand) + (bot.money_bank - prev_bank);
  
      pocketMoney += bot.money_pocket || 0;
      bankMoney += bot.money_bank || 0;
      sessionEarnings += change;
      totalHourlyRate += hourly_rate;
  
      return {
        username: bot.username_bot,
        money_pocket: bot.money_pocket,
        money_hand: bot.money_hand,
        money_bank: bot.money_bank,
        hourly_rate,
        change,
        status: bot.status
      };
    });
  
    const avgHourlyRate = bots.length > 0 ? totalHourlyRate / bots.length : 0;
  
    return {
      pocketMoney,
      bankMoney,
      grandTotal: pocketMoney + bankMoney,
      sessionEarnings,
      avgHourlyRate,
      data
    };
  });



  app.post('/addbotxp', async ({ body }) => {
    const { username_bot, money_pocket, money_hand, money_bank, xp, xp_totel, status } = body;
  
    if (!username_bot) {
      return { success: false, message: 'username_bot is required' };
    }
  
    const existingBot = await Botxp.findOne({ username_bot });
  
    let updateData = {
      money_pocket,
      money_hand,
      money_bank,
      xp,
      xp_totel,
      status,
    };
  
    // ถ้ามี bot นี้อยู่แล้ว ให้เก็บค่าเดิมลง prev_*
    if (existingBot) {
      updateData = {
        ...updateData
      };
    }
  
    return { success: true, bot: updateData };
  }, {
    body: t.Object({
        username_bot: t.String(),
        money_pocket: t.Number(),
        money_hand: t.Number(),
        money_bank: t.Number(),
        xp: t.Number(),
        xp_totel: t.Number(),
        status: t.Number()
      }),
  });



  app.get('/getxp', async () => {
    const bots = await Botxp.find();
  
    let bankMoney = 0;
    let sessionEarnings = 0;
    let totalHourlyRate = 0;
    const currentTime = new Date();
  
    // ตรวจสอบและอัปเดต status ของบอทที่ไม่ได้ส่งข้อมูลมาใน 6 นาที
    bots.forEach(bot => {
      const lastUpdated = new Date(bot.last_updated); // สมมติว่า `last_updated` คือเวลาที่บอทส่งข้อมูลล่าสุด
      const diffMinutes = (currentTime - lastUpdated) / 60000; // คำนวณเวลาเป็นนาที
  
      if (diffMinutes > 6) {
        bot.status = 0; // อัปเดตสถานะเป็น 0 ถ้าเกิน 6 นาที
        bot.save(); // บันทึกการเปลี่ยนแปลงในฐานข้อมูล
      }
    });
  
    const data = bots.map(bot => {
      const hourly_rate = (bot.money_hand || 0) + (bot.money_bank || 0);
      const prev_hand = bot.prev_money_hand || 0;
      const prev_bank = bot.prev_money_bank || 0;
      const change = (bot.money_hand - prev_hand) + (bot.money_bank - prev_bank);
  
      bankMoney += bot.money_bank || 0;
      sessionEarnings += change;
      totalHourlyRate += hourly_rate;
  
      return {
        username: bot.username_bot,
        xp: bot.xp,
        xp_totel: bot.xp_totel,
        money_hand: bot.money_hand,
        money_bank: bot.money_bank,
        hourly_rate,
        change,
        status: bot.status
      };
    });
  
    const avgHourlyRate = bots.length > 0 ? totalHourlyRate / bots.length : 0;
  
    return {
      bankMoney,
      sessionEarnings,
      avgHourlyRate,
      data
    };
  });
  

app.listen(3000);

console.log('🔥 Elysia server running on http://localhost:3000');
