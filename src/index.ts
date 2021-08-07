import * as sourceMapSupport from 'source-map-support';
sourceMapSupport.install()

import dotenv from 'dotenv'
dotenv.config()

process.env.GOOGLE_APPLICATION_CREDENTIALS = "google_credentials.json"

import Main from './Main';
const main = new Main()
main.init()