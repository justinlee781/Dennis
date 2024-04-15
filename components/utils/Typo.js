import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Theme from '../../src/Theme';


const Typo = ({
  numberOfLines,
  light,
  bold,
  grey,
  children,
  xl,
  l,
  m,
  s,
  xs,
  xxl,
  white,
  black,
  fontFamily,
  center,
  style,
  ...props
}) => {
  const getFontSizeStyle = () => {
    if (xxl) return { fontSize: 32 };
    if (xl) return { fontSize: 24 };
    if (l) return { fontSize: 18 };
    if (m) return { fontSize: 16 };
    if (s) return { fontSize: 14 };
    if (xs) return { fontSize: 12 };
    return { fontSize: 16 }; // Default font size
  };

  const fontStyles = {
    fontFamily: light ? Theme.OutfitLight : bold ? Theme.OutfitBold : Theme.OutfitMedium,
    color: grey ? Theme.lightTextcolor : white ? '#FFF' : black ? 'black' : 'black',
    textAlign:center ? 'center' : 'left'
  };

  // Merge the font size styles, font family, and provided styles
  const mergedStyles = [getFontSizeStyle(), fontStyles, style];

  return (
    <Text
      numberOfLines={numberOfLines ? numberOfLines :100}
      style={mergedStyles}
      {...props}
    >
      {children}
    </Text>
  );
};

export default Typo;
