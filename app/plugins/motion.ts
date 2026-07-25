/**
 * Registers Motion's `v-motion` directive.
 *
 * The `<motion.div>` component renders nothing during SSR, which would strip
 * the prerendered markup off any page that used it as a root. The directive
 * leaves a plain element in the HTML and only animates once Motion is running,
 * so prerendering is unaffected.
 */
import { vMotion } from "motion-v";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.directive("motion", vMotion);
});
