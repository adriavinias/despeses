import {google} from 'googleapis'
import 'dotenv/config'
import setupGoogleSheets from './setUpGoogleService.js'

export async function getData(sheets) {
  const range = `${process.env.GOOGLE_SPREADSHEET_SHEET_NAME}!${process.env.GOOGLE_SPREADSHEET_SHEET_RANGE}`
  const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  })

  const rows = response.data.values

  return rows
}

async function appendData() {
  const auth = new google.auth.GoogleAuth({
    keyFile:'/home/discosparadiso/Documentos/projects/js/despeses/config.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  })
  
  const sheets = google.sheets({
      version:'v4',
      auth
  })

  try {
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;  // Reemplaza con el ID de tu hoja de cálculo
    const range = 'Despeses!A1';  // La celda donde comenzarás a agregar datos, puede ser cualquier celda
    const valueInputOption = 'RAW';  // 'RAW' para agregar los datos tal como están
    const values = [
      ["Hola", "Dato", "Aquí"],  // Los datos que quieres agregar
    ];

    const resource = {
      values,
    };

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });

    console.log(`Datos añadidos: ${response.data.updates.updatedCells} celdas actualizadas`);
  } catch (error) {
    console.error('Error al añadir datos:', error);
  }
}

appendData();



getData()
.then(data => console.log(data))
.catch(error => console.error(error))
