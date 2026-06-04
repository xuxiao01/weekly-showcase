import { ref, nextTick, onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'

const DURATION = 0.4
const EASE = 'power2.inOut'
const OFFSET = 24

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function usePageTransition(
  contentRef: Ref<HTMLElement | null>,
  currentIndex: Ref<number>,
  totalPages: number,
) {
  const isAnimating = ref(false)
  let ctx: gsap.Context | undefined

  onMounted(() => {
    const el = contentRef.value
    if (!el || prefersReducedMotion()) return

    ctx = gsap.context(() => {
      gsap.from(el, {
        autoAlpha: 0,
        y: 20,
        duration: DURATION,
        ease: EASE,
      })
    }, el)
  })

  onUnmounted(() => {
    ctx?.revert()
  })

  async function transitionTo(newIndex: number) {
    if (isAnimating.value || newIndex === currentIndex.value) return
    if (newIndex < 0 || newIndex >= totalPages) return

    isAnimating.value = true
    const el = contentRef.value

    if (prefersReducedMotion() || !el) {
      currentIndex.value = newIndex
      isAnimating.value = false
      return
    }

    await gsap.to(el, {
      autoAlpha: 0,
      y: -OFFSET,
      duration: DURATION,
      ease: EASE,
    })

    currentIndex.value = newIndex
    await nextTick()

    gsap.set(el, { autoAlpha: 0, y: OFFSET })
    await gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: DURATION,
      ease: EASE,
    })

    isAnimating.value = false
  }

  function goNext() {
    if (currentIndex.value >= totalPages - 1) return
    return transitionTo(currentIndex.value + 1)
  }

  function goPrev() {
    if (currentIndex.value <= 0) return
    return transitionTo(currentIndex.value - 1)
  }

  return { isAnimating, goNext, goPrev }
}
