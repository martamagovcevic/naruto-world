import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { villageOrder, villages } from "../data/villages";
import { characters } from "../data/character";
import konohaImage from "../assets/images/villages/hiddne-leaf-village.png";
import sunaImage from "../assets/images/villages/sungakure.png";
import kiriImage from "../assets/images/villages/misty-village.png";
import kumoImage from "../assets/images/villages/cloud-village.png";
import iwaImage from "../assets/images/villages/hidden-stone-village.png";
import "./VillagesPage.css";

const villageImages: Readonly<Record<string, string>> = {
  konoha: konohaImage,
  suna: sunaImage,
  kiri: kiriImage,
  kumo: kumoImage,
  iwa: iwaImage,
};
const mapRegions = [
  {
    id: "suna", x: 91, y: 104, number: "01", terrain: "DESERT",
    path: "M28 93 C38 84 42 60 59 54 L83 41 102 49 119 42 140 55 151 77 144 98 151 113 139 138 119 146 103 160 82 151 64 158 45 144 24 132 29 111Z",
    fill: "#3b342b",
  },
  {
    id: "kumo", x: 258, y: 83, number: "02", terrain: "HIGHLANDS",
    path: "M182 61 199 48 212 29 230 37 250 24 269 31 285 43 301 40 314 57 334 64 328 88 339 105 325 126 297 127 283 139 265 130 245 144 223 129 202 135 191 116 177 101 187 81Z",
    fill: "#263743",
  },
  {
    id: "kiri", x: 459, y: 110, number: "03", terrain: "ISLANDS",
    path: "M383 74 C395 58 416 59 431 47 451 43 461 50 478 43 501 56 518 63 531 82 L525 104 542 121 527 141 531 158 506 173 493 168 476 182 452 173 433 181 415 166 394 168 390 144 375 129 385 105Z",
    fill: "#233c44",
  },
  {
    id: "konoha", x: 215, y: 272, number: "04", terrain: "WOODLAND",
    path: "M148 222 162 209 176 211 186 191 207 193 226 180 243 197 261 194 278 213 282 237 303 254 292 275 298 297 287 317 269 319 257 344 230 341 218 357 193 346 173 350 159 332 140 328 133 306 118 291 133 268 126 246Z",
    fill: "#2c3d32",
  },
  {
    id: "iwa", x: 431, y: 278, number: "05", terrain: "MOUNTAINS",
    path: "M344 244 361 229 378 224 391 206 409 215 428 200 450 215 473 211 490 231 509 228 528 248 520 269 535 288 524 310 508 320 496 347 468 344 452 362 430 351 411 361 390 346 367 346 354 329 333 312 346 290 331 268Z",
    fill: "#383b39",
  },
] as const;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const getRequestedVillage = (search: string): string | null => {
  const params = new URLSearchParams(search);
  const requested = params.get("village");

  return requested && villages.some((village) => village.id === requested)
    ? requested
    : null;
};

