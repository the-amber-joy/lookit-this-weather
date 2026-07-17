// Maps WMO weather codes to a representative emoji, then swaps the page favicon
// so the browser tab reflects the current conditions.

function getWeatherEmoji(weatherCode: number, isDay: number): string {
  const day = isDay === 1;

  if ([95, 96, 99].includes(weatherCode)) return "⛈️";
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "🌨️";
  if ([66, 67].includes(weatherCode)) return "🧊";
  if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) return "🌧️";
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return "🌦️";
  if ([45, 48].includes(weatherCode)) return "🌫️";
  if (weatherCode === 3) return "☁️";
  if (weatherCode === 2) return day ? "⛅" : "☁️";
  // Clear or mainly clear (codes 0 and 1).
  return day ? "☀️" : "🌙";
}

export function setWeatherFavicon(weatherCode: number, isDay: number): void {
  const emoji = getWeatherEmoji(weatherCode, isDay);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  const href = `data:image/svg+xml,${encodeURIComponent(svg)}`;

  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = href;
}
