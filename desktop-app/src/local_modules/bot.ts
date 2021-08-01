import { HueFacade } from './hue';
import { OverlayCommander } from './overlay';
import * as tmi from 'tmi.js';

interface State {
  colorLock: boolean;
  configured: boolean;
  connected: boolean;
}

class Bot {
  commandDefinitions: any = {
    // help: helpCommand,
    // color: color,
    // idea: idea,
    // project: project,
    // drone: drone,
    // font: font,
  };

  state: State;

  client: tmi.Client;

  constructor(user: string, authy: string, channel: string) {

    this.state = {
      colorLock: false,
      configured: false,
      connected: false,
    }

    this.client = new tmi.Client({
      options: { debug: true, messagesLogLevel: 'debug' },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: user,
        password: authy,
      },
      channels: [channel],
    });
    this.connect();
    this.handleJoin();
    this.handleMessages();
  }

  // init() {
  //   // if this.client isn't null, then disconnect it
  //   if (!this.client) {
  //     this.disconnect();
  //   }
  //   this.client = new tmi.Client({
  //     options: { debug: true, messagesLogLevel: 'debug' },
  //     connection: {
  //       reconnect: true,
  //       secure: true,
  //     },
  //     identity: {
  //       username: cfg.twitch.botuser,
  //       password: secrets.twitch.authyboi,
  //     },
  //     channels: [cfg.twitch.channel],
  //   });
  // }

  connect() {
    this.client
      .connect()
      // .then(this.state.connected = true;)
      .catch(err => console.log(err));
  }

  disconnect() {
    this.client.say('deepthonk', 'i think i need a nap... *yawn* (ー。ー) zZzzZzzZzzz... ');
    this.client
      .disconnect()
      // .then((this.state.connected = false))
      .catch(err => console.log(err));
  }

  handleJoin() {
    this.client.on('join', (channel: string, username: string, isSelf: Boolean) => {
      if (!isSelf) {
        return;
      }
      this.client
        .say(channel, "i'm back, baby!")
        .then(data => {
          console.log(`Sent "${data[1]}" to`, data[0].slice(1));
        })
        .catch(err => {
          console.log('[ERR]', err);
        });
    });
  }

  handleMessages() {
    // listen for !commands
    this.client.on('message', (channel: string, tags: any, message: string, self: any) => {
      if (self || !message.startsWith('!')) return; // ignore self and non-commands

      const ctx = new Context(channel, tags, message, this.client); // wrap everything in a Contect class for easy handling

      if (this.commandDefinitions[ctx.cmd]) {
        // TODO save the last command used here
        this.commandDefinitions[ctx.cmd](ctx);
      } else {
        // ignore commands we don't have registered yet
      }
    });
  }
}

// const commandDefinitions: any = {
//   help: helpCommand,
//   color: color,
//   idea: idea,
//   project: project,
//   drone: drone,
//   font: font,
// };

// const botState = {
//   colorLock: false,
//   connected: false,
// };

// connectyboi connects to the twitch chat
// const client = new tmi.Client({
//   options: { debug: true, messagesLogLevel: 'debug' },
//   connection: {
//     reconnect: true,
//     secure: true,
//   },
//   identity: {
//     username: cfg.twitch.botuser,
//     password: secrets.twitch.authyboi,
//   },
//   channels: [cfg.twitch.channel],
// });
// client.connect(); // DON'T ACCIDENTALLY REMOVE THIS

// TODO made this only change the bot's state once a connection is established
// function connect() {
//   if (botState.connected === false) {
//     client
//       .connect()
//       .then((botState.connected = true))
//       .catch(err => console.log(err));
//   } else {
//     console.log('the bot is already connected');
//   }
// }

// // TODO made this only change the bot's state once it's truly offline
// function disconnect() {
//   if (botState.connected === true) {
//     client.say('deepthonk', 'i think i need a nap... *yawn* (ー。ー) zZzzZzzZzzz... ');
//     client
//       .disconnect()
//       .then((botState.connected = false))
//       .catch(err => {});
//   } else {
//     console.log('the bot is already disconnected');
//   }
// }

