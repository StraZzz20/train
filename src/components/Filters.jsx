import { getAllDepartureDates, getUniqueRegions } from '../utils';
import DatePicker from './DatePicker';

export default function Filters({
  trains,
  search,
  region,
  departureDate,
  onSearchChange,
  onRegionChange,
  onDepartureDateChange,
}) {
  const regions = getUniqueRegions(trains);
  const availableDates = getAllDepartureDates(trains);

  return (
    <section className="filters" aria-label="Фильтры поездов">
      <div className="filters__search">
        <label htmlFor="search" className="visually-hidden">Поиск по названию</label>
        <input
          id="search"
          type="search"
          placeholder="Поиск по названию поезда…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filters__selects">
        <div className="filters__field">
          <label htmlFor="region">Регион</label>
          <div className="select-wrapper">
            <select id="region" value={region} onChange={(e) => onRegionChange(e.target.value)}>
              <option value="">Все регионы</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filters__field filters__field--date">
          <DatePicker
            availableDates={availableDates}
            value={departureDate}
            onChange={onDepartureDateChange}
          />
        </div>
      </div>
    </section>
  );
}
