import { Routes, Route, BrowserRouter, Link, useParams, Outlet, useMatch, NavLink } from 'react-router-dom';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import * as Separator from '@radix-ui/react-separator';
import sedi, { formatDuration } from './sedi';
import { useState } from 'react';
import {
  Card,
  BarChart,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Badge
} from '@tremor/react';

import logo from './logo.png';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/" element={<ListaSedi />}>
            <Route path=":id" element={<DettaglioSede />}></Route>
          </Route>
          <Route path="/parametri" element={<Parametri />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

function Header() {
  const match = useMatch(':id');

  return (
    <div className="w-full">
      <header className="sticky top-0 z-40 border-b bg-white py-1 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            <img src={logo} className="h-8" />
            <h1 className="my-3 text-xl font-semibold">Monitoraggio situazione sedi</h1>
          </div>
          <div className="flex gap-x-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-lg px-2 py-1 text-gray-400 ${
                  (isActive || (match && match.params.id !== 'parametri')) && 'bg-blue-100 text-blue-500'
                }`
              }
            >
              Situazione sedi
            </NavLink>
            <NavLink
              end
              to="/parametri"
              className={({ isActive }) =>
                `rounded-lg px-2 py-1 text-gray-400 ${isActive && 'bg-blue-100 text-blue-500'}`
              }
            >
              Parametri
            </NavLink>
          </div>
        </div>
      </header>
      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </div>
  );
}

const alertClassNames = {
  1: 'bg-green-600',
  2: 'bg-yellow-500',
  3: 'bg-red-600',
  4: 'bg-black'
};

function ListaSedi() {
  const match = useMatch(':id');
  const [filtroRegioni, setFiltroRegioni] = useState(['liguria', 'piemonte', 'emilia']);
  const [filtroSede, setFiltroSede] = useState('');

  const sediFiltrate = sedi.filter(
    (sede) => filtroRegioni.includes(sede.regione) && sede.descrizione.toLowerCase().includes(filtroSede)
  );

  return (
    <div className="flex flex-1 flex-col bg-white text-gray-800">
      <div className="flex gap-x-8">
        <div className="flex max-w-2xl flex-1 flex-col">
          <div className="flex items-center gap-x-8">
            <ToggleRegioni onChange={setFiltroRegioni} value={filtroRegioni} />
            <Separator.Root orientation="vertical" className="h-full w-px bg-gray-200" />
            <FiltroSede onChange={setFiltroSede} value={filtroSede} />
          </div>
          <div className="mt-2 flex items-center justify-between pr-2 text-xs font-light text-gray-400">
            <span className="flex-1">Sede</span>
            <span className="flex-1 pl-4">Regione</span>
            <span className="">Tempo attesa</span>
          </div>
          <div className="mt-1 flex flex-1 flex-col gap-y-1.5">
            {sediFiltrate.map((sede) => (
              <Link
                key={sede.id}
                to={sede.id}
                className={`flex h-12 flex-col justify-center rounded-lg border border-gray-200 py-2 px-4 text-sm shadow-sm ${
                  match?.params.id === sede.id && 'border-blue-400 bg-blue-100 text-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{sede.descrizione}</span>
                  <span className="flex-1 text-xs capitalize">{sede.regione}</span>
                  <span
                    className={`relative inline-flex h-full w-12 items-center justify-center rounded-lg font-semibold text-white/90 ${
                      alertClassNames[sede.alert as 1 | 2 | 3 | 4]
                    }`}
                  >
                    {sede.alert === 3 && (
                      <span
                        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                          alertClassNames[sede.alert as 1 | 2 | 3 | 4]
                        }`}
                      ></span>
                    )}
                    {formatDuration(sede.tempoAttesa)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-1">
          {match === null && (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-400">
              Nessuna sede selezionata
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function ToggleRegioni({ onChange, value }: { onChange: (values: string[]) => void; value: string[] }) {
  return (
    <div className="flex items-baseline gap-x-4">
      <span className="text-sm font-light text-gray-400">Regioni:</span>
      <ToggleGroup.Root
        type="multiple"
        value={value}
        onValueChange={(values) => {
          if (values) onChange(values);
        }}
        className="flex gap-x-1"
      >
        <ToggleGroup.Item
          value="liguria"
          className="rounded-lg border px-2 py-1 text-xs data-[state=on]:border-blue-400 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-500 data-[state=off]:text-gray-400"
        >
          Liguria
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="piemonte"
          className="rounded-lg border px-2 py-1 text-xs data-[state=on]:border-blue-400 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-500 data-[state=off]:text-gray-400"
        >
          Piemonte
        </ToggleGroup.Item>
        <ToggleGroup.Item
          value="emilia"
          className="rounded-lg border px-2 py-1 text-xs data-[state=on]:border-blue-400 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-500 data-[state=off]:text-gray-400"
        >
          Emilia
        </ToggleGroup.Item>
      </ToggleGroup.Root>
    </div>
  );
}

function FiltroSede({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  return (
    <div className="flex items-baseline gap-x-4">
      <span className="text-sm font-light text-gray-400">Sede:</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border px-2 py-1 text-sm" />
    </div>
  );
}

function getColore(coda: number) {
  return coda < 6 ? '#16a34a' : coda < 11 ? '#eab308' : coda < 20 ? '#dc2626' : 'black';
}

function DettaglioSede() {
  const params = useParams();
  const sede = sedi.find((sede) => sede.id === params.id)!;
  const utentiInCoda = sede.utentiInCoda;
  const tempoDiAttesa = sede.tempoDiAttesa;

  const [tipo, setTipo] = useState('tempoDiAttesa');

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between">
        <h1 className="my-3 font-semibold">{sede.descrizione}</h1>
        <Link to="/" className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border">
          <span className="absolute inset-1 left-1.5 bottom-1.5 h-8 w-8 rotate-45 text-2xl">+</span>
        </Link>
      </div>
      <div className="space-y-2">
        <div>
          <Card shadow>
            <div className="flex items-center justify-between">
              <h2 className="my-2 text-sm font-medium">Situazione servizi</h2>
              <button
                onClick={() => {
                  let nuovoTipo;
                  if (tipo === 'utentiInCoda') nuovoTipo = 'tempoDiAttesa';
                  else nuovoTipo = 'utentiInCoda';
                  setTipo(nuovoTipo);
                }}
                className="rounded-lg !border px-1 py-0.5 text-xs"
              >
                {tipo === 'utentiInCoda' ? 'Mostra tempo di attesa' : 'Mostra utenti in coda'}
              </button>
            </div>
            <div
              style={
                {
                  '--fill-contratti':
                    tipo === 'utentiInCoda'
                      ? getColore(utentiInCoda[0]['Utenti in coda'])
                      : getColore(tempoDiAttesa[0]['Tempo di attesa']),
                  '--fill-informazioni':
                    tipo === 'utentiInCoda'
                      ? getColore(utentiInCoda[1]['Utenti in coda'])
                      : getColore(tempoDiAttesa[1]['Tempo di attesa']),
                  '--fill-priorita':
                    tipo === 'utentiInCoda'
                      ? getColore(utentiInCoda[2]['Utenti in coda'])
                      : getColore(tempoDiAttesa[2]['Tempo di attesa'])
                } as any
              }
            >
              <BarChart
                showYAxis={false}
                height="h-52"
                data={tipo === 'utentiInCoda' ? sede.utentiInCoda : sede.tempoDiAttesa}
                dataKey="name"
                categories={tipo === 'utentiInCoda' ? ['Utenti in coda'] : ['Tempo di attesa']}
                colors={['blue', 'cyan', 'indigo']}
              />
            </div>
          </Card>
        </div>
        <div>
          <Card shadow>
            <h2 className="my-2 text-sm font-medium">Situazione servizi</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Servizio</TableHeaderCell>
                  <TableHeaderCell>Max. attesa</TableHeaderCell>
                  <TableHeaderCell>Tempo prev.</TableHeaderCell>
                  <TableHeaderCell>Tempo calc.</TableHeaderCell>
                  <TableHeaderCell>Stato</TableHeaderCell>
                  <TableHeaderCell>Bigl. matt.</TableHeaderCell>
                  <TableHeaderCell>Bigl. pom.</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sede.tabella.map((item) => (
                  <TableRow key={item.servizio}>
                    <TableCell>
                      <Text>{item.servizio}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Max. attesa']}</Text>{' '}
                    </TableCell>
                    <TableCell>
                      <Text>{item['Tempo prev.']}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Tempo calc.']}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge text={item.Attivo ? 'Attivo' : 'Disattivo'} color={item.Attivo ? 'emerald' : 'red'} />
                    </TableCell>
                    <TableCell>
                      <Text>{item['Bigl. mat.']}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Bigl. pom.']}</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div>
          <Card shadow>
            <h2 className="my-3 text-sm font-medium">Situazione code</h2>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Servizio</TableHeaderCell>
                  <TableHeaderCell>Attesa</TableHeaderCell>
                  <TableHeaderCell>Cl. in coda</TableHeaderCell>
                  <TableHeaderCell>Sp. aperti</TableHeaderCell>
                  <TableHeaderCell>Sp. totali</TableHeaderCell>
                  <TableHeaderCell>Previsto</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sede.tabella.map((item) => (
                  <TableRow key={item.servizio}>
                    <TableCell>
                      <Text>{item.servizio}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{new Date(item.Attesa * 60 * 1000).toISOString().slice(11, 16)}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Cl. in coda']}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Sp. aperti']}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item['Sp. totali']}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{item.Previsto}</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Parametri() {
  return (
    <div className="flex flex-1 flex-col bg-white text-gray-800">
      <h1 className="my-3 text-xl font-semibold">Parametri</h1>
      <div className="mt-4 flex flex-1 flex-col">
        <table className="tr-w-full tr-tabular-nums tr-mt-0 tr-text-gray-500 tr-text-sm tr-font-normal">
          <TableHead>
            <TableRow>
              <th></th>
              <th
                colSpan={2}
                className="tr-sticky tr-whitespace-nowrap tr-text-left tr-top-0 tr-pl-4 tr-pr-4 tr-pt-3.5 tr-pb-3.5 tr-font-semibold text-green-500"
              >
                Verde
              </th>
              <th
                colSpan={2}
                className="tr-sticky tr-whitespace-nowrap tr-text-left tr-top-0 tr-pl-4 tr-pr-4 tr-pt-3.5 tr-pb-3.5 tr-font-semibold text-yellow-400"
              >
                Giallo
              </th>
              <th
                colSpan={2}
                className="tr-sticky tr-whitespace-nowrap tr-text-left tr-top-0 tr-pl-4 tr-pr-4 tr-pt-3.5 tr-pb-3.5 tr-font-semibold text-red-500"
              >
                Rosso
              </th>
            </TableRow>
            <TableRow>
              <TableHeaderCell>Metriche</TableHeaderCell>
              <TableHeaderCell>Minimo</TableHeaderCell>
              <TableHeaderCell>Massimo</TableHeaderCell>
              <TableHeaderCell>Minimo</TableHeaderCell>
              <TableHeaderCell>Massimo</TableHeaderCell>
              <TableHeaderCell>Minimo</TableHeaderCell>
              <TableHeaderCell>Massimo</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Text>Nr. utenti in coda</Text>
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={0} />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={5} />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={6} />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={10} />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={11} />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue={20} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Text>Tempo medio attesa</Text>
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:00" />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:05" />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:06" />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:10" />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:11" />
              </TableCell>
              <TableCell>
                <input className="w-16 rounded-lg border px-2 py-1 text-sm" defaultValue="00:20" />
              </TableCell>
            </TableRow>
          </TableBody>
        </table>
      </div>
    </div>
  );
}
