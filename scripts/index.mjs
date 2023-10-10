const settingsFilePath = './src/settings.json';

import { Settings } from './Settings.mjs';
const settings = new Settings(settingsFilePath);

import { WebSocketControl } from './WebSocketControl.mjs';
const wsControl = new WebSocketControl(settings.config);