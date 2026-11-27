export const MOUNT_SECTION_EVENT = 'portfolio:mount-section'

export function requestSectionMount(id) {
  if (typeof window === 'undefined' || !id) return
  window.dispatchEvent(new CustomEvent(MOUNT_SECTION_EVENT, { detail: { id } }))
}
