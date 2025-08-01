import { useEffect, useState } from 'react';
import './App.css';

// matches the dto from the BFF
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
    const [authorized, setAuthorized] = useState(false);

    return authorized
        ? <StarshipsPage />
        : <LoginPage onSuccess={() => setAuthorized(true)} />;
}

function LoginPage({ onSuccess }: { onSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function submitLogin(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: username, pass: password })
        });
        if (res.ok) onSuccess();
        else setError('Invalid credentials');
    }

    return (
        <div className="p-4" style={{ maxWidth: 320 }}>
            <h2 className="mb-3">Star Wars Starships - Login</h2>
            <form onSubmit={submitLogin}>
                <input className="form-control mb-2"
                    placeholder="User"
                    value={username}
                    onChange={e => setUsername(e.target.value)} />
                <input className="form-control mb-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)} />
                {error && <div className="text-danger mb-2">{error}</div>}
                <br />
                <button className="btn btn-primary w-100">Sign in</button>
            </form>
        </div>
    );
}

function StarshipsPage() {
    const [allStarships, setAllStarships] = useState<Starship[]>();
    const [filteredStarships, setFilteredStarships] = useState<Starship[]>();
    const [selectedManufacturer, setSelectedManufacturer] = useState<string>();

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const response = await fetch('starships');

        if (!response.ok) return;

        const data = await response.json() as Starship[];
        setAllStarships(data);
        setFilteredStarships(data); // on initial load show all starships
    }

    function filterByManufacturer(e: React.ChangeEvent<HTMLSelectElement>) {
        const newlySelectedManufacturer = e.target.value;
        setSelectedManufacturer(newlySelectedManufacturer);

        if (newlySelectedManufacturer === '') {
            setFilteredStarships(allStarships);
        } else {
            setFilteredStarships(
                (allStarships ?? []).filter(s => s.manufacturer.includes(newlySelectedManufacturer))
            );
        }
    }

    // I tried a naive split, but realized that some manufacturers have commas in their names or are separated by a /, so we need more complicated logic
    function splitManufacturers(raw: string): string[] {
        // at least one record uses a forward slash to separate manufacturers
        const slashParts = raw.split('/').map(s => s.trim());

        // the rest use commas, but some manufacturers also have a comma in their name followed by inc, inc., or incorporated
        // so we can notice those "incs" and append them back, instead of adding them as new manufacturers
        const troublesomeSuffixes = new Set(['inc', 'inc.', 'incorporated']);
        const result: string[] = [];

        const normalise = (name: string): string => {
            // fix typo to prevent duplicate
            if (/^cyngus spaceworks$/i.test(name)) return 'Cygnus Spaceworks';

            // standardize Inc variants to prevent duplicates
            const m = name.match(/^(.*?),\s*(inc\.?|incorporated)$/i);
            if (m) return `${m[1].trim()}, Inc.`;
            return name.trim();
        };

        for (const part of slashParts) {
            const commaParts = part.split(',').map(s => s.trim());
            for (const token of commaParts) {
                // standardize for comparison
                const lower = token.toLowerCase().replace(/\.$/, '');
                // check whether we split a manufacturer that ends with the troublesome suffixes
                if (result.length > 0 && troublesomeSuffixes.has(lower)) {
                    // that's not a manufacturer, it was a suffix, so put it back together in a standardized way
                    result[result.length - 1] = normalise(`${result[result.length - 1]}, ${token}`);
                } else {
                    // that's just another manufacturer
                    result.push(normalise(token));
                }
            }
        }

        return result;
    }

    const manufacturers = Array.from(
        new Set((allStarships ?? []).flatMap(s => splitManufacturers(s.manufacturer)))
    ).sort();

    const contents = allStarships === undefined
        ? <p><em>Loading...</em></p>
        : <>
            <p>Use the dropdown to filter by manufacturer:</p>
            <select
                className="form-select mb-3"
                value={selectedManufacturer}
                onChange={filterByManufacturer}
            >
                <option value="">All Manufacturers</option>
                {manufacturers.map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <p><em>Showing {filteredStarships?.length ?? 0} of {allStarships?.length ?? 0} starships</em></p>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Model</th>
                        <th>Class</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody>
                    {(filteredStarships ?? []).map(s => (
                        <tr key={s.name}>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.model}</td>
                            <td>{s.starship_class}</td>
                            <td>{s.manufacturer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>

    return (
        <div>
            <h1 id="tableLabel">Star Wars Starships</h1>
            {contents}
        </div>
    );
}

export default App;
