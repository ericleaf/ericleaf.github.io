document.querySelectorAll('.nav').forEach((nav) => {
  const links = nav.querySelector('.nav-links');
  if (!links) return;

  const button = document.createElement('button');
  button.className = 'menu-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', '開啟導覽選單');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<span></span><span></span><span></span>';
  nav.insertBefore(button, links);

  button.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    button.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('.research-menu').forEach((menu) => {
    const summary = menu.querySelector('summary');
    let closeTimer;

    summary.addEventListener('click', (event) => {
      event.preventDefault();
      clearTimeout(closeTimer);

      if (menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        closeTimer = setTimeout(() => {
          menu.open = false;
        }, 200);
        return;
      }

      menu.open = true;
      void menu.offsetHeight;
      menu.classList.add('is-open');
    });
  });
});
