// googleSheetsService.js
import { google } from 'googleapis';

// Configuración de autenticación y Google Sheets API
const setupGoogleSheets = async () => {
    const auth = new google.auth.GoogleAuth({
        keyFile:'/home/discosparadiso/Documentos/projects/js/despeses/config.json',
        scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
    })

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });

  return sheets;
};

export default setupGoogleSheets;
