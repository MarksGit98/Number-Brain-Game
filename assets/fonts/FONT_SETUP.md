# Digital-7 Mono Font Setup

## Current Issue

The `fontWeight: 'bold'` property doesn't work with the Digital-7 Mono font because:
1. The font doesn't have a built-in bold weight
2. React Native requires separate font files for different weights

## Solution: Use Bold Variant Font File

Digital-7 font family typically comes with separate files:
- `digital-7 (mono).ttf` - Regular
- `digital-7 (mono italic).ttf` - Italic  
- `digital-7 (mono bold).ttf` - Bold (if available)

## Steps to Add Bold Font:

1. **Download the Bold Variant:**
   - Visit: https://www.dafont.com/digital-7.font
   - Download the complete font package
   - Look for files named like:
     - `digital-7 (mono bold).ttf`
     - `digital-7-mono-bold.ttf`
     - `Digital-7-Mono-Bold.ttf`

2. **Add to Project:**
   - Place the bold font file in `assets/fonts/`
   - Name it `digital-7-mono-bold.ttf` for consistency

3. **Register in App.tsx:**
   ```typescript
   const [fontsLoaded] = useFonts({
     'Digital-7-Mono': require('./assets/fonts/digital-7-mono.ttf'),
     'Digital-7-Mono-Bold': require('./assets/fonts/digital-7-mono-bold.ttf'),
   });
   ```

4. **Use in Styles:**
   Instead of `fontWeight: 'bold'`, use:
   ```typescript
   fontFamily: 'Digital-7-Mono-Bold'
   ```

## Alternative: If Bold Variant Not Available

If no bold variant exists, you can:
1. Use a different calculator-style font that has bold variants
2. Use text shadow or outline to make text appear bolder
3. Use a slightly larger font size for emphasis