// client.on('join', (channel, username, isSelf) => {
//   if (!isSelf) {
//     return;
//   }
//   client
//     .say(channel, "i'm back, baby!")
//     .then(data => {
//       console.log(`Sent "${data[1]}" to`, data[0].slice(1));
//     })
//     .catch(err => {
//       console.log('[ERR]', err);
//     });
// });

class Context {
  /** TAGS REFERENCE:
   * badge-info, badges, client-nonce, color, display-name, emotes,
   * flags, id, mod, room-id, subscriber, tmi-sent-ts, turbo,
   * user-id, user-type, emotes-raw, badge-info-raw, badges-raw,
   * username, message-type
   */

  channel: string;
  author: string;
  message: string;
  args: Array<string>;
  tags: Object;
  client: tmi.Client;
  cmd: string;

  constructor(channel: string, tags: any, message: string, client: tmi.Client) {
    this.channel = channel;
    this.author = tags.username;
    this.message = message.slice(1);
    this.args = message.slice(1).split(' ');
    this.tags = tags;
    this.client = client;
    this.cmd = this.args.shift().toLowerCase();
  }
}

// // listen for !commands
// client.on('message', (channel: string, tags: any, message: string, self: any) => {
//   if (self || !message.startsWith('!')) return; // ignore self and non-commands

//   const ctx = new Context(channel, tags, message, client); // wrap everything in a Contect class for easy handling

//   if (commandDefinitions[ctx.cmd]) {
//     // TODO save the last command used here
//     commandDefinitions[ctx.cmd](ctx);
//   } else {
//     // ignore commands we don't have registered yet
//   }
// });

/***************************** command functions *****************************/

// function helpCommand(ctx: Context) {
//   // list commands to the channel
//   const commands = Object.keys(commandDefinitions);
//   const commandList = commands.map(c => `!${c}`);
//   client.say(ctx.channel, `@${ctx.author}, Here are the commands: ${commandList.join(', ')}`);
// }

// function color(ctx: Context) {
//   // helper text stuff
//   const helperText = `@${ctx.author}, please provide a color as an argument (using a name, hexcode, or rgb(r,g,b))`;
//   if (ctx.args.length === 0) {
//     client.say(ctx.channel, helperText);
//     return;
//   } // handle no args

//   // handle color-lock to chill out color changes for a bit
//   // TODO make this a mod-only thing (cuz right now any user can do it)
//   if (ctx.args[0].toLowerCase() === 'lock') {
//     botState.colorLock = !botState.colorLock;
//     client.say(ctx.channel, `@${ctx.author}, colors are now ${botState.colorLock ? 'LOCKED.' : 'UNLOCKED.'}`);
//     return;
//   } else if (botState.colorLock) {
//     // skip the color function if botstate.colorLock is true
//     client.say(ctx.channel, `@${ctx.author}, colors are locked for now.`);
//     return;
//   }

//   const colorRequested = ctx.args[0].toLowerCase();
//   const rgbRegex = /^rgb\(\s*(\d|[1-9]\d|1\d{2}|2[0-5]{2})\s*,\s*(\d|[1-9]\d|1\d{2}|2[0-5]{2})\s*,\s*(\d|[1-9]\d|1\d{2}|2[0-5]{2})\s*\)$/;

