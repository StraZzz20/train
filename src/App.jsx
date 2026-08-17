import { useEffect, useMemo, useState } from 'react';
import Filters from './components/Filters';
import TrainCard from './components/TrainCard';
import TrainDetail from './components/TrainDetail';
import { filterTrains } from './utils';

export default function App() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);

  useEffect(() => {
    fetch('./trains.json')
      .then((res) => {
        if (!res.ok) throw new Error('Не удалось загрузить данные');
        return res.json();
      })
      .then((data) => setTrains(data.trains))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTrain]);

  const filteredTrains = useMemo(
    () => filterTrains(trains, { search, region, departureDate }),
    [trains, search, region, departureDate],
  );

  if (loading) {
    return (
      <div className="app">
        <div className="status-message">Загрузка поездов…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="status-message status-message--error">{error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__inner">
          <p className="hero__eyebrow">РЖД · Туристические поезда</p>
          <h1 className="hero__title">Витрина туристских поездов</h1>
          <p className="hero__subtitle">
            Путешествия по России в комфортабельных поездах — от выходных до круизов
          </p>
        </div>
      </header>

      <main className="main">
        {selectedTrain ? (
          <TrainDetail train={selectedTrain} onBack={() => setSelectedTrain(null)} />
        ) : (
          <>
            <Filters
              trains={trains}
              search={search}
              region={region}
              departureDate={departureDate}
              onSearchChange={setSearch}
              onRegionChange={setRegion}
              onDepartureDateChange={setDepartureDate}
            />

            {filteredTrains.length === 0 ? (
              <p className="empty-state">По вашему запросу поездов не найдено</p>
            ) : (
              <div className="train-grid">
                {filteredTrains.map((train) => (
                  <TrainCard
                    key={train.id}
                    train={train}
                    onClick={setSelectedTrain}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="footer">
        <p>Данные загружаются из trains.json · Прототип витрины туристских поездов</p>
      </footer>
    </div>
  );
}
