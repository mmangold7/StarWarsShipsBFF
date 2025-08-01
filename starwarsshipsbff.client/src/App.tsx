import { useEffect, useState } from 'react';
import './App.css';

interface Starship {
  name: string;
  model: string;
  starship_class: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  crew: string;
  passengers: string;
  max_atmosphering_speed: string;
  hyperdrive_rating: string;
  MGLT: string;
  cargo_capacity: string;
  consumables: string;
  films: string[];
  pilots: string[];
  url: string;
  created: string;
  edited: string;
}

function App() {
    const [starships, setStarships] = useState<Starship[]>();

    useEffect(() => {
        populateStarshipsData();
    }, []);

    const contents = starships === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Class</th>
                    <th>Manufacturer</th>
                </tr>
            </thead>
            <tbody>
                {starships.map(starship =>
                    <tr key={starship.name}>
                        <td>{starship.name}</td>
                        <td>{starship.model}</td>
                        <td>{starship.starship_class}</td>
                        <td>{starship.manufacturer}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Star Wars Starships</h1>
            {contents}
        </div>
    );

    async function populateStarshipsData() {
        const response = await fetch('starships');
        if (response.ok) {
            const data = await response.json();
            setStarships(data);
        }
    }
}

export default App;