export default function VillagesPage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(() => {
    const requested = getRequestedVillage(window.location.search);
    return requested ?? "konoha";
  });
  const [isPanelOpen, setPanelOpen] = useState(
    () => getRequestedVillage(window.location.search) !== null,
  );
  const panelRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<SVGGElement | HTMLButtonElement | null>(null);

  const selectedVillage =
    villages.find((village) => village.id === selectedId) ?? villages[0];
  const villageCharacters = useMemo(
    () =>
      selectedVillage.characterIds
        .map((id) => characters.find((character) => character.id === id))
        .filter((character) => character !== undefined),
    [selectedVillage],
  );
  const villageStyle = {
    "--village-accent": selectedVillage.accentColor,
  } as CSSProperties;

  const openVillage = useCallback(
    (id: string, trigger: SVGGElement | HTMLButtonElement | null) => {
      setSelectedId(id);
      lastTriggerRef.current = trigger;
      setPanelOpen(true);
    },
    [],
  );

  const orderedVillages = useMemo(
    () =>
      villageOrder
        .map((id) => villages.find((village) => village.id === id))
        .filter((village) => village !== undefined),
    [],
  );
  const selectedIndex = orderedVillages.findIndex(
    (village) => village.id === selectedId,
  );
  const prevVillage =
    orderedVillages[
      (selectedIndex - 1 + orderedVillages.length) % orderedVillages.length
    ];
  const nextVillage =
    orderedVillages[(selectedIndex + 1) % orderedVillages.length];
  const goToVillage = useCallback((id: string) => {
    setSelectedId(id);
    setPanelOpen(true);
  }, []);

  const closedPanel = useCallback(() => {
    setPanelOpen(false);
    lastTriggerRef.current?.focus();
  }, []);

  const selectRegion = useCallback(
    (region: (typeof mapRegions)[number]) => {
      const marker = document.getElementById(
        `village-marker-${region.id}`,
      ) as SVGGElement | null;

      lastTriggerRef.current = marker;
      marker?.focus();
      openVillage(region.id, null);
    },
    [openVillage],
  );

  const handleTerritoryKeyDown = useCallback(
    (
      event: React.KeyboardEvent<SVGGElement>,
      region: (typeof mapRegions)[number],
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectRegion(region);
      }
    },
    [selectRegion],
  );

  const handleMarkerKeyDown = useCallback(
    (
      event: React.KeyboardEvent<SVGGElement>,
      region: (typeof mapRegions)[number],
    ) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openVillage(region.id, event.currentTarget);
      }
    },
    [openVillage],
  );

  useEffect(() => {
    if (!isPanelOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;

    const panel = panelRef.current;

    if (panel) {
      panel.focus();
    }

    return undefined;
  }, [isPanelOpen]);

  useEffect(() => {
    if (!isPanelOpen) return;

    panelRef.current?.scrollTo({ top: 0 });
  }, [selectedId, isPanelOpen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("village");

    if (!requested) return;

    params.delete("village");
    const query = params.toString();
    navigate(`${window.location.pathname}${query ? `?${query}` : ""}`, {
      replace: true,
    });
  }, [navigate]);

  useEffect(() => {
    if (!isPanelOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();

        closedPanel();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isPanelOpen, closedPanel]);

  useEffect(() => {
    if (!isPanelOpen) return;

    const panel = panelRef.current;

    if (!panel) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey) {
        if (current === first || !panel.contains(current)) {
          event.preventDefault();

          last.focus();
        }
      } else if (current === last || !panel.contains(current)) {
        event.preventDefault();

        first.focus();
      }
    };

    panel.addEventListener("keydown", onKeyDown);

    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [isPanelOpen]);

  return (
    <main className="villages-page">
      <div className="villages-page__container">
        <header className="villages-page__header">
          <span className="villages-page__eyebrow">
            EXPLORE THE SHINOBI WORLD
          </span>
          <h1>THE FIVE GREAT NINJA VILLAGES</h1>
          <p>
            Five nations. Five hidden villages. Discover the places that shaped
            the shinobi world.
          </p>
        </header>
        <section
          className="villages-explorer"
          aria-label="Explore the five great ninja villages"
        >
          <div className="villages-explorer__map">
            <div className="villages-map">
              <div className="villages-map__canvas">
                <svg
                  className="villages-map__svg"
                  viewBox="0 0 560 390"
                  role="group"
                  aria-label="Interactive, stylized map of the five great ninja villages. Select a region or its marker to display village details."
                >
                  <defs>
                    <radialGradient id="village-map-glow">
                      <stop offset="0%" stopColor={selectedVillage.accentColor} stopOpacity="0.33" />
                      <stop offset="100%" stopColor={selectedVillage.accentColor} stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="village-map-ocean">
                      <stop offset="0%" stopColor="#20333c" />
                      <stop offset="100%" stopColor="#0b151d" />
                    </radialGradient>
                    <pattern id="village-map-water" width="38" height="23" patternUnits="userSpaceOnUse">
                      <path d="M0 8 Q9 3 19 8 T38 8 M-10 19 Q0 14 10 19 T30 19" fill="none" stroke="#6a9eab" strokeWidth="0.65" opacity="0.13" />
                    </pattern>
                    <filter id="village-map-soft-glow" x="-100%" y="-100%" width="300%" height="300%">
                      <feGaussianBlur stdDeviation="4" />
                    </filter>
                    {mapRegions.map((region) => (
                      <clipPath key={region.id} id={`village-map-clip-${region.id}`}>
                        <path d={region.path} />
                      </clipPath>
                    ))}
                  </defs>
                  <rect width="560" height="390" fill="url(#village-map-ocean)" />
                  <rect width="560" height="390" fill="url(#village-map-water)" />
                  <g className="villages-map__sea-contours" fill="none" stroke="#88a8b5" strokeWidth="0.65">
                    <path d="M0 176 Q67 151 111 186 T229 171 T350 197 T560 177" />
                    <path d="M0 188 Q67 163 111 198 T229 183 T350 209 T560 189" />
                    <path d="M-10 376 Q77 345 107 378 T269 375 T408 374 T570 363" />
                    <path d="M3 15 Q53 35 72 13 M352 22 Q387 10 412 26 M525 14 Q541 28 566 17" />
                  </g>
                  <g className="villages-map__contours" fill="none" stroke="#7e98a4" strokeWidth="0.5">
                    <path d="M-4 205 Q79 181 126 214 T243 199 T368 224 T570 205" opacity="0.5" />
                    <path d="M-4 222 Q80 198 128 231 T247 217 T372 243 T572 222" opacity="0.4" />
                    <path d="M18 36 Q65 54 86 34 M336 30 Q373 20 396 36" opacity="0.5" />
                    <path d="M20 366 Q110 384 172 366 M376 358 Q452 376 512 360" opacity="0.5" />
                  </g>
                  <g className="villages-map__territory-details" aria-hidden="true" fill="none">
                    <path d="M44 97 Q66 76 91 80 M33 119 Q54 100 78 104 M52 141 Q72 126 92 129 M125 62 Q141 50 156 55 M115 133 Q133 123 149 126" stroke="#8a7557" strokeWidth="0.7" opacity="0.5" />
                    <path d="M222 32 Q242 24 259 30 M288 41 Q306 35 321 42" stroke="#91acbf" strokeWidth="0.7" opacity="0.5" />
                    <path d="M492 58 Q512 52 530 59 M503 92 Q520 86 535 93" stroke="#7fb1bb" strokeWidth="0.7" opacity="0.5" />
                    <path d="M260 197 Q279 191 297 197" stroke="#7da686" strokeWidth="0.7" opacity="0.5" />
                    <path d="M442 245 Q461 238 479 245" stroke="#9a9486" strokeWidth="0.7" opacity="0.5" />
                  </g>
                  <circle
                    className="villages-map__ambient-glow"
                    cx={mapRegions.find((region) => region.id === selectedId)?.x ?? 215}
                    cy={mapRegions.find((region) => region.id === selectedId)?.y ?? 272}
                    r="118"
                    fill="url(#village-map-glow)"
                    pointerEvents="none"
                  />
                  <g className="villages-map__territories">
                    {mapRegions.map((region) => {
                      const village = villages.find((item) => item.id === region.id);
                      if (!village) return null;
                      const isActive = selectedId === region.id;
                      return (
                        <g
                          key={region.id}
                          className={`villages-map__region ${isActive ? "villages-map__region--active" : ""}`}
                          style={{ "--map-accent": village.accentColor } as CSSProperties}
                          role="button"
                          tabIndex={0}
                          aria-label={`Select ${village.name}, ${village.shortName}`}
                          onClick={() => openVillage(region.id, null)}
                          onKeyDown={(event) => handleTerritoryKeyDown(event, region)}
                        >
                          <path className="villages-map__region-shape" d={region.path} fill={region.fill} />
                          <g className="villages-map__terrain" clipPath={`url(#village-map-clip-${region.id})`}>
                            {region.id === "suna" && (
                              <g className="villages-map__dunes" fill="none" stroke="#c4a66b" strokeWidth="1.15">
                                <path d="M14 82 Q50 53 88 77 T166 70 M8 99 Q51 71 89 96 T166 90 M3 117 Q49 88 93 114 T173 107 M3 135 Q52 108 92 131 T167 129 M8 153 Q51 131 92 152 T169 147" />
                                <path d="M25 59 Q55 39 80 58 T138 48 M37 170 Q76 145 113 165 T160 154" opacity="0.45" />
                                <path d="M45 94l11 -4 M118 64l9 -3 M48 128l12 -4 M117 133l10 -3" strokeWidth="2" opacity="0.55" />
                                <g className="villages-map__sand-drift" fill="#c4a66b" opacity="0.7">
                                  <circle cx="58" cy="120" r="1.4" />
                                  <circle cx="92" cy="70" r="1.6" />
                                  <circle cx="128" cy="88" r="1.3" />
                                  <circle cx="45" cy="142" r="1.5" />
                                  <circle cx="112" cy="132" r="1.7" />
                                </g>
                              </g>
                            )}
                            {region.id === "kumo" && (
                              <g className="villages-map__mountain-lines" fill="none" stroke="#a0bbcb" strokeWidth="1.2">
                                <path d="M172 105 201 62 218 80 248 40 274 77 291 54 329 103" />
                                <path d="M174 122 201 79 220 95 246 57 273 93 293 72 335 122" opacity="0.6" />
                                <path d="M196 127 221 104 238 113 258 87 277 105 300 91 329 117" opacity="0.5" />
                                <path d="M239 53 248 40 257 55 M195 71 201 62 207 72 M285 64 291 54 299 67" stroke="#dfebef" />
                                <path d="M188 112 Q215 104 241 110 T296 113 T340 108 M190 119 Q220 112 246 118 T310 120" strokeWidth="2" opacity="0.3" />
                                <g className="villages-map__clouds" fill="#cfd9de" opacity="0.2">
                                  <path d="M236 44a8 8 0 1 1 0-16 10 10 0 0 1 20 0 9 9 0 0 1 1 18z" />
                                  <path d="M270 58a7 7 0 1 1 0-14 9 9 0 0 1 17 0 8 8 0 0 1 1 15z" />
                                  <path d="M250 74a6 6 0 1 1 0-12 8 8 0 0 1 15 0 7 7 0 0 1 1 13z" />
                                </g>
                              </g>
                            )}
                            {region.id === "kiri" && (
                              <g className="villages-map__mist" fill="none" stroke="#a9d5d9" strokeWidth="1.1">
                                <path d="M371 82 Q404 72 431 85 T489 85 T550 82 M370 97 Q401 87 429 101 T491 100 T552 97 M368 118 Q402 106 432 119 T495 120 T556 117 M366 137 Q405 126 433 140 T497 139 T560 136 M372 155 Q406 144 440 157 T501 158 T560 154" />
                                <path d="M393 64 Q424 52 449 64 T504 65 M396 171 Q429 158 457 172 T517 173" opacity="0.48" />
                                <ellipse cx="454" cy="115" rx="76" ry="19" fill="#9fc7cb" fillOpacity="0.08" stroke="none" filter="url(#village-map-soft-glow)" />
                              </g>
                            )}
                            {region.id === "konoha" && (
                              <g className="villages-map__forest" fill="none" stroke="#91b99b" strokeWidth="1.1">
                                <path d="M112 262 Q165 225 213 245 T319 224 M109 291 Q159 252 217 276 T316 250 M116 320 Q171 283 218 302 T313 281 M141 341 Q193 314 234 330 T304 310" opacity="0.38" />
                                {[[153,241],[174,223],[198,220],[231,218],[257,228],[275,249],[154,275],[181,264],[252,263],[281,284],[149,309],[176,318],[202,333],[238,323],[261,310]].map(([x,y]) => (
                                  <path key={`${x}-${y}`} d={`M${x} ${y+8}v-12 m-7 7 7-11 7 11 m-12-4 5-9 5 9`} strokeWidth="1.4" />
                                ))}
                                <g className="villages-map__leaves" fill="#9cd08a">
                                  <path d="M168 300l-2-5 4-3 2 5z" />
                                  <path d="M238 338l-2-5 4-3 2 5z" />
                                  <path d="M196 256l-2-5 4-3 2 5z" />
                                  <path d="M282 300l-2-5 4-3 2 5z" />
                                </g>
                              </g>
                            )}
                            {region.id === "iwa" && (
                              <g className="villages-map__stone" fill="none" stroke="#bdc4bb" strokeWidth="1.2">
                                <path d="M328 289 365 247 384 268 414 222 439 257 463 232 504 284 534 254" />
                                <path d="M326 313 363 270 388 291 417 248 445 282 465 254 509 308 537 278" opacity="0.65" />
                                <path d="M345 339 370 310 391 324 420 287 441 306 470 285 502 336" opacity="0.5" />
                                <path d="M406 233 414 222 423 236 M454 244 463 232 473 246 M356 257 365 247 373 257" stroke="#e1e4d8" />
                                <path d="M344 322 359 317 370 328 391 317 408 332 423 317 443 336 465 315 482 335 512 322" strokeWidth="2" opacity="0.24" />
                              </g>
                            )}
                          </g>
                          <path className="villages-map__region-outline" d={region.path} fill="none" />
                          {isActive && <path className="villages-map__region-highlight" d={region.path} fill={village.accentColor} fillOpacity="0.10" pointerEvents="none" />}
                          {isActive && (
                            <path
                              key={`region-flash-${selectedId}`}
                              className="villages-map__region-flash"
                              d={region.path}
                              fill="none"
                              pointerEvents="none"
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                  <g className="villages-map__routes" aria-hidden="true">
                    <path d="M91 104 Q151 159 215 272 Q321 207 431 278 Q463 197 459 110 Q364 58 258 83 Q180 51 91 104" />
                    <circle cx="157" cy="181" r="2" /><circle cx="322" cy="236" r="2" /><circle cx="373" cy="88" r="2" />
                  </g>
                  {mapRegions.map((region) => {
                    const village = villages.find((item) => item.id === region.id);
                    if (!village) return null;
                    const isActive = selectedId === region.id;
                    return (
                      <g
                        key={region.id}
                        id={`village-marker-${region.id}`}
                        className={`villages-map__marker ${isActive ? "villages-map__marker--active" : ""}`}
                        style={{ "--map-accent": village.accentColor } as CSSProperties}
                        role="button"
                        tabIndex={0}
                        aria-label={`Select ${village.name}, ${village.shortName}`}
                        aria-pressed={isActive}
                        onClick={() => openVillage(region.id, null)}
                        onKeyDown={(event) => handleMarkerKeyDown(event, region)}
                      >
                        <circle cx={region.x} cy={region.y} r="34" fill="transparent" className="villages-map__marker-hit" />
                        <circle cx={region.x} cy={region.y} r="27" className="villages-map__marker-ring" fill="none" />
                        {isActive && <circle cx={region.x} cy={region.y} r="31" className="villages-map__active-ring" fill="none" stroke={village.accentColor} strokeWidth="0.85" strokeDasharray="2 5" />}
                        {isActive && (
                          <circle
                            key={`chakra-pulse-${selectedId}`}
                            cx={region.x}
                            cy={region.y}
                            r="20"
                            className="villages-map__chakra-pulse"
                            fill="none"
                            stroke={village.accentColor}
                            strokeWidth="1.6"
                          />
                        )}
                        <circle cx={region.x} cy={region.y} r="19" className="villages-map__marker-core" fill="#101c24" stroke={village.accentColor} strokeWidth={isActive ? 2 : 1.2} />
                        <text x={region.x} y={region.y+6} className="villages-map__marker-symbol" textAnchor="middle" fill={village.accentColor} fontSize="19">{village.symbol}</text>
                        <text x={region.x} y={region.y+43} textAnchor="middle" className="villages-map__label" fill={isActive ? "#fff" : "#acbac2"}>{village.shortName.toUpperCase()}</text>
                        <text x={region.x+33} y={region.y-24} className="villages-map__index" fill={village.accentColor}>{region.number}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="villages-map__mobile-picker" aria-label="Choose a village">
                {mapRegions.map((region) => {
                  const village = villages.find((item) => item.id === region.id);
                  if (!village) return null;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      className={`villages-map__mobile-button ${selectedId === region.id ? "villages-map__mobile-button--active" : ""}`}
                      style={{ "--map-accent": village.accentColor } as CSSProperties}
                      onClick={() => openVillage(region.id, null)}
                      aria-label={`Select ${village.name}`}
                      aria-pressed={selectedId === region.id}
                    >
                      <span className="villages-map__mobile-symbol">{village.symbol}</span><span className="villages-map__mobile-name">{village.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      {createPortal(
        <div
          className={`village-panel-layer ${isPanelOpen ? "village-panel-layer--open" : ""}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closedPanel();
            }
          }}
        >
          <div className="village-panel">
            <div
              ref={panelRef}
              className="village-panel__body"
              role="dialog"
              aria-modal="true"
              aria-labelledby="village-panel-title"
              tabIndex={-1}
              style={villageStyle}
            >
              <header className="village-panel__hero">
                <button
                  type="button"
                  className="village-panel__close"
                  onClick={closedPanel}
                  aria-label="Close village information"
                >
                  ✕
                </button>
                <span className="village-panel__hero-symbol" aria-hidden="true">
                  {selectedVillage.symbol}
                </span>
                <img
                  src={villageImages[selectedVillage.id]}
                  alt={`Landscape of ${selectedVillage.name}`}
                  className="village-panel__hero-image"
                  loading="eager"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="village-panel__hero-overlay" aria-hidden="true" />
                <div className="village-panel__heading-text">
                  <h2 id="village-panel-title">{selectedVillage.name}</h2>
                  <p className="village-panel__subtitle">
                    {selectedVillage.subtitle}
                  </p>
                  <span className="village-panel__country">
                    {selectedVillage.country}
                  </span>
                </div>
              </header>
              <div className="village-panel__content">
                <section
                  className="village-panel__section"
                  aria-label="Village overview"
                >
                  <p className="village-panel__description">
                    {selectedVillage.description}
                  </p>
                </section>
                <section
                  className="village-panel__section"
                  aria-label="Country and leadership"
                >
                  <div className="village-panel__meta">
                    <div className="village-panel__meta-row">
                      <span className="village-panel__meta-label">Country</span>
                      <strong className="village-panel__meta-value">
                        {selectedVillage.country}
                      </strong>
                    </div>
                    <div className="village-panel__meta-row">
                      <span className="village-panel__meta-label">Leader</span>
                      <strong className="village-panel__meta-value">
                        {selectedVillage.leaderTitle}
                      </strong>
                    </div>
                  </div>
                </section>
                <section
                  className="village-panel__section"
                  aria-label="Notable shinobi"
                >
                  <div className="village-panel__section-heading">
                    <h3 className="village-panel__section-title">
                      NOTABLE SHINOBI
                    </h3>
                    {villageCharacters.length > 0 && (
                      <span className="village-panel__shinobi-count">
                        {villageCharacters.length}
                      </span>
                    )}
                  </div>
                  {villageCharacters.length > 0 ? (
                    <div className="village-panel__character-grid">
                      {villageCharacters.map((character) => (
                        <Link
                          key={character.id}
                          to={`/characters/${character.id}`}
                          className="village-panel__character"
                        >
                          <img
                            src={character.image}
                            alt=""
                            loading="lazy"
                          />
                          <span>{character.name}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="village-panel__empty">
                      Shinobi profiles for this village are coming soon.
                    </p>
                  )}
                </section>
                <nav className="village-panel__nav" aria-label="Browse villages">
                  <button
                    type="button"
                    className="village-panel__nav-button village-panel__nav-button--prev"
                    onClick={() => goToVillage(prevVillage.id)}
                    aria-label={`Show previous village: ${prevVillage.name}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                  <span className="village-panel__nav-marker" aria-hidden="true">
                    {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                    {String(villageOrder.length).padStart(2, "0")}
                  </span>
                  <button
                    type="button"
                    className="village-panel__nav-button village-panel__nav-button--next"
                    onClick={() => goToVillage(nextVillage.id)}
                    aria-label={`Show next village: ${nextVillage.name}`}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </main>
  );
}