//   // look at this beefy boi right here:
//   if (colorRequested.match(/^#[0-9a-f]{6}$/i) || colorRequested.match(/^#[0-9a-f]{3}$/i)) {
//     // it's a hex value
//     let colorRGB = helpers.hexToRGB(colorRequested);
//     let colorXy = helpers.RGBtoXY(...colorRGB);
//     facade.changeColors(colorXy, 255);
//     overlay.changeBorderColor(colorRGB);
//   } else if (colorRequested.match(rgbRegex)) {
//     // it's an rgb value
//     let colorRGB = colorRequested.split('(')[1].split(')')[0].split(',');
//     facade.changeColors(helpers.RGBtoXY(...colorRGB), 255);
//     overlay.changeBorderColor(colorRGB);
//   } else if (colorRequested === 'random') {
//     let randomColor = helpers.hexToRGB(helpers.getRandomColor());
//     console.log(`changing the lights to a random color: ${randomColor}`);
//     facade.changeColors(helpers.RGBtoXY(...randomColor), 255);
//     overlay.changeBorderColor(randomColor);
//     return;
//   } else if (colors[colorRequested]) {
//     // it's a named color
//     if (colorRequested === 'black') {
//       facade.setLightState(false);
//       return;
//     } // handle black
//     let colorRGB = helpers.hexToRGB(colors[colorRequested]);
//     let colorXy = helpers.RGBtoXY(...colorRGB);
//     facade.changeColors(colorXy, 255);
//     overlay.changeBorderColor(colorRGB);
//   } else {
//     // something was wrong with the command
//     client.say(ctx.channel, helperText);
//   }
// }

// function idea(ctx) {
//   const helperText = `@${ctx.author}, do you have an idea? Well use !idea followed by your idea to save for later!`;
//   if (ctx.args.length === 0) {
//     client.say(ctx.channel, helperText);
//     return;
//   }

//   // add the idea to a json file
//   const now = new Date();
//   const dateTime = now.toISOString();
//   const idea = { [dateTime]: ctx.message };
//   const ideas = JSON.parse(fs.readFileSync('src/data/ideas.json', 'utf8'));
//   if (ideas.hasOwnProperty(ctx.author)) {
//     ideas[ctx.author].push(idea);
//   } else {
//     ideas[ctx.author] = [idea];
//   }
//   fs.writeFileSync('src/data/ideas.json', JSON.stringify(ideas));
//   console.log(`${ctx.author} added an idea: ${ctx.message}`);
//   client.say(ctx.channel, `Thanks, @${ctx.author}. I added your idea to The List.`);
// }

// function project(ctx) {
//   if (!checkPerms(ctx)) {
//     return;
//   }

//   const helperText = `@${ctx.author}, you're doin ir wrong!!`;
//   if (ctx.args.length === 0) {
//     client.say(ctx.channel, helperText);
//     return;
//   }

//   const proj = ctx.message;
//   overlay.updateProject(proj);
//   client.say(ctx.channel, `@${ctx.author}, sent the project to the overlay!`);
// }

// function drone(ctx) {
//   // if arg length is 0, send help message
//   if (ctx.args.length === 0) {
//     client.say(
//       ctx.channel,
//       'gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned '
//     );
//     return;
//   } else if (ctx.args.length === 1) {
//     const dronee = ctx.args[0];
//     // check if starts with @, otherwise add it
//     client.say(
//       ctx.channel,
//       `Hey, ${dronee}, GIT DRONED!!!... gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned gitDroned `
//     );
//   } else {
//     // help text
//     const helperText = `@${ctx.author}, you're doin ir wrong!! Format: !drone <user> || !drone`;
//     client.say(ctx.channel, helperText);
//   }
// }

// // DANGER ZONE
// function checkPerms(ctx: Context) {
//   if (ctx.tags.mod || ctx.tags['room-id'] === ctx.tags['user-id']) {
//     return true;
//   } else {
//     console.log("someone wasn't a mod");
//     console.log(`room-id: ${ctx.tags['room-id']}, user-id: ${ctx.tags['user-id']}`);
//     this.client.say(ctx.channel, `@${ctx.author}, you don't have permission to use this command.`);
//     return false;
//   }
// }

// // DANGER IS MY MIDDLE NAME
// function font(ctx: Context) {
//   this.client.say(ctx.channel, `@${ctx.author}, Bun's using JetbrainsMono (Nerd Font) w/Ligatures`);
// }


export { Bot };
