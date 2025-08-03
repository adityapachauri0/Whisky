// Force PremiumSuccessModal to be included in build
// This ensures webpack doesn't tree-shake the modal component
import PremiumSuccessModal from './PremiumSuccessModal';

// Export the modal to prevent tree-shaking
export { PremiumSuccessModal };

// Dummy component that references the modal
export const ForceModalInclude = () => {
  // This forces webpack to include the modal in the bundle
  const neverTrue = false;
  if (neverTrue) {
    return <PremiumSuccessModal isOpen={true} onClose={() => {}} />;
  }
  return null;
};

export default ForceModalInclude;