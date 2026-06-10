/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Buffer } from 'buffer';
import { initDb } from './src/db/db';

initDb();
global.Buffer = global.Buffer || Buffer;

AppRegistry.registerComponent(appName, () => App);
