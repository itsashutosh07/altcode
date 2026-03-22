import { useSyncExternalStore } from 'react'
import { useTheme } from '@/app/theme/ThemeContext'
import { DarkVeil } from './DarkVeil'
import { Grainient } from './Grainient'

/**
 * Full-viewport WebGL backgrounds (React Bits + ogl).
 * Dark: https://reactbits.dev/backgrounds/dark-veil?hueShift=116&speed=0.3
 * Light: https://reactbits.dev/backgrounds/grainient?color1=ff7b00&color2=f0edd5&color3=2f1f04&timeSpeed=0.15&warpFrequency=11.6&warpAmplitude=33&rotationAmount=680&blendSoftness=0.02&grainAmount=0.08&gamma=1.25&zoom=1.05&colorBalance=-0.13
 */
function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onStoreChange)
  return () => mq.removeEventListener('change', onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getReducedMotionServerSnapshot() {
  return false
}

export function LiveWebGLBackground() {
  const { theme } = useTheme()
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  )

  return (
    <>
      {!reduceMotion ? (
        <div className="live-webgl-host" aria-hidden>
          {theme === 'dark' ? (
            <DarkVeil
              hueShift={116}
              noiseIntensity={0}
              scanlineIntensity={0}
              speed={0.3}
              scanlineFrequency={0}
              warpAmount={0}
            />
          ) : (
            <Grainient
              color1="#ff7b00"
              color2="#f0edd5"
              color3="#2f1f04"
              timeSpeed={0.15}
              colorBalance={-0.13}
              warpStrength={1}
              warpFrequency={11.6}
              warpSpeed={2}
              warpAmplitude={33}
              blendAngle={0}
              blendSoftness={0.02}
              rotationAmount={680}
              noiseScale={2}
              grainAmount={0.08}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1.25}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={1.05}
            />
          )}
        </div>
      ) : null}
      {theme === 'dark' ? (
        <div className="live-bg-terminal-grid" aria-hidden />
      ) : null}
    </>
  )
}
