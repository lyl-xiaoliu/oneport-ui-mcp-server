/**
 * Helper function to get page type specific instructions
 */
export function getPageTypeSpecificInstructions(pageType) {
    const instructions = {
        login: `
   - Use login blocks as reference (login-01 through login-02)
   - Implement form validation with clear error messages
   - Add social authentication options if specified
   - Include forgot password and sign-up links
   - Ensure mobile-responsive design`,
        sidebar: `
   - Use sidebar blocks as foundation (sidebar-01)
   - Implement collapsible navigation
   - Add proper menu hierarchy
   - Include search functionality
   - Support both light and dark themes`,
    };
    return (instructions[pageType]);
}
/**
 * Helper function to get optimization specific instructions
 */
export function getOptimizationInstructions(optimization, framework) {
    const getPerformanceInstructions = (framework) => {
        // Framework is now fixed to React
        return `
   - Implement React.memo for preventing unnecessary re-renders
   - Use useMemo and useCallback hooks appropriately
   - Optimize bundle size by code splitting with React.lazy
   - Implement virtual scrolling for large lists
   - Minimize DOM manipulations and use refs efficiently
   - Use lazy loading for heavy components
   - Consider using React.startTransition for non-urgent updates`;
    };
    const instructions = {
        performance: getPerformanceInstructions(framework),
        accessibility: `
   - Add proper ARIA labels and roles
   - Ensure keyboard navigation support
   - Implement focus management
   - Add screen reader compatibility
   - Ensure color contrast compliance
   - Support high contrast mode
   - Use semantic HTML elements`,
        responsive: `
   - Implement mobile-first design approach
   - Use CSS Grid and Flexbox effectively
   - Add proper breakpoints for all screen sizes
   - Optimize touch interactions for mobile
   - Ensure readable text sizes on all devices
   - Implement responsive navigation patterns
   - Use container queries where appropriate`,
        animations: `
   - Add smooth transitions between states
   - Implement loading animations and skeletons
   - Use CSS transforms for better performance
   - Add hover and focus animations
   - Implement page transition animations
   - Ensure animations respect reduced motion preferences
   - Use hardware acceleration with transform3d when needed`,
    };
    return (instructions[optimization] ||
        `Focus on general code quality improvements and react-specific best practices implementation.`);
}
