export const PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1544551763-7ef4200d2d07?q=80&w=1200&auto=format&fit=crop";

function d(y, m, day) {
  const mm = String(m).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

export const YEAR_HINTS = {
  "The Toxic Avenger: Part II": 1989,
  "Alligator II: The Mutation": 1991,
  "Grizzly II: Revenge": 2020,
  "Poltergeist II: The Other Side": 1986,
  "Brahms: The Boy II": 2020,
  "XTRO 2: The Second Encounter": 1990,
  "Psycho Cop Returns": 1993,
  "Leprechaun 2": 1994,
  "Species II": 1998,
  "Puppet Master II": 1990,
  "Sleepaway Camp II": 1988,
  "Texas Chainsaw Massacre Part 2": 1986,
  "Insidious Chapter 2": 2013,
  "ABCs of Death 2 (anthology)": 2014,
  "Terrifier 2": 2022,
  "The Rage: Carrie 2": 1999,
  "ChromeSkull: Laid to Rest 2": 2011,
};

export const MOVIES = [
  { date: d(2025, 10, 1), title: "Invasive 2: Getaway" },
  { date: d(2025, 10, 2), title: "Alligator II: The Mutation" },
  { date: d(2025, 10, 3), title: "Puppet Master II" },
  { date: d(2025, 10, 4), title: "10/31: Part II (anthology)" },
  { date: d(2025, 10, 5), title: "The Stalker: Part II" },
  { date: d(2025, 10, 6), title: "Stake Land II" },
  {
    date: d(2025, 10, 7),
    title: "Manos Returns",
    notes: "You may remember Hands of Manos from MST3K | Torgo",
  },
  { date: d(2025, 10, 8), title: "Massacre II" },
  { date: d(2025, 10, 9), title: "Grizzly II: Revenge" },
  { date: d(2025, 10, 10), title: "Leprechaun 2" },
  { date: d(2025, 10, 11), title: "The Toxic Avenger: Part II" },
  { date: d(2025, 10, 12), title: "Poltergeist II: The Other Side" },
  { date: d(2025, 10, 13), title: "Brahms: The Boy II" },
  { date: d(2025, 10, 14), title: "XTRO 2: The Second Encounter" },
  { date: d(2025, 10, 15), title: "Psycho Cop Returns" },
  { date: d(2025, 10, 16), title: "Ghoulies II" },
  { date: d(2025, 10, 17), title: "Species II" },
  { date: d(2025, 10, 18), title: "Dementia: Part II" },
  { date: d(2025, 10, 19), title: "Butchers Book Two: Raghorn" },
  { date: d(2025, 10, 20), title: "Sleepaway Camp II" },
  { date: d(2025, 10, 21), title: "Day of the Dead 2: Contagium" },
  {
    date: d(2025, 10, 22),
    title: "Return to Return to Nuke ‘Em High (Vol. 2)",
  },
  { date: d(2025, 10, 23), title: "Zoombies 2" },
  { date: d(2025, 10, 24), title: "Insidious Chapter 2" },
  { date: d(2025, 10, 25), title: "Texas Chainsaw Massacre Part 2" },
  { date: d(2025, 10, 26), title: "Grotesque 2" },
  { date: d(2025, 10, 27), title: "The Barn: Part II" },
  {
    date: d(2025, 10, 28),
    title: "The Rage: Carrie 2",
  },
  { date: d(2025, 10, 29), title: "ChromeSkull: Laid to Rest 2" },
  { date: d(2025, 10, 30), title: "Ouija Shark 2" },
  { date: d(2025, 10, 31), title: "Terrifier 2" },
];

export function formatLongDate(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getTodayMovie() {
  const todayISO = new Date().toISOString().slice(0, 10);
  return MOVIES.find((m) => m.date === todayISO) || null;
}

export function buildCalendar(year, monthIndexZeroBased) {
  const firstOfMonth = new Date(year, monthIndexZeroBased, 1);
  const startDayIndex = (firstOfMonth.getDay() + 7) % 7; // 0 Sun
  const daysInMonth = new Date(year, monthIndexZeroBased + 1, 0).getDate();
  const startDate = new Date(year, monthIndexZeroBased, 1 - startDayIndex);
  const weeks = [];
  let cursor = new Date(startDate);
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let dIdx = 0; dIdx < 7; dIdx++) {
      row.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(row);
  }
  return { weeks, daysInMonth };
}
