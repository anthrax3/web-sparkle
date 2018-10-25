const getPrefixedStyle = require('get-prefixed-style')

let transition
let transform

const disableScroll = (e) => {
  e.preventDefault()
  return
}

/** CSS Scroll!
  *
  * This allows you to trigger a page scroll that is SMOOTH as BUTTER.
  * It's a non-blocking, hardward-accelerating scroll, since it's essentially just one
  * CSS transition. It works by taking a parent container (scrollElement) and moving it
  * in the opposite direction to fake a "scroll" motion.
  *
  * @param target {Number}            | A window.pageYOffset value you'd like to end up at.
  * @param duration {Number}          | The length of the transition in milliseconds.
  * @param scrollElement {DOMElement} | The parent container that the fake scroll will be applied to.
**/

const CSSScroll = (_target, duration = 500, scrollElement = document.body) => {
  if (!transform) transform = getPrefixedStyle('transform')
  if (!transition) transition = getPrefixedStyle('transition')

  return new Promise((resolve, reject) => {

    const remainingRoom = scrollElement.clientHeight - window.innerHeight
    const target = Math.min(remainingRoom, _target)
    const distance = window.pageYOffset - target

    scrollElement.style[transition] = `${transform} ${duration}ms ease-in-out`
    scrollElement.style[transform] = `translate3d(0, ${distance}px, 0)`
    scrollElement.style['pointer-events'] = 'none'
    scrollElement.clientHeight // force reflow

    const handleTransitionEnd = (e) => {
      if (e.target !== scrollElement) return
      if (e.propertyName !== transform) return

      scrollElement.style.removeProperty(transition)
      scrollElement.style.removeProperty(transform)
      scrollElement.style.removeProperty('pointer-events')

      window.scrollTo(0, target)

      scrollElement.style.removeProperty(transition)

      resolve()

      scrollElement.style.removeProperty('overflow')
      window.removeEventListener('scroll', disableScroll)
      scrollElement.removeEventListener('transitionend', handleTransitionEnd)
    }

    scrollElement.style.overflow = 'hidden'
    window.addEventListener('scroll', disableScroll)
    scrollElement.addEventListener('transitionend', handleTransitionEnd)
  })
}

export default CSSScroll
