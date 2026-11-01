# /public/audio

Drop the real background track here (e.g. `theme.mp3`), then point
`AUDIO.track` in `src/site.config.ts` at it — that's the only change needed.

Until a file exists, the floating audio player still renders but shows a
"no track" note instead of playing anything (it never autoplays regardless).
