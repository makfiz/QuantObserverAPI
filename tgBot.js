const { Telegraf, session, Scenes, Markup } = require('telegraf');

const { TGTOKEN, WSClients } = require('./config');
const actions = require('./actions');

const bot = new Telegraf(TGTOKEN);

let keys = []
const nodeActions = ["snapshot","reload"]

const userWizard = new Scenes.WizardScene(
  'user-wizard',
  ctx => {
     keys = Object.keys(WSClients);
    if (keys.length == 0) {
      ctx.reply('Nodes offline');
      return ctx.scene.leave();
    } else {
      ctx.replyWithHTML('Nodes menu:', getNodesMenu(keys)).then(message => {
        ctx.session.menuMessageId = message.message_id;
      });
      return ctx.wizard.next();
    }
  },
  ctx => {
    const chosenNode = ctx.callbackQuery?.data;

    if (typeof chosenNode === 'string' && keys.includes(chosenNode)) {
      ctx.session.node = chosenNode;
      ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.session.menuMessageId,
      null,
      'Actions:',
      {
        ...currentNodeMenu(),
        parse_mode: 'HTML',
      }
    );
    return ctx.wizard.next();
    } else return ctx.scene.reenter()
  
    
  },
  ctx => {
    const chosenAction = ctx.callbackQuery?.data;
    if (typeof chosenAction === 'string' && nodeActions.includes(chosenAction)) {
      ctx.telegram.editMessageText(
        ctx.chat.id,
        ctx.session.menuMessageId,
        null,
        `You selected action: ${chosenAction} on node ${ctx.session.node}`
      );
      actions.sendSnapshotAction(ctx.session.node);
      return ctx.scene.leave();
    } else  ctx.scene.reenter()
    
  }
);

userWizard.on('error', (ctx, error) => {
  console.error('Ошибка в сцене user-wizard:', error);
  ctx.reply('Произошла ошибка во время выполнения сцены. Попробуйте снова.');
});

const stage = new Scenes.Stage([userWizard]);

bot.use(session());
bot.use(stage.middleware());
bot.command('menu', Scenes.Stage.enter('user-wizard'));

function getNodesMenu(nodes) {
  const buttons = nodes.map(node => Markup.button.callback(node, node));
  return Markup.inlineKeyboard(buttons, { columns: 3 });
}

function currentNodeMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('Snapshot', 'snapshot'),
      Markup.button.callback('Reload', 'reload'),
    ],
    { columns: 2 }
  );
}

module.exports = bot;
