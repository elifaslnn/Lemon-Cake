import { StyleSheet, Text, View } from "react-native";

export default function TestPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TEST SAYFASI - GÖRÜNÜYOR MU?</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
});
