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
});
