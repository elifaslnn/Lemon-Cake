import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// SplashScreen.preventAutoHideAsync();

export default function GamePage() {
  const router = useRouter();

  const params = useLocalSearchParams();
  const gameIndex = parseInt(params.gameIndex || "0");
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const ingredients = [
    { key: "egg", image: require("../assets/images/egg.png") },
    { key: "milk", image: require("../assets/images/milk.png") },
    { key: "oil", image: require("../assets/images/oil.png") },
    { key: "sugar", image: require("../assets/images/sugar.png") },
    { key: "flour", image: require("../assets/images/flour.png") },
    { key: "lemon", image: require("../assets/images/lemon.png") },
    { key: "whisk", image: require("../assets/images/whisk.png") },
  ];

  const [recipe, setRecipe] = useState([
    "egg",
    "sugar",
    "whisk",
    "milk",
    "oil",
    "whisk",
    "flour",
    "lemon",
    "whisk",
  ]);

  const firstPop = () => {
    setRecipe((prev) => {
      const newArr = [...prev];
      newArr.shift();
      return newArr;
    });
    if (recipe.length == 1) {
      setTimeout(() => {
        //goToSpeach(index + 1);
        router.push({
          pathname: "/",
          params: { gameIndex: gameIndex + 1 },
        });
      }, 2000);
    }
  };

  const [bowlIndex, setBowlIndex] = useState(0);

  const [bowls, setBowls] = useState([
    require("../assets/images/bowl.png"),
    require("../assets/images/bowlEgg.png"),
    require("../assets/images/bowlSugar.png"),
    require("../assets/images/bowlWhiskFirst.png"),
    require("../assets/images/bowlMilk.png"),
    require("../assets/images/bowlOil.png"),
    require("../assets/images/bowlWhiskSecond.png"),
    require("../assets/images/bowlFlour.png"),
    require("../assets/images/bowlLemon.png"),
    require("../assets/images/bowlWhiskThird.png"),
  ]);
  const [bowlsSelected, setBowlsSelected] = useState([
    require("../assets/images/bowlSelect.png"),
    require("../assets/images/bowlEggSelected.png"),
    require("../assets/images/bowlSugarSelected.png"),
    require("../assets/images/bowlWhiskFirstSelected.png"),
    require("../assets/images/bowlMilkSelected.png"),
    require("../assets/images/bowlOilSelected.png"),
    require("../assets/images/bowlWhiskSecondSelected.png"),
    require("../assets/images/bowlFlourSelected.png"),
    require("../assets/images/bowlLemonSelected.png"),
    require("../assets/images/bowlWhiskThirdSelected.png"),
  ]);
  const instructions = {
    egg: "Egg!",
    sugar: "Sugar",
    whisk: "Mix!",
    milk: "Milk",
    oil: "Oil",
    whisk: "Mix",
    flour: "Flour",
    lemon: "Lemon",
    whisk: "Mix!",
  };

  const [bowlSrc, setBowlSrc] = useState(bowls[0]);
  const [layout, setLayout] = useState({});

  const offsetReducer = (obj, ingredient) => {
    if (!obj[ingredient.key]) {
      obj[ingredient.key] = useSharedValue(0);
    }
    return obj;
  };

  const layoutReducer = (obj, ingredient) => {
    if (!obj[ingredient.key]) {
      obj[ingredient.key] = { pageX: 0, width: 0 };
    }
    return obj;
  };

  const refReducer = (obj, ingredient) => {
    if (!obj[ingredient.key]) {
      obj[ingredient.key] = useRef(null);
    }
    return obj;
  };

  const offsetIngredients = ingredients.reduce(offsetReducer, {});
  const layoutIngredients = ingredients.reduce(layoutReducer, layout);
  const refIngredients = ingredients.reduce(refReducer, {});

  const animatedStyleReducer = (obj, ingredient) => {
    if (!obj[ingredient.key]) {
      obj[ingredient.key] = useAnimatedStyle(() => ({
        transform: [{ translateX: offsetIngredients[ingredient.key].value }],
      }));
    }
    return obj;
  };

  const animatedStyleIngredients = ingredients.reduce(animatedStyleReducer, {});
  const [bowlsGlobalX, setBowlsGlobalX] = useState({ pageX: 0, width: 0 });

  const pressed = useSharedValue(false);

  const pan = (item) =>
    Gesture.Pan()
      .onBegin(() => {
        pressed.value = true;
      })
      .onChange((event) => {
        const currentX =
          layoutIngredients[item].pageX +
          layoutIngredients[item].width / 2 +
          event.translationX;

        offsetIngredients[item].value = event.translationX;

        if (
          currentX >= bowlsGlobalX.pageX &&
          currentX <= bowlsGlobalX.pageX + bowlsGlobalX.width
        ) {
          runOnJS(setBowlSrc)(bowlsSelected[bowlIndex]);
        } else {
          runOnJS(setBowlSrc)(bowls[bowlIndex]);
        }
      })
      .onFinalize((event) => {
        const currentX =
          layoutIngredients[item].pageX +
          layoutIngredients[item].width / 2 +
          event.translationX;

        offsetIngredients[item].value = withSpring(0);
        pressed.value = false;

        const isCorrect =
          currentX >= bowlsGlobalX.pageX &&
          currentX <= bowlsGlobalX.pageX + bowlsGlobalX.width &&
          recipe[0] === item;

        if (isCorrect) {
          runOnJS(setBowlIndex)(bowlIndex + 1);
          runOnJS(setBowlSrc)(bowls[bowlIndex + 1]);
          runOnJS(firstPop)();
        } else {
          runOnJS(setBowlSrc)(bowls[bowlIndex]);
        }
      });

  const targetRef = React.useRef(null);

  useEffect(() => {
    if (isLayoutReady) {
      targetRef.current?.measure((x, y, width, height, pageX) => {
        setBowlsGlobalX({ pageX, width });
      });

      ingredients.forEach((item) => {
        refIngredients[item.key].current?.measure(
          (x, y, width, height, pageX) => {
            setLayout((prev) => ({
              ...prev,
              [item.key]: { pageX, width },
            }));
          }
        );
      });
    }
  }, [isLayoutReady]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/kitchen.jpg")}
          style={styles.bg}
          onLayout={() => setIsLayoutReady(true)}
        />
        <ImageBackground
          source={require("../assets/images/recipe.png")}
          style={[styles.recipe, { display: gameIndex == 0 ? "flex" : "none" }]}
        >
          <Text
            style={{
              fontFamily: "PressStart2P",
              top: 30,
              left: 6,
              fontSize: 13,
              lineHeight: 84,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {recipe.length > 0 && instructions[recipe[0]]}
          </Text>
        </ImageBackground>
        <Text
          style={[styles.end, { display: gameIndex == 1 ? "flex" : "none" }]}
        >
          Lemon cake is ready!!!
        </Text>
        <View style={styles.characters}>
          <Image
            source={require("../assets/images/elif.png")}
            style={styles.character}
          />
        </View>
        <Image
          source={require("../assets/images/stand.png")}
          style={styles.stand}
        />
        <View style={styles.kitchenwares}>
          {gameIndex == 0 ? (
            ingredients.map((item, index) => (
              <Animated.View
                ref={refIngredients[item.key]}
                key={index}
                style={animatedStyleIngredients[item.key]}
              >
                <GestureDetector gesture={pan(item.key)}>
                  <Image source={item.image} style={[styles.kitchenware]} />
                </GestureDetector>
              </Animated.View>
            ))
          ) : (
            <Image
              source={require("../assets/images/lemonCake.png")}
              style={styles.lemonCake}
            />
          )}
          <Animated.Image
            ref={targetRef}
            source={bowlSrc}
            style={[styles.bowl, { display: gameIndex == 0 ? "flex" : "none" }]}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "flex-end" },
  bg: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    elevation: 0,
  },
  recipe: {
    position: "absolute",
    width: 200,
    height: 200,
    resizeMode: "contain",
    left: 20,
    top: 10,
    flex: 1,
    justifyContent: "center",
  },
  end: {
    position: "absolute",
    width: 600,
    height: 50,
    resizeMode: "contain",
    top: 10,
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    backgroundColor: "rgb(50, 168, 82)",
    fontSize: 25,
    fontWeight: "bold",
  },
  characters: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    elevation: 1,
  },
  character: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  stand: {
    bottom: 0,
    width: "100%",
    resizeMode: "cover",
    elevation: 2,
    position: "absolute",
  },
  kitchenwares: {
    flexDirection: "row",
    position: "absolute",
    elevation: 3,
    marginBottom: 20,
  },
  kitchenware: {
    width: 92,
    height: 92,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  lemonCake: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  bowl: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginHorizontal: 5,
  },
  text: {
    fontFamily: "PressStart2P",
    top: 30,
    left: 6,
    fontSize: 13,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
});
