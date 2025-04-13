require("dotenv").config(); 

import QuestionModel from "../models/Question";
import connectDB from "../config/db";

const questions = [
   {
      "question": "How’s your mind feeling today?",
      "sort_order":1,
      "options": [
        { "text": "🌞 Bright and balanced", "weightage": 0 },
        { "text": "🌊 Going with the flow", "weightage": 0 },
        { "text": "🌪️ A little stormy", "weightage": 0 },
        { "text": "🤯 Chaos everywhere!", "weightage": 0 }
      ]
    },
    {
      "question": "What’s your go-to way to destress?",
      "sort_order":2,
      "options": [
        { "text": "🎵 Music is my therapy", "weightage": 0 },
        { "text": "🏋️ Sweating it out at the gym", "weightage": 0 },
        { "text": "🍕 Comfort food and binge-watching", "weightage": 0 },
        { "text": "😴 Sleeping it off", "weightage": 0 }
      ]
    },
    {
      "question": "What’s been on your mind lately?",
      "sort_order":3,
      "options": [
        { "text": "💼 Work stress is real", "weightage": 0 },
        { "text": "💔 Relationships feel complicated", "weightage": 0 },
        { "text": "💤 Just need some good sleep", "weightage": 0 },
        { "text": "🤔 No idea, but I could use some clarity", "weightage": 0 }
      ]
    },
    {
      "question": "If your mental health had a theme song, what would it be?",
      "sort_order":4,
      "options": [
        { "text": "🎸 'Don't Worry, Be Happy' – Bobby McFerrin", "weightage": 0 },
        { "text": "🎭 'Mad World' – Gary Jules", "weightage": 0 },
        { "text": "🏃 'Survivor' – Destiny’s Child", "weightage": 0 },
        { "text": "🤷‍♂️ 'Wake Me Up' – Avicii", "weightage": 0 }
      ]
    },
    {
      "question": "What kind of support are you looking for?",
      "sort_order":5,
      "options": [
        { "text": "🗣️ A quick boost of motivation", "weightage": 0 },
        { "text": "🧘 Deep emotional healing", "weightage": 0 },
        { "text": "💡 Practical tips to manage stress", "weightage": 0 },
        { "text": "❓ Not sure, just exploring", "weightage": 0 }
      ]
    },
  {
    "question": "How are you feeling today?",
     "sort_order":6,
      "options": [
        { "text": "😊 Pretty good, just exploring", "weightage": 25 },
        { "text": "😌 Okay, but could be better", "weightage": 15 },
        { "text": "😕 Feeling a bit low", "weightage": 10 },
        { "text": "😞 Not great, to be honest", "weightage": 5 }
      ]
    },
    {
      "question": "What’s your biggest struggle right now?",
      "sort_order":7,
      "options": [
        { "text": "💪 Nothing major, just day-to-day stress", "weightage": 25 },
        { "text": "🏃‍♂️ Balancing work/study & personal life", "weightage": 15 },
        { "text": "😩 Overthinking & feeling anxious", "weightage": 10 },
        { "text": "😞 Feeling lost & overwhelmed", "weightage": 5 }
      ]
    },
    {
      "question": "How well are you sleeping these days?",
      "sort_order":8,
      "options": [
        { "text": "😴 Like a baby, 7-8 hours of rest", "weightage": 25 },
        { "text": "😌 Mostly fine, but some restless nights", "weightage": 15 },
        { "text": "😕 I struggle to fall asleep often", "weightage": 10 },
        { "text": "😫 I barely get any rest", "weightage": 5 }
      ]
    },
    {
      "question": "How do you usually cope with stress?",
      "sort_order":9,
      "options": [
        { "text": "🏃‍♀️ Exercise, hobbies, or talking to friends", "weightage": 25 },
        { "text": "📖 Reading, journaling, or self-care", "weightage": 15 },
        { "text": "🍔 Scrolling, binge-watching, or comfort food", "weightage": 10 },
        { "text": "😞 I don’t really cope well", "weightage": 5 }
      ]
    },
    {
      "question": "If something upsets you, how long does it take to feel better?",
      "sort_order":10,
      "options": [
        { "text": "⏳ A few minutes, I move on fast", "weightage": 25 },
        { "text": "⌛ A few hours, but I manage", "weightage": 15 },
        { "text": "🕰️ A few days, it lingers a bit", "weightage": 10 },
        { "text": "🗓️ A long time, I struggle to let go", "weightage": 5 }
      ]
    }
   
];

const insertQuestions = async () => {
  try {
    await connectDB();
    const existing = await QuestionModel.find();
    if (existing.length > 0) {
      console.log("Questions already exist. Skipping insertion.");
      return;
    }

    await QuestionModel.insertMany(questions);
    console.log("Questions inserted successfully!");
  } catch (err) {
    console.error("Error inserting questions:", err);
  } finally {
    process.exit();
  }
};

insertQuestions();
