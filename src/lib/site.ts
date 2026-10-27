export const site = {
  name: "TARUMT Computer Science Society",
  shortName: "TARUMT CSS",
  description:
    "Explore technology, build your skills, and find your community at TARUMT Computer Science Society.",
  membershipUrl: "https://forms.gle/p2sVZ99Pgy7wnVao6",
  email: "css.tarumt@gmail.com",
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/css_tarumt/" },
    { name: "Facebook", url: "https://www.facebook.com/tarumtcss" },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/tarumt-computer-science-society/",
    },
  ],
};
export const url = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
