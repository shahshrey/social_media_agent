export const toastConfig = {
  success: {
    className: "glass-morphism",
    style: {
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#4f46e5',
      border: '1px solid rgba(79, 70, 229, 0.2)',
    },
  },
  error: {
    className: "glass-morphism",
    style: {
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#dc2626',
      border: '1px solid rgba(220, 38, 38, 0.2)',
    },
  },
  info: {
    className: 'border-blue-500',
    style: {
      background: '#eff6ff',
      color: '#1e40af',
      border: '1px solid #3b82f6'
    }
  }
} as const; 