const menuButton = document.querySelector('button[aria-controls="menu-movil"]');
const desktopNav = document.querySelector('header nav[aria-label="Principal"]');

if (menuButton && desktopNav) {
  const mobileNav = document.createElement('nav');
  mobileNav.id = 'menu-movil';
  mobileNav.className = 'static-mobile-menu';
  mobileNav.setAttribute('aria-label', 'Menú móvil');
  mobileNav.hidden = true;
  for (const link of desktopNav.querySelectorAll('a')) {
    mobileNav.append(link.cloneNode(true));
  }
  menuButton.closest('header').append(mobileNav);

  menuButton.addEventListener('click', () => {
    mobileNav.hidden = !mobileNav.hidden;
    menuButton.setAttribute('aria-expanded', String(!mobileNav.hidden));
    menuButton.setAttribute('aria-label', mobileNav.hidden ? 'Abrir menú' : 'Cerrar menú');
  });
  mobileNav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      mobileNav.hidden = true;
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menú');
    }
  });
}

const fullImages = [
  '/__l5e/assets-v1/48c09c17-e568-4d7a-8a5d-7c41174d9e11/proto-refugio.webp',
  '/__l5e/assets-v1/11362052-7db0-4aa5-bd07-615a018542de/proto-metro.webp',
  '/__l5e/assets-v1/8b601a71-f4cb-437d-8038-a9ad2b9e69cc/proto-observatorio.webp',
];

document.querySelectorAll('#disenos article').forEach((card, index) => {
  const image = card.querySelector('img');
  const name = card.querySelector('h3')?.textContent || 'Prototipo';
  const fullImage = fullImages[index] || image?.getAttribute('src');
  const openButtons = card.querySelectorAll('button');

  function openModal(event) {
    if (!image || !fullImage) return;
    const trigger = event.currentTarget;
    const backdrop = document.createElement('div');
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', name);
    backdrop.className = 'fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 p-4';

    const content = document.createElement('div');
    content.className = 'relative max-h-full max-w-6xl';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-card font-bold shadow-lg';
    close.setAttribute('aria-label', 'Cerrar');
    close.textContent = '✕';
    const full = document.createElement('img');
    full.src = fullImage;
    full.alt = image.alt;
    full.className = 'max-h-[88vh] w-auto rounded-2xl';
    content.append(close, full);
    backdrop.append(content);
    document.body.append(backdrop);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function dismiss() {
      backdrop.remove();
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeydown);
      trigger.focus();
    }
    function onKeydown(keyEvent) {
      if (keyEvent.key === 'Escape') dismiss();
    }
    close.addEventListener('click', dismiss);
    backdrop.addEventListener('click', (clickEvent) => {
      if (clickEvent.target === backdrop) dismiss();
    });
    document.addEventListener('keydown', onKeydown);
    close.focus();
  }

  openButtons.forEach((button) => button.addEventListener('click', openModal));
});

const contactForm = document.querySelector('#contacto form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(contactForm);
  const subject = `Conversemos · ${fields.get('Interés') || ''}`;
  const body = [...fields.entries()].map(([key, value]) => `${key}: ${value}`).join('\n');
  window.location.href = `mailto:reciclajas@reciclajas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  let status = contactForm.querySelector('[role="status"]');
  if (!status) {
    status = document.createElement('p');
    status.setAttribute('role', 'status');
    status.className = 'text-center font-medium text-verde sm:col-span-2';
    contactForm.append(status);
  }
  status.textContent = '¡Gracias! Se abrió tu correo con el mensaje listo para enviar.';
});
