const fs = require("fs");
const cron = require("node-cron");
const axios = require("axios");
const request = require("request")
const con = require("./connection_mysql");
const { Telegraf } = require("telegraf");
const Extra = require("telegraf/extra");
const Markup = require("telegraf/markup");
const group_id = -1001493439529;
const express = require('express')
//*********************************************** */
let token = "1120967273:AAFK9JAAE-nuZVyPoFIeVcWTBo3oT-sLniw";
const bot = new Telegraf(token);
bot.use(Telegraf.log());

//***************************************************** */
let year = new Date().getFullYear();
let day = ("0" + new Date().getDate()).slice(-2);
let month = ("0" + (new Date().getMonth() + 1)).slice(-2);
let today = day + "/" + month;
var login = null;
var password = null;
var state = null;
var tokenX = null;

/****************************************************** */

bot.start(ctx => {
  // /start
  cron.schedule("59 23 * * *", () => {
    con.getRowUser(function(result) {
      let ans = result.find(element => element.date == today);
      if (ans) {
        console.log(ans);
        ctx.reply(`Bugun @${ans.username(ans.name)} ni tu'gilgan kuni.`);
      } else {
        console.log(ans);
        ctx.reply("Bugun birorta ham tugilgan kun yoq ;((");
      }
    });
  });
});

//************************************************************* */
let add = null;
let birthdy = null;
let name = null;
let date = null;
let json = [];

//*************************************************************** */

bot.command("menu", ({ reply }) => {
  return reply(
    "Menu",
    Markup.keyboard([
      ["/contact"], // Row1 with 2 buttons
      ["/about"],
      ['/covid']
      // Row1 with 2 buttons
    ])
      .oneTime()
      .resize()
      .extra()
  );
});

bot.hears("/contact", ctx => ctx.reply("@lion9636"));
bot.hears("/about", ctx =>
  ctx.reply(
    "This bot serves as a reminder of birthday  for  My day group.First, Type something, Type your name and birthday date, of course in the bot @tanlovv2020bot. That is all 😊"
  )
);
 

bot.hears('/covid',(ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Hello, I am reporter of covid',
  {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard : [
        [
          {text : "click me" , url : 'www.google.com'},
          {text : "click me" , url : 'www.google.com'}
        ],
        [
          {text : "click" , callback_data : 'called_click'},
          {text : "click 2 " , callback_data : 'called click 2'}
        ],
      ]
    }
  
  })
})

bot.action('called_click' , (ctx) => {
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id , 'something',{
    reply_markup : {
      inline_keyboard : [
        [{ text : 'some thing', callback_data : 'click_text'}],
        [{ text : 'some thing2', callback_data : 'uchunchi button iline'}]
      ]
    }
  })
})

bot.action('click_text' , (ctx) => {
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id , 'something',{
    reply_markup : {
      inline_keyboard : [
        [{ text : 'some thing', callback_data : 'click_text2'},{ text : 'some thing', callback_data : 'click_text'}],
        [{ text : 'Back', callback_data : 'home'}]
      ]
    }
  })
})

bot.action('home', (ctx) => {
  ctx.deleteMessage()
  ctx.telegram.sendMessage(ctx.chat.id , 'something',{
    reply_markup : {
      inline_keyboard : [
        [
          {text : "click me" , url : 'www.google.com'},
          {text : "click me" , url : 'www.google.com'}
        ],
        [
          {text : "click" , callback_data : 'called_click'},
          {text : "click 2 " , callback_data : 'called click 2'}
        ],
      ]
    }
  })
})



bot.on("message", ctx => {
  if(ctx.message.chat.type == "private" && ctx.message.text == '/add'){
    add = '/add'
  }
  if (ctx.message.chat.type == "private" && add == '/add' ) {
    // console.log(ctx.message)
    if (birthdy == null) {
      birthdy = "name";
      ctx.reply("1. Iltimos Ismingizni kiriting");
      return;
    }

    if (birthdy == "name") {
      name = ctx.message.text;
      birthdy = "date";
      ctx.reply("2. Iltimos tug'ilgan sana ni kiriting. Format : 19.09.1996. ");
      return;
    }
    if ((birthdy = "date")) {
      birthdy = null;
      date = ctx.message.text.split(".");

      if (
        date[0].length > 0 &&
        date[0].length < 3 &&
        (date[1].length > 0 && date[1].length < 3) &&
        date[2].length == 4
      ) {
        let arrayDate = [];
        arrayDate.push(date[0]);
        arrayDate.push(date[1]);
        json.push({
          name: name,
          date: arrayDate.join("/"),
          username: ctx.message.chat.username,
          text: "hello"
        });
        var stream = fs.createWriteStream(name + "-" + date);
        stream.once("open", function() {
          stream.write("\n" + JSON.stringify(json));
          stream.end();
        });
        con.insertUser(json, function(res) {
          // console.log(res)
        });
        // console.log(json)
        ctx.reply(
          `3. Sizning Ismingiz va Tug\'ilgan san muvofaqiyatli saqlandi \n ${name +
            " " +
            date.join("/")} ✅`
        );
      } else {
        ctx.reply(
          "❌ Ma'umot kiritishda xatolik. Format : 19.09.1996, bo'lishi kerak. Malumotlaringiz o'chdi. Qaytadan urinib ko'ring"
        );
      }
    }
  }
});

bot.launch();
