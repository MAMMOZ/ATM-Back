// models/Bot.ts
import mongoose from 'mongoose';

const BotSchema = new mongoose.Schema({
  username_bot: { type: String, required: true, unique: true },
  money_pocket: Number,
  money_hand: Number,
  money_bank: Number,
  prev_money_hand: Number,
  prev_money_bank: Number,
  status: Number,
}, { timestamps: true });

export const Bot = mongoose.model('Bot', BotSchema);
