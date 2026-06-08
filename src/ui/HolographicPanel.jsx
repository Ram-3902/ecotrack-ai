import { Html } from '@react-three/drei';

/**
 * Reusable holographic panel wrapper for 3D-positioned HTML content
 */
export default function HolographicPanel({
  children,
  position = [0, 0, 0],
  size = 'md',
  visible = true,
  distanceFactor = 6,
}) {
  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      distanceFactor={distanceFactor}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.5s',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className={`holo-panel holo-panel--${size}`}>
        {children}
      </div>
    </Html>
  );
}
