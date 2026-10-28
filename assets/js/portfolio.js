/**
 * Portfolio – Hunor Madaras
 *
 * The page works without JavaScript. This file only adds three small things:
 *   1. Light/dark theme toggle (choice is saved in localStorage)
 *   2. "Copy" button next to the email address
 *   3. Current year in the footer
 *
 * Loaded with `defer`, so the DOM is ready when this runs.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     1. Theme toggle
     The saved theme is applied by a tiny inline script in <head> (to avoid
     a flash of the wrong theme). Here we only handle the button.
     --------------------------------------------------------------------- */
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  // The theme currently on screen: explicit choice first, otherwise the OS setting.
  function getCurrentTheme() {
    return root.dataset.theme || (prefersDark.matches ? 'dark' : 'light');
  }

  // The button shows the theme you would switch TO.
  function updateThemeButton() {
    const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
    themeButton.textContent = nextTheme;
    themeButton.setAttribute('aria-label', 'Switch to ' + nextTheme + ' theme');
  }

  if (themeButton) {
    themeButton.hidden = false;
    updateThemeButton();

    themeButton.addEventListener('click', function () {
      const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = nextTheme;

      try {
        localStorage.setItem('theme', nextTheme);
      } catch (e) {
        // Storage can be blocked (e.g. private mode) – the toggle still works for this visit.
      }

      updateThemeButton();
    });

    // Keep the label correct if the OS theme changes while the page is open.
    prefersDark.addEventListener('change', updateThemeButton);
  }


  /* ---------------------------------------------------------------------
     2. Copy email button
     Only shown when the Clipboard API exists (it needs HTTPS or localhost).
     --------------------------------------------------------------------- */
  const copyButton = document.querySelector('[data-copy]');
  const copyStatus = document.querySelector('[data-copy-status]');

  if (copyButton && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    let resetTimer;

    copyButton.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copy);
        copyButton.textContent = 'copied';
        if (copyStatus) copyStatus.textContent = 'Email copied to clipboard';
      } catch (err) {
        copyButton.textContent = 'failed';
      }

      // Put the original label back after 2 seconds.
      clearTimeout(resetTimer);
      resetTimer = setTimeout(function () {
        copyButton.textContent = 'copy';
        if (copyStatus) copyStatus.textContent = '';
      }, 2000);
    });
  }


  /* ---------------------------------------------------------------------
     3. Footer year
     --------------------------------------------------------------------- */
  const yearElement = document.querySelector('[data-year]');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();
