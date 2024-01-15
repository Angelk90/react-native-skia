import {
  Canvas,
  Skia,
  Picture,
  PaintStyle,
  rotateZ,
  toMatrix3,
} from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
  Button,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useAnimatedReaction } from "@shopify/react-native-skia/src/external/reanimated/moduleWrapper";

import { example1, render } from "../../components/sg";

const Size = 25;
const Increaser = 50;
const paint1 = Skia.Paint();
paint1.setColor(Skia.Color("cyan"));

const paint2 = Skia.Paint();
paint2.setColor(Skia.Color("blue"));
paint2.setStyle(PaintStyle.Stroke);
paint2.setStrokeWidth(2);

export const PerformanceDrawingTest: React.FC = () => {
  const tree = useSharedValue(example1);
  const [numberOfBoxes, setNumberOfBoxes] = useState(150);

  const { width, height } = useWindowDimensions();

  const SizeWidth = Size;
  const SizeHeight = Size * 0.45;

  const pos = useSharedValue<{ x: number; y: number }>({
    x: width / 2,
    y: height * 0.25,
  });

  const gesture = Gesture.Pan().onChange((e) => (pos.value = e));
  const picture = useDerivedValue(() => {
    tree.value.children?.forEach((child, i) => {
      const x = 5 + ((i * Size) % width);
      const y = 25 + Math.floor(i / (width / Size)) * Size;
      const r = Math.atan2(pos.value.y - y, pos.value.x - x);
      const m4 = rotateZ(r, { x, y });
      child.props.matrix = m4;
      child.children[0].props.rect.x = x;
      child.children[0].props.rect.y = y;
      child.children[0].props.rect.width = SizeWidth;
      child.children[0].props.rect.height = SizeHeight;
      child.children[1].props.rect.x = x;
      child.children[1].props.rect.y = y;
      child.children[1].props.rect.width = SizeWidth;
      child.children[1].props.rect.height = SizeHeight;
    });
    return render(tree.value);
  });

  return (
    <View style={styles.container}>
      <View style={styles.mode}>
        <View style={styles.panel}>
          <Button
            title="⬇️"
            onPress={() => setNumberOfBoxes((n) => Math.max(0, n - Increaser))}
          />
          <Text>&nbsp;Size&nbsp;</Text>
          <Text>{numberOfBoxes}</Text>
          <Text>&nbsp;</Text>
          <Button
            title="⬆️"
            onPress={() => setNumberOfBoxes((n) => n + Increaser)}
          />
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Canvas style={styles.container} mode="continuous">
          <Picture picture={picture} />
        </Canvas>
        <GestureDetector gesture={gesture}>
          <Animated.View style={StyleSheet.absoluteFill} />
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mode: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  panel: {
    flexDirection: "row",
    alignItems: "center",
  },
});
