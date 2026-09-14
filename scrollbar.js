(() => {
  const root = document.documentElement;
  const nav = document.querySelector('.nav');
  const scrollbar = document.createElement('div');
  const thumb = document.createElement('div');

  scrollbar.className = 'page-scrollbar';
  thumb.className = 'page-scrollbar-thumb';
  thumb.setAttribute('role', 'scrollbar');
  thumb.setAttribute('aria-label', '頁面捲軸');
  thumb.setAttribute('aria-orientation', 'vertical');
  thumb.setAttribute('aria-valuemin', '0');
  scrollbar.appendChild(thumb);
  document.body.appendChild(scrollbar);

  let maximumScroll = 0;
  let thumbTravel = 0;
  let framePending = false;
  let dragging = false;
  let dragStartY = 0;
  let dragStartScroll = 0;

  const updateScrollbar = () => {
    framePending = false;

    const navBottom = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
    const edgeGap = parseFloat(
      getComputedStyle(scrollbar).getPropertyValue('--scrollbar-edge-gap')
    ) || 0;
    const trackHeight = Math.max(0, window.innerHeight - navBottom - (edgeGap * 2));
    const documentHeight = Math.max(root.scrollHeight, document.body.scrollHeight);

    maximumScroll = Math.max(0, documentHeight - window.innerHeight);
    scrollbar.style.top = `${navBottom}px`;
    scrollbar.hidden = maximumScroll === 0 || trackHeight === 0;

    if (scrollbar.hidden) return;

    const thumbHeight = Math.min(
      trackHeight,
      Math.max(32, trackHeight * (window.innerHeight / documentHeight))
    );
    thumbTravel = Math.max(0, trackHeight - thumbHeight);

    const progress = maximumScroll === 0 ? 0 : window.scrollY / maximumScroll;
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbTravel * progress}px)`;
    thumb.setAttribute('aria-valuemax', String(Math.round(maximumScroll)));
    thumb.setAttribute('aria-valuenow', String(Math.round(window.scrollY)));
  };

  const requestUpdate = () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(updateScrollbar);
  };

  thumb.addEventListener('pointerdown', (event) => {
    dragging = true;
    dragStartY = event.clientY;
    dragStartScroll = window.scrollY;
    thumb.classList.add('is-dragging');
    thumb.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  thumb.addEventListener('pointermove', (event) => {
    if (!dragging || thumbTravel === 0) return;
    const scrollDelta = (event.clientY - dragStartY) * (maximumScroll / thumbTravel);
    window.scrollTo(0, dragStartScroll + scrollDelta);
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    thumb.classList.remove('is-dragging');
    if (thumb.hasPointerCapture(event.pointerId)) thumb.releasePointerCapture(event.pointerId);
  };

  thumb.addEventListener('pointerup', stopDragging);
  thumb.addEventListener('pointercancel', stopDragging);
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if ('ResizeObserver' in window) {
    new ResizeObserver(requestUpdate).observe(document.body);
  }

  updateScrollbar();
})();
