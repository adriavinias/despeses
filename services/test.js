const { google } = require('googleapis');
const sheets = google.sheets('v4');
const { JWT } = require('google-auth-library');

exports.addDataToSheet = async (req, res) => {
  const credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS); // Cargar las credenciales

  const authClient = new JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
    null
  );

  google.options({ auth: authClient });

  const spreadsheetId = 'TU_SPREADSHEET_ID';
  const range = 'Sheet1!A1'; // Puedes modificar el rango según necesites
  const valueInputOption = 'RAW';
  const values = [
    ['Dato 1', 'Dato 2', 'Dato 3'], // Los valores que quieres agregar
  ];

  const resource = {
    values,
  };

  try {
    const result = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });

    res.status(200).send(result.data);
  } catch (error) {
    console.error('Error al añadir datos:', error);
    res.status(500).send('Error al agregar datos');
  }
};







import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

const AddDataScreen = () => {
  const [response, setResponse] = useState(null);

  const addDataToSheet = async () => {
    try {
      const res = await axios.post('https://REGION-PROJECT_ID.cloudfunctions.net/addDataToSheet');
      setResponse(res.data);
    } catch (error) {
      console.error('Error al agregar datos:', error);
    }
  };

  return (
    <View>
      <Button title="Añadir Datos" onPress={addDataToSheet} />
      {response && <Text>Datos añadidos con éxito: {JSON.stringify(response)}</Text>}
    </View>
  );
};

export default AddDataScreen;

/*--EXPENSES SHEET--*/
// add expense
// get expense
// edit expense
// delete expense

/*-- SUPPLIERS SHEET--*/
// add supplier
// get supplier
// edit supplier
// delete supplier
