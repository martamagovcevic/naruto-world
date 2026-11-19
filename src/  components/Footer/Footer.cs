
.footer {
  position: relative;
  width: 100%;
  color: #fff;
  background: #0b1117;
}

/* QUOTE SECTION */

.footer__quote-section {
  position: relative;
  display: flex;
  align-items: center;x
  justify-content: center;
  min-height: 245px;
  padding: 48px 24px;
  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 110%,
      rgba(255, 122, 47, 0.16),
      transparent 60%
    ),
    linear-gradient(
      135deg,
      #1b1e23 0%,
      #121920 55%,
      #0b1117 100%
    );

  border-top: 1px solid rgba(255, 122, 47, 0.25);
  border-bottom: 1px solid #2b353e;
}

.footer__quote-content {
  position: relative;
  z-index: 2;
  max-width: 760px;
  text-align: center;
}

.footer__eyebrow {
  display: block;
  margin-bottom: 16px;

  color: #ff7a2f;
  font-family: 'Permanent Marker', cursive;
  font-size: 12px;
  letter-spacing: 3px;
}

.footer__quote {
  margin: 0 0 14px;

  color: #f5f6f7;
  font-family: 'Bangers', cursive;
  font-size: clamp(30px, 4vw, 48px);
  line-height: 1.2;
  letter-spacing: 1.5px;
}

.footer__quote-author {
  color: #ff9b62;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
}

.footer__symbol {
  position: absolute;
  right: 7%;
  top: 50%;
  transform: translateY(-50%);

  color: rgba(255, 122, 47, 0.055);
  font-size: 220px;
  font-weight: 700;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

/* MAIN FOOTER */

.footer__main {
  background: #0b1117;
}

.footer__container {
  width: min(1420px, 88%);
  margin: 0 auto;
}

.footer__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  padding: 42px 0;
}

.footer__brand {
  max-width: 360px;
}

.footer__logo {
  display: inline-block;
  margin-bottom: 10px;

  color: #ff7a2f;
  font-family: 'Bangers', cursive;
  font-size: 42px;
  line-height: 1;
  letter-spacing: 2px;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer__logo:hover {
  color: #ff9b62;
}

.footer__brand p {
  color: #87939d;
  font-size: 13px;
  line-height: 1.7;
}

.footer__navigation {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 28px;
}

.footer__navigation a {
  color: #a7b0b8;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  transition: color 0.2s ease;
}

.footer__navigation a:hover {
  color: #ff7a2f;
}

.footer__back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 46px;
  height: 46px;

  color: #ff7a2f;
  background: #17212a;
  border: 1px solid #303e49;
  border-radius: 9px;

  font-size: 25px;
  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.footer__back-to-top:hover {
  background: #202d37;
  border-color: #ff7a2f;
  transform: translateY(-3px);
}

/* BOTTOM BAR */

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  padding: 19px 0 24px;
  border-top: 1px solid #25313a;
}

.footer__bottom p {
  color: #6f7d87;
  font-size: 11px;
  line-height: 1.6;
}

/* RESPONSIVE */

@media (max-width: 760px) {
  .footer__container {
    width: calc(100% - 40px);
  }

  .footer__top {
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 26px;
  }

  .footer__brand {
    width: 100%;
    max-width: none;
  }

  .footer__navigation {
    flex: 1;
    gap: 20px;
  }

  .footer__quote-section {
    min-height: 210px;
    padding: 40px 20px;
  }

  .footer__symbol {
    right: -15px;
    font-size: 160px;
  }
}

@media (max-width: 480px) {
  .footer__quote {
    font-size: 32px;
  }

  .footer__top {
    padding: 34px 0;
  }

  .footer__bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
