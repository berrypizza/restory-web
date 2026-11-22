const paths = {
  inbox: "M3 14 7 4.5h10l4 9.5v5.5H3z M3.5 14H8l2 3h4l2-3h4.5",
  camera: "M3 7.5h4l1.5-3h7l1.5 3h4v12H3z M15.5 13a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z",
  home: "m3 10 9-7.5 9 7.5 M5 9v11h5v-6h4v6h5V9",
  person: "M16 20v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M10.5 4a3.2 3.2 0 1 0 .01 0z M16.5 8.5h5 M19 6v5",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0z M12 7.4a2.6 2.6 0 1 0 .01 0z",
  phone: "M7 3h2l2 5-2.4 1.7a13.5 13.5 0 0 0 5.7 5.7L16 13l5 2v2c0 2-1.6 3.6-3.5 3.4C10.1 19.6 4.4 13.9 3.6 6.5 3.4 4.6 5 3 7 3z",
  calendar: "M4 6.5h16v14H4z M4 10.5h16 M8 3.5v5 M16 3.5v5 M8 15h2 M14 15h2",
  list: "M8 4.5h11v16H5v-16h3 M9 3h6v4H9z M8.5 11h7 M8.5 15h5",
  review:
    "M20 14a3 3 0 0 1-3 3H9l-5 4v-4.5a3 3 0 0 1-1-2.3V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z M7 9h9 M7 12.5h6",
  wallet: "M4 7.5h15a1 1 0 0 1 1 1v10H5a2 2 0 0 1-2-2V7a2 2 0 0 1 1.5-2l12-2v4 M20 11h-5v4h5",
  chart: "M4 4v16h16 M8 16v-4 M13 16V7 M18 16v-7",
  stats: "M4 18l6-7 4 3 6-9 M15 5h5v5",
  time: "M12 3a9 9 0 1 0 .01 0z M12 7v5l3 2",
  arrow: "m9 6 6 6-6 6",
  forward: "M4 12h15 M13 6l6 6-6 6",
  plus: "M12 5v14 M5 12h14",
  search: "M10.5 3.5a7 7 0 1 0 .01 0z M16 16l4.5 4.5",
  close: "m6 6 12 12 M18 6 6 18",
  refresh: "M20 5v5h-5 M19.5 10a7.8 7.8 0 1 0 .1 5",
  logout: "M10 4H5v16h5 M10 12h11 M17 8l4 4-4 4",
  more: "M4 7h16 M4 12h16 M4 17h16",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 9a3 3 0 1 0 .01 0z",
  eyeOff:
    "M3 3l18 18 M10 5.3c.6-.2 1.3-.3 2-.3 6.5 0 10 7 10 7-.6 1.1-1.3 2-2 2.8 M16 18.2a9.7 9.7 0 0 1-4 .8C5.5 19 2 12 2 12a18 18 0 0 1 4.2-4.9",
} as const;

export type AdminIconName = keyof typeof paths;

export default function AdminIcon({ name, size = 20 }: { name: AdminIconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
