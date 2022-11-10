function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDuration(minutes: number) {
  return new Date(minutes * 60 * 1000).toISOString().slice(11, 16);
}

function creaTabella() {
  const clientiInCodaContratti = getRandomInt(0, getRandomInt(0, 15));
  const clientiInCodaInformazini = getRandomInt(0, getRandomInt(0, 8));
  const clientiInCodaPriorita = getRandomInt(0, getRandomInt(0, 5));

  const sportelliApertiContratti = getRandomInt(1, 6);
  const sportelliApertiInformazini = getRandomInt(1, 3);
  const sportelliApertiPriorita = getRandomInt(1, 2);

  const attesaContratti = Math.floor((clientiInCodaContratti * 5) / sportelliApertiContratti);
  const attesaInformazioni = Math.floor((clientiInCodaInformazini * 5) / sportelliApertiInformazini);
  const attesaPriorita = Math.floor((clientiInCodaPriorita * 5) / sportelliApertiPriorita);
  return [
    {
      servizio: 'Contratti',
      'Max. attesa': formatDuration(getRandomInt(0, 50)),
      'Tempo prev.': getRandomInt(0, 20),
      'Tempo calc.': getRandomInt(0, 20),
      Attivo: 'si',
      'Bigl. mat.': getRandomInt(0, 40),
      'Bigl. pom.': getRandomInt(0, 40),
      Attesa: attesaContratti,
      'Cl. in coda': clientiInCodaContratti,
      'Sp. aperti': sportelliApertiContratti,
      'Sp. totali': getRandomInt(1, 10),
      Previsto: formatDuration(getRandomInt(0, 20))
    },
    {
      servizio: 'Informazioni',
      'Max. attesa': formatDuration(getRandomInt(0, 50)),
      'Tempo prev.': getRandomInt(0, 20),
      'Tempo calc.': getRandomInt(0, 20),
      Attivo: 'si',
      'Bigl. mat.': getRandomInt(0, 40),
      'Bigl. pom.': getRandomInt(0, 40),
      Attesa: attesaInformazioni,
      'Cl. in coda': clientiInCodaInformazini,
      'Sp. aperti': sportelliApertiInformazini,
      'Sp. totali': getRandomInt(1, 10),
      Previsto: formatDuration(getRandomInt(0, 20))
    },
    {
      servizio: 'Priorità',
      'Max. attesa': formatDuration(getRandomInt(0, 50)),
      'Tempo prev.': getRandomInt(0, 20),
      'Tempo calc.': getRandomInt(0, 20),
      Attivo: 'si',
      'Bigl. mat.': getRandomInt(0, 40),
      'Bigl. pom.': getRandomInt(0, 40),
      Attesa: attesaPriorita,
      'Cl. in coda': clientiInCodaPriorita,
      'Sp. aperti': sportelliApertiPriorita,
      'Sp. totali': getRandomInt(1, 10),
      Previsto: formatDuration(getRandomInt(0, 20))
    }
  ];
}

export default [
  { id: '123', descrizione: 'Genova Sede', regione: 'liguria' },
  { id: 'IREN16', descrizione: 'Genova Sestri Ponente', regione: 'liguria' },
  { id: '0715R', descrizione: 'Rapallo', regione: 'liguria' },
  { id: 'IREN17', descrizione: 'Chiavari Corso Dante', regione: 'liguria' },
  { id: '0715L', descrizione: 'Lavagna', regione: 'liguria' },
  { id: 'IREN10', descrizione: 'Cogoleto', regione: 'liguria' },
  { id: 'IREN05', descrizione: 'Savona', regione: 'liguria' },
  { id: 'IREN22', descrizione: 'Camporosso', regione: 'liguria' },
  { id: 'IREN27', descrizione: 'Sanremo', regione: 'liguria' },
  { id: 'IREN26', descrizione: 'La Spezia', regione: 'liguria' },
  { id: 'IREN35', descrizione: 'Sarzana', regione: 'liguria' },
  { id: 'IREN40', descrizione: 'Genova Sturla', regione: 'liguria' },
  { id: 'IREN41', descrizione: 'Genova XX Settembre', regione: 'liguria' },
  { id: 'IREN23', descrizione: 'Nizza Monferrato', regione: 'piemonte' },
  { id: 'IREN29', descrizione: 'Torino Via di Nanni', regione: 'piemonte' },
  { id: 'IREN37', descrizione: 'Torino Corso Orbassano', regione: 'piemonte' },
  { id: 'IREN33', descrizione: 'Torino via Confienza', regione: 'piemonte' },
  { id: 'IREN38', descrizione: 'Vercelli', regione: 'piemonte' },
  { id: 'IREN39', descrizione: 'Grugliasco Via Gramsci', regione: 'piemonte' }
]
  .map((sede) => ({ ...sede, tabella: creaTabella() }))
  .map((sede) => {
    const tempoAttesa = Math.max(...sede.tabella.map((t) => t.Attesa));
    const alert = tempoAttesa < 6 ? 1 : tempoAttesa < 11 ? 2 : tempoAttesa < 20 ? 3 : 4;

    return { ...sede, alert, tempoAttesa };
  })
  .map((sede) => {
    const inCoda = sede.tabella.map((t) => t['Cl. in coda']);
    const utentiInCoda = [
      {
        name: 'Contratti',
        'Utenti in coda': inCoda[0]
      },
      {
        name: 'Informazioni',
        'Utenti in coda': inCoda[1]
      },
      {
        name: 'Priorità',
        'Utenti in coda': inCoda[2]
      }
    ];

    const attesa = sede.tabella.map((t) => t.Attesa);
    const tempoDiAttesa = [
      {
        name: 'Contratti',
        'Tempo di attesa': attesa[0]
      },
      {
        name: 'Informazioni',
        'Tempo di attesa': attesa[1]
      },
      {
        name: 'Priorità',
        'Tempo di attesa': attesa[2]
      }
    ];

    return { ...sede, utentiInCoda, tempoDiAttesa };
  });
