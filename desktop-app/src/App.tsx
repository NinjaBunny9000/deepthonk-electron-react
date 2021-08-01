// console.clear();

// electron dependencies
import { shell } from 'electron';

// react dependencies
import React, { useState } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  Input,
  InputAdornment,
  withRouter,
} from 'react-router-dom';
import { IconContext } from 'react-icons';
import { AiFillRobot } from 'react-icons/ai';
import { RiSettingsFill, RiUserSettingsFill } from 'react-icons/ri';
import { IoChevronBack } from 'react-icons/io5';
import { HiStatusOnline, HiStatusOffline } from 'react-icons/hi';
import { VscSettings } from 'react-icons/vsc';

// material-ui components
import { sizing } from '@material-ui/system';
import {
  Button,
  ThemeProvider,
  IconButton,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Typography,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { createTheme } from '@material-ui/core/styles';

// local stuffs
import * as helpers from 'local_modules/helpers';
import { Bot } from 'local_modules/bot';
import colors from 'local_modules/colors';
import { HueFacade } from 'local_modules/hue';
import { OverlayCommander } from 'local_modules/overlay';
import * as fs from 'fs';
import secrets from 'secrets';
import { default as cfg } from 'config';

import reactLogoSVG from '../assets/icon.svg';
import './App.global.css';

const Store = require('electron-store');

const store = new Store({
  name: 'deepthonk-settings',
});

interface ConfigState {
  bot: boolean;
}

const configured: ConfigState = {
  bot: false,
};

function validateBotConfig(name: string, channel: string, oauth: string, clientID: string, clientSecret: string) {
  return name && channel && oauth && clientID && clientSecret ? true : false;
}

/** big fat todo list
 *
 *  - fix stupid typescript errors nbd
 *  - make the app a class(?) component
 *  - break out other components into their own functions or files
 *  - move bot connection stuff into it's own file/class
 *  - instantiate teh bot inside the app class so it can interact with bot-level statefulnesstuffs:tm:
 *  - KEYTAR
 *
 */

class BotSettings extends React.Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="top-avi-bar">
          <IconButton component={Link} to="/" replace>
            <IoChevronBack />
          </IconButton>
        </div>
        <h1>bot settings</h1>
      </div>
    );
  }
}

class UserSettings extends React.Component {
  style: any;

  constructor(props: any) {
    super(props);
    this.state = {
      botName: store.get('botName'),
      channel: store.get('channel'),
      twitchOAuth: store.get('twitchOAuth'),
      appClientID: store.get('appClientID'),
      appClientSecret: store.get('appClientSecret'),
    };

    this.style = {
      textInput: {
        margin: '10px',
        color: '#fff',
      },
    };
  }

