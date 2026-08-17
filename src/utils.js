const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export function formatPrice(value) {
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatDate(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate) {
  const date = new Date(isoDate + 'T00:00:00');
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getRouteLabel(route) {
  if (!route?.length) return '';
  if (route.length === 1) return route[0];
  return `${route[0]} → ${route[route.length - 1]}`;
}

export function getNearestDeparture(departures) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = departures
    .map((d) => new Date(d + 'T00:00:00'))
    .filter((d) => d >= today)
    .sort((a, b) => a - b);

  if (upcoming.length > 0) {
    return upcoming[0].toISOString().slice(0, 10);
  }

  return departures.sort()[0];
}

export function getMonthLabel(monthNumber) {
  return MONTHS[monthNumber - 1];
}

export function getAllDepartureDates(trains) {
  const dates = new Set();
  trains.forEach((train) => {
    train.departures.forEach((d) => dates.add(d));
  });
  return [...dates].sort();
}

export function getUniqueRegions(trains) {
  return [...new Set(trains.map((t) => t.region))].sort();
}

export function filterTrains(trains, { search, region, departureDate }) {
  return trains.filter((train) => {
    const matchesSearch =
      !search ||
      train.name.toLowerCase().includes(search.toLowerCase().trim());

    const matchesRegion = !region || train.region === region;

    const matchesDate =
      !departureDate || train.departures.includes(departureDate);

    return matchesSearch && matchesRegion && matchesDate;
  });
}

export function pluralDays(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} дней`;
  if (mod10 === 1) return `${n} день`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} дня`;
  return `${n} дней`;
}
