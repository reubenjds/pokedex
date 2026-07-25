/**
 * Enter animation for a page root.
 *
 * The site is prerendered, so the first page a visitor lands on is already
 * painted before Motion runs. Animating that from `opacity: 0` would blank
 * content the browser has drawn, so the animation is skipped until the router
 * has actually moved between routes.
 */
export function usePageMotion() {
	const navigated = useState("page-navigated", () => false);
	const reduceMotion = useReducedMotion();

	const initial = computed(() =>
		navigated.value && !reduceMotion.value ? { opacity: 0, y: 8 } : false
	);

	return {
		initial,
		animate: { opacity: 1, y: 0 },
		transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
	};
}
