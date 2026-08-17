import {
  formatPrice,
  formatShortDate,
  getNearestDeparture,
  getRouteLabel,
  pluralDays,
} from '../utils';

export default function TrainCard({ train, onClick }) {
  const nearest = getNearestDeparture(train.departures);

  return (
    <article className="train-card" onClick={() => onClick(train)} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(train)}>
      <div className="train-card__header">
        <span className="train-card__region">{train.region}</span>
        <span className="train-card__duration">{pluralDays(train.duration_days)}</span>
      </div>
      <h2 className="train-card__title">{train.name}</h2>
      <p className="train-card__route">{getRouteLabel(train.route)}</p>
      <div className="train-card__footer">
        <div className="train-card__departure">
          <span className="train-card__label">Ближайший рейс</span>
          <span className="train-card__date">{formatShortDate(nearest)}</span>
        </div>
        <div className="train-card__price">
          <span className="train-card__label">от</span>
          <span className="train-card__amount">{formatPrice(train.price_from)} ₽</span>
        </div>
      </div>
    </article>
  );
}
