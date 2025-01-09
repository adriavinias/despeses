import {GoogleSpreadsheet} from 'google-spreadsheet'

import { JWT } from 'google-auth-library'

import creds from '../config.json'; // the file saved above

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const jwt = new JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: SCOPES,
});

const doc = new GoogleSpreadsheet('11HmdEipTA5PsoN3tza742DMMc6AcO30f995VxaCubbw',  { apiKey: process.env.GOOGLE_API_KEY });

const getData = async () => {
    try {
        const data = await doc.loadInfo();
        console.log(data);
    } catch (error) {
        console.error(error);
    }
}

export default getData;