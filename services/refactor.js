import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Picker, Alert } from 'react-native';
import { google } from 'googleapis';

// Configuración de la API
const SPREADSHEET_ID = 'TU_SHEET_ID'; // Reemplaza con el ID de tu hoja
const RANGE_SUPPLIERS = 'Suppliers!A:A'; // Rango de proveedores
const RANGE_EXPENSES = 'Expenses!A:D'; // Rango de gastos

// Autenticación con Google API
const auth = new google.auth.GoogleAuth({
  keyFile: 'ruta/a/tu/credencial.json', // Cambia esta ruta por tu archivo de credenciales
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

const App = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [expense, setExpense] = useState({ date: '', amount: '', category: '' });

  // Función para obtener la lista de suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_SUPPLIERS,
      });

      const fetchedSuppliers = response.data.values ? response.data.values.flat() : [];
      setSuppliers(fetchedSuppliers);
    } catch (error) {
      console.error('Error al obtener suppliers:', error);
      Alert.alert('Error', 'No se pudo cargar la lista de proveedores.');
    }
  };

  // Función para agregar un nuevo supplier
  const addSupplier = async (supplier) => {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_SUPPLIERS,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[supplier]],
        },
      });

      console.log('Proveedor agregado:', supplier);
      setSuppliers((prev) => [...prev, supplier]); // Actualiza la lista local
    } catch (error) {
      console.error('Error al agregar supplier:', error);
      Alert.alert('Error', 'No se pudo agregar el proveedor.');
    }
  };

  // Función para agregar un gasto
  const addExpense = async (expense) => {
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE_EXPENSES,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[...expense]],
        },
      });

      console.log('Gasto agregado:', expense);
      Alert.alert('Éxito', 'Gasto agregado correctamente.');
      setExpense({ date: '', amount: '', category: '' }); // Reinicia los campos del formulario
    } catch (error) {
      console.error('Error al agregar gasto:', error);
      Alert.alert('Error', 'No se pudo agregar el gasto.');
    }
  };

  // Función manejadora del flujo de agregar gasto
  const handleAddExpense = async () => {
    if (!selectedSupplier && !newSupplier) {
      Alert.alert('Error', 'Debes seleccionar o agregar un proveedor.');
      return;
    }

    // Si hay un nuevo supplier, agrégalo primero
    if (newSupplier) {
      await addSupplier(newSupplier);
      setSelectedSupplier(newSupplier); // Selecciona automáticamente el nuevo supplier
      setNewSupplier('');
    }

    // Agregar el gasto
    const expenseData = [
      expense.date,
      expense.amount,
      selectedSupplier,
      expense.category,
    ];
    await addExpense(expenseData);
  };

  // Cargar la lista de suppliers al iniciar la app
  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Fecha:</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        value={expense.date}
        onChangeText={(text) => setExpense({ ...expense, date: text })}
      />

      <Text>Monto:</Text>
      <TextInput
        placeholder="Monto"
        keyboardType="numeric"
        value={expense.amount}
        onChangeText={(text) => setExpense({ ...expense, amount: text })}
      />

      <Text>Categoría:</Text>
      <TextInput
        placeholder="Categoría"
        value={expense.category}
        onChangeText={(text) => setExpense({ ...expense, category: text })}
      />

      <Text>Proveedor:</Text>
      <Picker
        selectedValue={selectedSupplier}
        onValueChange={(itemValue) => setSelectedSupplier(itemValue)}
      >
        <Picker.Item label="Seleccionar proveedor" value="" />
        {suppliers.map((supplier, index) => (
          <Picker.Item key={index} label={supplier} value={supplier} />
        ))}
      </Picker>

      <Text>Nuevo Proveedor:</Text>
      <TextInput
        placeholder="Agregar nuevo proveedor"
        value={newSupplier}
        onChangeText={(text) => setNewSupplier(text)}
      />

      <Button title="Agregar Gasto" onPress={handleAddExpense} />
    </View>
  );
};

export default App;
