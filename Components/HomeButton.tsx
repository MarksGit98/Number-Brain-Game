import React from 'react';
import { ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { FONT_SIZES, NUMERIC_CONSTANTS } from '../constants/sizing';
import CircularIconButton from './CircularIconButton';

// Home icon SVG with white fill and black stroke
const homeIconSvg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 112.07" style="enable-background:new 0 0 122.88 112.07" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" fill="#FFFFFF" stroke="#000000" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" d="M61.44,0L0,60.18l14.99,7.87L61.04,19.7l46.85,48.36l14.99-7.87L61.44,0L61.44,0z M18.26,69.63L18.26,69.63 L61.5,26.38l43.11,43.25h0v0v42.43H73.12V82.09H49.49v29.97H18.26V69.63L18.26,69.63L18.26,69.63z"/></g></svg>`;

interface HomeButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function HomeButton({
  onPress,
  disabled = false,
  style,
}: HomeButtonProps) {
  return (
    <CircularIconButton
      onPress={onPress}
      disabled={disabled}
      style={style}
    >
      <SvgXml 
        xml={homeIconSvg} 
        width={FONT_SIZES.BUTTON_TEXT * NUMERIC_CONSTANTS.FONT_MULTIPLIER_NAV_ARROW} 
        height={FONT_SIZES.BUTTON_TEXT * NUMERIC_CONSTANTS.FONT_MULTIPLIER_NAV_ARROW} 
      />
    </CircularIconButton>
  );
}

