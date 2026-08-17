import {
  formatDate,
  formatPrice,
  getRouteLabel,
  pluralDays,
} from '../utils';

export default function TrainDetail({ train, onBack }) {
  return (
    <article className="train-detail">
      <button type="button" className="train-detail__back" onClick={onBack}>
        ← Назад к списку
      </button>

      <header className="train-detail__header">
        <span className="train-detail__region">{train.region}</span>
        <h1 className="train-detail__title">{train.name}</h1>
        <p className="train-detail__route">{getRouteLabel(train.route)}</p>
        <p className="train-detail__meta">{pluralDays(train.duration_days)} · от {formatPrice(train.price_from)} ₽</p>
      </header>

      <p className="train-detail__description">{train.description}</p>

      <section className="train-detail__section">
        <h2>Маршрут</h2>
        <p className="train-detail__route-full">{train.route.join(' → ')}</p>
      </section>

      <section className="train-detail__section">
        <h2>Даты отправления</h2>
        <ul className="train-detail__dates">
          {train.departures.map((d) => (
            <li key={d}>{formatDate(d)}</li>
          ))}
        </ul>
      </section>

      <section className="train-detail__section">
        <h2>Экскурсии</h2>
        <ul className="train-detail__excursions">
          {train.excursions.map((exc) => (
            <li key={exc}>{exc}</li>
          ))}
        </ul>
      </section>

      <div className="train-detail__tags">
        {train.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <a
        className="train-detail__buy"
        href={train.buy_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Купить билет
      </a>
    </article>
  );
}
