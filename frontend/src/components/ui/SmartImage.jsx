import { useState } from 'react'
import { cn } from '../../utils/cn'
import { LogoMark } from './Logo'

/** Lazy image with fade-in and a branded fallback if the URL fails. */
export default function SmartImage({ src, alt, className, imgClassName, eager = false, ...rest }) {
  const [state, setState] = useState('loading')
  return (
    <div className={cn('relative overflow-hidden bg-surface2', className)}>
      {state !== 'error' ? (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            state === 'ready' ? 'opacity-100' : 'opacity-0',
            imgClassName,
          )}
          {...rest}
        />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#262626,#111)] text-bone/30"
        >
          <LogoMark className="h-14 w-14" />
        </div>
      )}
    </div>
  )
}
