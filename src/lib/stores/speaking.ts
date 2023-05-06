export interface ITalks {
  title: string;
  event: string;
  youtube: string;
  date: Date;
  note?: string;
}

export const speaking: ITalks[] = [
  {
    title: 'Why We Chose To Ditch Helm To Gain Open Source Sanity',
    event: 'DevOpsDays Birmingham',
    youtube: 'jygxhAwbbeM',
    date: new Date(2022, 4, 7),
  },
  {
    title: 'Why We Chose To Ditch Helm To Gain Open Source Sanity',
    event: 'Cloud Native Rejekts Valencia',
    youtube: 'W1-cZUXh4zM',
    date: new Date(2022, 4, 14),
    note: 'There was a sound issue at the event which caused my microphone to intermittently cut out',
  },
  {
    title: 'Kubernet-Bees: How Bees Solve Problems Of Distributed Systems',
    event: 'KubeCon North America',
    youtube: 'JymVi3aJp1c',
    date: new Date(2022, 9, 22),
    note: 'Chris and I wrote this and planned to deliver it together, but I caught COVID-19 shortly before I was due to fly out so was unable to attend the conference',
  },
].sort((a, b) => {
  const aDate = a.date.getTime();
  const bDate = b.date.getTime();

  if (aDate < bDate) {
    return 1;
  }
  if (aDate > bDate) {
    return -1;
  }
  return 0;
});
