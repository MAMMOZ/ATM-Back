import mongoose from 'mongoose';

const BotSchema = new mongoose.Schema({
  username_bot: { type: String, required: true, unique: true },
  money_pocket: Number,
  money_hand: Number,
  money_bank: Number,
  prev_money_hand: Number,
  prev_money_bank: Number,
  status: { type: Number, default: 1 }, // ค่า default = 1
  last_updated: { type: Date, default: Date.now } // ฟิลด์ใหม่เพื่อเก็บเวลาที่บอทอัปเดตล่าสุด
}, { timestamps: true });

export const Bot = mongoose.model('Bot', BotSchema);




const BotxpSchema = new mongoose.Schema({
    username_bot: { type: String, required: true, unique: true },
    money_pocket: Number,
    money_hand: Number,
    money_bank: Number,
    xp: Number,
    xp_totel: Number,
    status: { type: Number, default: 1 }, // ค่า default = 1
    last_updated: { type: Date, default: Date.now } // ฟิลด์ใหม่เพื่อเก็บเวลาที่บอทอัปเดตล่าสุด
  }, { timestamps: true });
  
  export const Botxp = mongoose.model('Botxp', BotxpSchema);