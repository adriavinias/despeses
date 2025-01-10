import { Text, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import setupGoogleSheets from "@/services/setUpGoogleService";
import { getData } from "@/services/googleSheetServices";
export default function Index() { 

  const [data, setData] = useState([])
  useEffect(()=>{
    
      const initializeGoogleSheets = async () => {
        try {

        const sheets = await setupGoogleSheets();
        const row = await getData(sheets);
        setData(row.flat())
      }
      catch (error) {
        console.error(error)
      }
    } 

    initializeGoogleSheets()

  }, [])

  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>Edit app/index.tsx to edit this screen. {data} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
})
