import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, TextInput, View, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");

  const myHeaders = new Headers();
  myHeaders.append("apikey", "eYF3VYbk18atcjqM8cOVAGgrLRwMA41n");
  const URL = "https://api.apilayer.com/exchangerates_data";

  const requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
  };

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const res = await fetch(`${URL}/symbols`, requestOptions);
        const json = await res.json();
        setSymbols(Object.keys(json.symbols));
      } catch (err) {
        console.error(err);
      }
    };
    fetchSymbols();
  }, []);

  const handleConversion = async () => {
    try {
      const res = await fetch(
        `${URL}/convert?to=EUR&from=${selectedSymbol}&amount=${amount}`,
        requestOptions
      );
      const json = await res.json();
      json.result === undefined
        ? setResult("Input numerical value to convert!")
        : setResult(json.result.toFixed(2) + " €");
    } catch (err) {
      console.error(err);
    }
  };

  const pickerSymbols = symbols.map((symbol) => (
    <Picker.Item key={symbol} label={symbol} value={symbol} />
  ));

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("./assets/image.png")} />
      <Text style={styles.text}>{result}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          autoFocus={true}
          keyboardType="numeric"
          onChangeText={(text) => setAmount(text)}
          value={amount}
        />
        <Picker
          style={styles.picker}
          selectedValue={selectedSymbol}
          onValueChange={(itemValue, itemIndex) => setSelectedSymbol(itemValue)}
        >
          {pickerSymbols}
        </Picker>
      </View>
      <Button title="Convert" onPress={() => handleConversion()} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    padding: 2,
  },
  inputContainer: {
    flexDirection: "row",
    height: 50,
    marginBottom: 20,
  },
  input: {
    width: 80,
    borderBottomWidth: 1.5,
    borderBottomColor: "dodgerblue",
    textAlign: "center",
  },
  picker: {
    width: 100,
  },
});
