import { Audio } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";

import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function SpeachPage() {
  const clickSoundRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/audio/tic-tac.mp3"),
        { shouldPlay: false }
      );
      clickSoundRef.current = sound;

      await clickSoundRef.current.setVolumeAsync(1.0); // maksimum ses
      setIsReady(true);
    };

    loadSound();

    return () => {
      clickSoundRef.current?.unloadAsync();
    };
  }, []);

  const handleClickPlayer = () => {
    if (clickSoundRef.current) {
      clickSoundRef.current.setPositionAsync(0);
      clickSoundRef.current.playAsync();
    }
  };

  const router = useRouter();
  const params = useLocalSearchParams();
  const gameIndex = parseInt(params.gameIndex || "0");

  const [speachIndex, setSpeachIndex] = useState(0);

  const openSpeach0 = [
    "Hi!",
    "Let's make lemon cake together",
    "LET'S GET STARTED",
    "...",
  ];
  const openSpeach1 = ["Kekimiz fırında pişiyooorr", "İŞTE PİŞTİİİİ"];

  const [speach, setSpeach] = useState(
    gameIndex === 0 ? openSpeach0[0] : openSpeach1[0]
  );

  useEffect(() => {
    const prepare = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setIsReady(true);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (gameIndex === 0) {
      const timer = setTimeout(() => {
        setSpeach(openSpeach0[speachIndex]);
        if (speachIndex === openSpeach0.length - 1) {
          router.push({
            pathname: "/gamePage",
            params: { gameIndex: gameIndex },
          });
        }
        setSpeachIndex(speachIndex + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (gameIndex === 1) {
      setTimeout(() => {
        handleClickPlayer();
      }, 500);

      const timer = setTimeout(() => {
        router.push({
          pathname: "/gamePage",
          params: { gameIndex: gameIndex },
        });
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [speachIndex, gameIndex]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          display: gameIndex === 0 ? "flex" : "none",
        }}
      >
        <Image
          source={require("../assets/images/garden.jpg")}
          style={styles.bg}
        />
        <View style={styles.content}>
          <ImageBackground
            style={styles.textBaloon}
            source={require("../assets/images/textBaloon.png")}
          >
            <Text style={styles.text}>{speach}</Text>
          </ImageBackground>
        </View>
        <Image
          source={require("../assets/images/elif.png")}
          style={styles.character}
        />
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: gameIndex === 1 ? "flex" : "none",
        }}
      >
        <Image
          source={require("../assets/images/oven.png")}
          style={styles.character}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "fill",
    elevation: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "center",
  },
  textBaloon: {
    position: "absolute",
    width: 350,
    height: 170,
    resizeMode: "contain",
    flex: 1,
    justifyContent: "center",
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  text: {
    top: 0,
    left: 6,
    fontSize: 13,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
});
