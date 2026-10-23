export const IS_PREVIEW: boolean =
  process.env.PREVIEW_MODE === 'true' || process.env.NEXT_PUBLIC_PREVIEW_MODE === 'true';

export function showPreviewToast(message: string = 'Preview mode – submissions disabled'): void {
  if (typeof document === 'undefined') return;

  const existingToast = document.getElementById('preview-toast-notification');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'preview-toast-notification';
  toast.className =
    'fixed bottom-6 right-6 z-[9999] bg-[#0A1E3F] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#DFBF64]/40 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200';
  toast.innerHTML = `
    <span class="w-2 h-2 rounded-full bg-[#DFBF64] shrink-0 animate-pulse"></span>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 300ms ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}
