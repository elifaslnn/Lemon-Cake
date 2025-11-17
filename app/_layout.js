import { Audio } from "expo-av";
import { Stack } from "expo-router";
import { useEffect, useRef } from "react";

const gameSound = require("../assets/audio/CloudCountry.mp3");

export default function RootLayout() {
  const soundRef = useRef(null);

  useEffect(() => {
    const preloadMusic = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
        });

        const { sound } = await Audio.Sound.createAsync(
          require("../assets/audio/CloudCountry.mp3"),
          { shouldPlay: false, volume: 1.0, isLooping: true }
        );

        soundRef.current = sound;

        // Hemen çalmak istersen
        await sound.playAsync();
      } catch (err) {
        console.log(err);
      }
    };

    preloadMusic();

    return () => soundRef.current?.unloadAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="gamePage" />
    </Stack>
  );
}
