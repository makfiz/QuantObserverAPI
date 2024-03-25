const { Telegraf, session, Scenes, Markup } = require('telegraf');

const { TGTOKEN, WSClients } = require('./config');
const actions = require('./actions');

const bot = new Telegraf(TGTOKEN);

// const userWizard = new Scenes.WizardScene(
//   'user-wizard',
//   ctx => {
//     ctx.reply('What is your name?');

//     //Necessary for store the input
//     ctx.scene.session.user = {};

//     //Store the telegram user id
//     ctx.scene.session.user.userId = ctx.from.id;
//     return ctx.wizard.next();
//   },
//   ctx => {
//     //Validate the name
//     if (ctx.message.text.length < 1 || ctx.message.text.length > 12) {
//       return ctx.reply('Name entered has an invalid length!');
//     }

//     //Store the entered name
//     ctx.scene.session.user.name = ctx.message.text;
//     ctx.reply('What is your last name?');
//     return ctx.wizard.next();
//   },
//   async ctx => {
//     //Validate last name
//     if (ctx.message.text.length > 30) {
//       return ctx.reply('Last name has an invalid length');
//     }

//     ctx.scene.session.user.lastName = ctx.message.text;
//     console.log(ctx.scene.session.user);
//     //Store the user in a separate controller
//     // userController.StoreUser(ctx.scene.session.user);
//     return ctx.scene.leave(); //<- Leaving a scene will clear the session automatically
//   }
// );

const userWizard = new Scenes.WizardScene(
  'user-wizard',
  ctx => {
    const keys = Object.keys(WSClients);
    if (keys.length == 0) {
      ctx.reply('Nodes offline');
    } else {
      ctx.replyWithHTML('Nodes menu:', getNodesMenu(keys))
        .then((message) => {
          // Сохраняем сообщение для редактирования
          ctx.session.menuMessageId = message.message_id;
        });
    }
    return ctx.wizard.next();
  },
  ctx => {
    const chosenNode = ctx.callbackQuery.data;
    ctx.session.node = chosenNode;
    ctx.telegram.editMessageText(ctx.chat.id, ctx.session.menuMessageId, null, 'Actions:', {
      ...currentNodeMenu(),
      parse_mode: 'HTML'
    });
    return ctx.wizard.next();
  },
  ctx => {
    const chosenAction = ctx.callbackQuery.data;
    ctx.telegram.editMessageText(ctx.chat.id, ctx.session.menuMessageId, null, `You selected action: ${chosenAction} on node ${ctx.session.node}`);
    actions.sendSnapshotAction(ctx.session.node)
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([userWizard]);

bot.use(session());
bot.use(stage.middleware());
bot.command('online', Scenes.Stage.enter('user-wizard'));

// bot.command('online', async ctx => {
//   const keys = Object.keys(WSClients);
//   if (keys.length == 0) {
//     await ctx.reply('nodes offline');
//   } else {
//     // const replyMessage = keys.join('\n');
//     await ctx.replyWithHTML(
//       'Nodes Menu',
//       getNodesMenu(keys)
//     );
//   }

// });

// bot.action(/.*/, (ctx) => {
//   const chosenNode = ctx.match[0];
//   const keys = Object.keys(WSClients);
//   if(keys.includes(chosenNode)) {
//     ctx.reply(`Выбран узел: ${chosenNode}`);
//   }

// });

function getNodesMenu(nodes) {
  const buttons = nodes.map(node => Markup.button.callback(node, node));
  return Markup.inlineKeyboard(buttons, { columns: 3 });
}

function currentNodeMenu() {
  return Markup.inlineKeyboard(
    [Markup.button.callback('Snapshot', 'snapshot'), Markup.button.callback('Reload', 'reload')],
    { columns: 2 }
  );
}

module.exports = bot;
