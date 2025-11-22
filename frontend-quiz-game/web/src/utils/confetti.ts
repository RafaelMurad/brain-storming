// Simple confetti effect
export default function confetti() {
  const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#22c55e', '#ec4899'];
  const confettiCount = 100;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: 10px;
      height: 10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      opacity: 1;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
      pointer-events: none;
      z-index: 9999;
    `;

    document.body.appendChild(confetti);

    const animation = confetti.animate(
      [
        {
          transform: `translate(0, 0) rotate(0deg)`,
          opacity: 1,
        },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, 100vh) rotate(${
            Math.random() * 720
          }deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 2000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        delay: Math.random() * 500,
      }
    );

    animation.onfinish = () => confetti.remove();
  }
}