  handleInputChange = (event: any) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div className="app-wrapper">
        <div className="top-avi-bar">
          <IconButton component={Link} to="/" replace>
            <IoChevronBack />
          </IconButton>
        </div>
        <Box display="flex" flexGrow="1" flexDirection="column" justifyContent="space-between" alignItems="center">
          <Box display="flex" justifySelf="flex-start">
            <h1>user settings</h1>
          </Box>
          <Box display="flex" flexGrow="1" flexDirection="column" alignItems="center" justifyContent="space-around">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" style={{ display: 'flex' }}>
                Bot Identity
              </Typography>
              <Box display="flex" flexDirection="row" width={500} justifyContent="space-between">
                <TextField
                  style={this.style.textInput}
                  id="bot-username"
                  name="botName"
                  defaultValue={store.get('botName')}
                  margin="normal"
                  fullWidth
                  label="Bot Username"
                  helperText="a twitch username"
                  variant="outlined"
                  onChange={this.handleInputChange}
                />
                <TextField
                  style={this.style.textInput}
                  id="channel-to-join"
                  name="channel"
                  defaultValue={store.get('channel')}
                  margin="normal"
                  fullWidth
                  label="Chat Channel"
                  helperText="usually the streamer"
                  variant="outlined"
                  onChange={this.handleInputChange}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" style={{ display: 'flex' }}>
                Twitch Authorization
              </Typography>
              <Box display="flex" flexWrap="wrap" flexDirection="row" justifyContent="center" alignItems="center">
                <Typography variant="subtitle2" style={{ display: 'flex', margin: '4px' }}>
                  visit
                </Typography>
                <Button
                  style={{ display: 'flex' }}
                  size="small"
                  color="primary"
                  onClick={() => shell.openExternal('https://twitchapps.com/tmi/')}>
                  twitchapps.com/tmi
                </Button>
                <Typography variant="subtitle2" style={{ display: 'flex', margin: '4px' }}>
                  and register your bot as an app to generate a token
                </Typography>
              </Box>
              <Box width={400} alignItems="center">
                <TextField
                  style={this.style.textInput}
                  id="twitch-oauth"
                  type="password"
                  name="twitchOAuth"
                  defaultValue={store.get('twitchOAuth')}
                  margin="normal"
                  fullWidth
                  label="Twitch OAuth Key"
                  helperText='include "oauth:"'
                  variant="outlined"
                  onChange={this.handleInputChange}
                />
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h6" style={{ display: 'flex' }}>
                Twitch App Registration
              </Typography>
              <Box display="flex" flexWrap="wrap" flexDirection="row" alignItems="center">
                <Typography variant="subtitle2" style={{ display: 'flex', margin: '4px' }}>
                  visit
                </Typography>
                <Button
                  style={{ display: 'flex' }}
                  size="small"
                  color="primary"
                  onClick={() => shell.openExternal('https://dev.twitch.tv')}>
                  dev.twitch.tv
                </Button>
                <Typography variant="subtitle2" style={{ display: 'flex', margin: '4px' }}>
                  and register your bot as an app
                </Typography>
              </Box>
              <Box display="flex" flexDirection="row" width={600} justifyContent="space-evenly">
                <TextField
                  style={this.style.textInput}
                  id="app-client-id"
                  name="appClientID"
                  defaultValue={store.get('appClientID')}
                  margin="normal"
                  fullWidth
                  label="Client ID"
                  variant="outlined"
                  onChange={this.handleInputChange}
                />
                <TextField
                  style={this.style.textInput}
                  id="app-client-secret"
                  name="appClientSecret"
                  type="password"
                  defaultValue={store.get('appClientSecret')}
                  margin="normal"
                  fullWidth
                  label="Client Secret"
                  variant="outlined"
                  onChange={this.handleInputChange}
                />
              </Box>
            </Box>
          </Box>
          <Box margin="40px">
            <Button
              style={buttonBoi}
              color="primary"
              variant="contained"
              onClick={() => {
                if (
                  validateBotConfig(
                    this.state.botName,
                    this.state.channel,
                    this.state.twitchOAuth,
                    this.state.appClientID,
                    this.state.appClientSecret
                  )
                ) {
                  store.set('botName', this.state.botName);
                  store.set('channel', this.state.channel);
                  store.set('twitchOAuth', this.state.twitchOAuth);
                  store.set('appClientID', this.state.appClientID);
                  store.set('appClientSecret', this.state.appClientSecret);
                  configured.bot = true;
                  // console.log(store.get('botName'));
                  // console.log(store.size);
                  console.log(store.path);
                  <Redirect to="/" />;
                } else {
                  console.log(this.state);
                  console.log('input did not validate');
                  store.openInEditor();
                }
              }}>
              save
            </Button>
          </Box>
        </Box>
      </div>
    );
  }
}

class FeatureSettings extends React.Component {
  render() {
    return (
      <div className="app-wrapper">
        <div className="top-avi-bar">
          <IconButton component={Link} to="/" replace>
            <IoChevronBack />
          </IconButton>
        </div>
        <h1>feature settings</h1>
      </div>
    );
  }
}

function TopAviBar() {
  return (
    <div className="top-avi-bar">
      <IconButton component={Link} to="/user-settings" replace>
        <RiUserSettingsFill />
      </IconButton>
    </div>
  );
}

function BotAviBar() {
  return (
    <div className="bot-avi-bar">
      <IconButton component={Link} to="/bot-settings" replace>
        <VscSettings />
      </IconButton>
      <IconButton component={Link} to="/settings" replace>
        <RiSettingsFill />
      </IconButton>
    </div>
  );
}

