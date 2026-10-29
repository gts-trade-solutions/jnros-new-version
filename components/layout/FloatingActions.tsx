import { BackToTop } from "./BackToTop";
import { ChatAssistant } from "./ChatAssistant";

/**
 * Bottom-right stack: back-to-top above the chat launcher. Under the mobile menu (z-40) and the
 * lightbox; the wrapper lets clicks through between the buttons.
 */
export function FloatingActions() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-30 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <BackToTop />
      <ChatAssistant />
    </div>
  );
}
