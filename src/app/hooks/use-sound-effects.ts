import useSound from "use-sound";

/**
 * Central hook for all UI sound effects.
 *
 * To swap sounds later:
 * 1. Replace the MP3 files in public/sounds/ with your new sounds
 * 2. Keep the same filenames (hover.mp3, click.mp3, etc.)
 * 3. Rebuild with `npm run build`
 *
 * No code changes needed!
 */
export function useSoundEffects() {
  const [playHover] = useSound("/sounds/hover.mp3");
  const [playClick] = useSound("/sounds/click.mp3");
  const [playDrawerOpen] = useSound("/sounds/drawer-open.mp3");
  const [playDrawerClose] = useSound("/sounds/drawer-close.mp3");
  const [playScroll] = useSound("/sounds/scroll.mp3");

  return {
    playHover,
    playClick,
    playDrawerOpen,
    playDrawerClose,
    playScroll,
  };
}
