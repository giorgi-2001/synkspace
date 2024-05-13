const ifIsLeft = (element: HTMLElement | null): boolean | undefined => {
    if (!element) return 
    const rect = element.getBoundingClientRect()
    const left = rect.left
    const right = window.innerWidth - (rect.left + rect.width)
    return right > left
}

export default ifIsLeft