const AppHome = () => {
  console.log('AppHome loaded');
  const [myText, setMyText] = useState('My Original Text');
  const [botStatus, setBotStatus] = useState({
    icon: HiStatusOffline,
    text: 'offline',
    color: '#FF6347',
  });

  return (
    <div className="app-wrapper">
      <TopAviBar />
      <div className="content-wrapper vstack" style={{ alignSelf: 'center' }}>
        <div className="vstack" style={{ alignItems: 'center' }}>
          <IconContext.Provider value={{ size: '200px', className: 'deepthonk-logo' }}>
            <AiFillRobot />
          </IconContext.Provider>
          <h1>beep boop, i'm deepthonk 👋</h1>
          <div className="bot-status-area">
            <span className="bot-status-child" style={{ fontFamily: 'monospace' }}>
              status{':// '}
            </span>

            <div className="bot-status-child bot-status-readout">
              <IconContext.Provider
                value={{
                  color: botStatus.color,
                  className: 'bot-status-icon',
                  size: '25px',
                }}>
                <botStatus.icon />
              </IconContext.Provider>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 'bold',
                  fontSize: 'large',
                  color: botStatus.color,
                }}>
                {botStatus.text}
              </span>
            </div>
          </div>
        </div>
        <div className="hstack">
          <Button
            className="button item"
            style={buttonBoi}
            color="primary"
            variant="contained"
            startIcon={<HiStatusOnline />}
            onClick={() => {
              connect();
              setBotStatus({
                icon: HiStatusOnline,
                color: '#98FB98',
                text: 'online',
              });
            }}>
            connect
          </Button>
          <Button
            className="button item"
            style={buttonBoi}
            variant="contained"
            color="secondary"
            startIcon={<HiStatusOffline />}
            onClick={() => {
              disconnect();
              setBotStatus({
                icon: HiStatusOffline,
                color: '#FF6347',
                text: 'offline',
              });
            }}>
            disconnect
          </Button>
        </div>
        <BotTelemetryReadout />
      </div>
      <BotAviBar />
    </div>
  );
};

let bot: Bot;

function connect() {
  if (
    validateBotConfig(
      store.get('botName'),
      store.get('channel'),
      store.get('twitchOAuth'),
      store.get('appClientID'),
      store.get('appClientSecret')
    )
  ) {
    if (bot !== undefined) {
      bot.disconnect();
    }
    bot = new Bot(store.get('botName'), store.get('twitchOAuth'), store.get('channel'));
  } else {
    console.log(store.get('botName'));
    console.log("your bot isn't configured yet");
  }
}

function disconnect() {
  if (bot !== undefined) {
    bot.disconnect();
  } else {
    console.log("the either isn't on or isn't connected yet");
  }
}

// function BotTelemetryReadout() {
//   const [lastCmd, setLastCmd] = useState('none');

//   return <div className='center-div'>Last command sent: { lastCmd }</div>;
// }

class BotTelemetryReadout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastCmd: '< null >',
    };
  }

  render() {
    return (
      <div className="center-div" style={{ marginTop: '15px' }}>
        last command sent: &nbsp;
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: 'yellow',
            fontSize: 'large',
          }}>
          {this.state.lastCmd}
        </span>
      </div>
    );
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#abfdab',
    },
    secondary: {
      main: '#ff7e67',
    },
  },
});

class App extends React.Component {
  render() {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <Switch>
            <Route exact path="/" component={AppHome} />
            <Route path="/settings" component={BotSettings} />
            <Route path="/user-settings" component={UserSettings} />
            <Route path="/bot-settings" component={FeatureSettings} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </ThemeProvider>
      </Router>
    );
  }
}

export default App;

/*********************************************************************************/
/******************************* socket.io server ********************************/
/*********************************************************************************/

/** /!\ big 'ole wip /!\
 *
 *  TODO:
 *  - button to connect and disconnect bot
 *
 */

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
  secure: false,
});
const port = process.env.PORT || 3000;

app.get('/', (req: any, res: any) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket: any) => {
  socket.on('message', (msg: string) => {
    io.emit('message', msg);
    console.log(`msg rcvd: ${msg}`);
  });
});

http.listen(
  {
    port: port,
    host: '0.0.0.0',
  },
  () => {
    console.log(`Socket.IO server running at http://0.0.0.0:${port}/`);
  }
);

// create a poorly-performing facade
const facade = new HueFacade(secrets.hue.ip, secrets.hue.user, cfg.hue.groups.studio);
const overlay = new OverlayCommander(io);

/*********************************************************************************/
/***************************** twitch chat bot stuff *****************************/
/*********************************************************************************/

const classes: any = {
  btnLg: 'button',
};

const buttonBoi: any = {
  boxShadow: '0px 8px 28px -6px rgba(24, 39, 75, 0.12), 0px 18px 88px -4px rgba(24, 39, 75, 0.14)',
  textTransform: 'none',
  // backgroundColor: '#abfdab',
  fontSize: '1.3rem',
  margin: '8px',
  borderRadius: '10px',
  color: '#333333',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
};
