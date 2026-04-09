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
  const [playHoverRaw] = useSound("/sounds/hover.mp3", { volume: 0.2 });
  const playHover = () => setTimeout(() => playHoverRaw(), 8);

  const [playDrawerOpen] = useSound("/sounds/drawer-open.mp3", { volume: 0.2 });

  const [playDrawerCloseRaw] = useSound("/sounds/drawer-close.mp3", { volume: 0.2 });
  const playDrawerClose = () => setTimeout(() => playDrawerCloseRaw(), 30);

  return {
    playHover,
    playClick: () => {}, // disabled
    playDrawerOpen,
    playDrawerClose,
    playScroll: () => {}, // disabled
  };
}
