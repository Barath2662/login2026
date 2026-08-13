import { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface GuideDialogueProps {
  messages: string[];
  typingSpeed?: number;
  onComplete?: () => void;
}

export const GuideDialogue = ({ messages, typingSpeed = 50, onComplete }: GuideDialogueProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentMessageIndex >= messages.length) return;

    const fullText = messages[currentMessageIndex];
    let charIndex = 0;
    setIsTyping(true);
    setDisplayedText('');

    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [currentMessageIndex, messages, typingSpeed]);

  const handleNext = () => {
    if (!isTyping && currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else if (isTyping) {
      // Skip typing animation
      setDisplayedText(messages[currentMessageIndex]);
      setIsTyping(false);
    } else if (!isTyping && currentMessageIndex === messages.length - 1) {
      onComplete?.();
    }
  };

  if (currentMessageIndex >= messages.length) return null;

  return (
    <div 
      className="bg-black border border-color-red/30 p-4 rounded-sm shadow-[0_0_15px_rgba(0,240,255,0.1)] font-mono text-sm cursor-pointer hover:border-color-red/60 transition-colors"
      onClick={handleNext}
    >
      <div className="flex items-center space-x-2 text-color-red mb-2 border-b border-color-red/20 pb-2">
        <Terminal size={14} />
        <span className="font-bold tracking-wider">SYSTEM.AURA</span>
      </div>
      <div className="text-white min-h-[40px]">
        {displayedText}
        <span className="animate-pulse inline-block w-2 h-4 bg-color-red ml-1 align-middle"></span>
      </div>
      <div className="text-right mt-2">
        <span className="text-text-muted text-xs">
          {currentMessageIndex < messages.length - 1 || isTyping ? '[CLICK TO CONTINUE]' : '[END OF TRANSMISSION]'}
        </span>
      </div>
    </div>
  );
};
