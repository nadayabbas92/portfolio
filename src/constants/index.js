import project1 from "../assets/projects/project-1.webp";
import project2 from "../assets/projects/project-2.webp";
import project3 from "../assets/projects/project-3.webp";

export const PERSONAL_INFO = {
  name: "Naday Abbas",
  role: "Web Developer (Frontend, React)",
  location: "Karachi, Sindh, Pakistan",
  email: "nadaycoding@gmail.com",
  phone: "+92 300 2132667",
  availability: "Open to work",
  bio: "Passionate web developer with strong skills in React, HTML, CSS, and JavaScript, focused on creating clean, responsive, and user-friendly web experiences. Excited to contribute to real-world projects and grow with a team.",
  socials: {
    linkedin: "https://www.linkedin.com/in/naday-abbas",
    github: "https://github.com/naday-abbas/",
    instagram: "https://www.instagram.com/nadayabbas/",
  },
};

export const SKILL_CATEGORIES = [
  {
    category: "Frontend",
    skills: [
      { name: "React", icon: "RiReactjsLine", color: "#38bdf8" },
      { name: "JavaScript", icon: "DiJavascript1", color: "#facc15" },
      { name: "Tailwind CSS", icon: "TbBrandTailwind", color: "#22d3ee" },
      { name: "HTML", icon: "RiHtml5Line", color: "#f97316" },
      { name: "CSS", icon: "FaCss3Alt", color: "#3b82f6" },
    ],
  },
  {
    category: "Tools",
    skills: [
      { name: "Git", icon: "FaGitAlt", color: "#f05032" },
      { name: "GitHub", icon: "FaGithub", color: "#ffffff" },
    ],
  },
];

export const PROJECTS = [
  {
    id: "movie-flix",
    title: "Movie Flix",
    tagline: "Browse popular movies, search, and mark/unmark favorites.",
    whatIBuilt: "Interactive movie discovery application with instant search query filtering and favorite catalog management.",
    image: project1,
    technologies: ["HTML", "CSS", "React", "Tailwind"],
    liveUrl: "https://movieflix-naday-abbas-projects.vercel.app",
    githubUrl: "https://github.com/naday-abbas/Movie-Flix",
  },
  {
    id: "beast-games",
    title: "Beast Games",
    tagline: "Frontend for a game-discovery site with upcoming games.",
    whatIBuilt: "Gaming exploration portal frontend featuring responsive layouts, curated categories, and upcoming title cards.",
    image: project2,
    technologies: ["HTML", "CSS"],
    liveUrl: "https://naday-abbas.github.io/Beast-Games/",
    githubUrl: "https://github.com/naday-abbas/Beast-Games",
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    tagline: "Personal site showcasing projects, skills, contact.",
    whatIBuilt: "Initial personal developer brand website highlighting showcase projects, skillset badges, and contact channels.",
    image: project3,
    technologies: ["HTML", "CSS", "React", "Bootstrap"],
    liveUrl: "https://naday-abbas.github.io/Portfolio/",
    githubUrl: "https://github.com/naday-abbas/Portfolio",
  },
];

export const EDUCATION = [
  {
    degree: "Bachelors in Software Engineering",
    institution: "Sir Syed University",
    date: "Graduation 2026",
    status: "In Progress",
  },
  {
    degree: "Smart Web Designing",
    institution: "Malaysian Learning Hub",
    date: "2023–2024",
    status: "Completed",
  },
  {
    degree: "Intermediate",
    institution: "Bahria Foundation College Kandiaro",
    date: "2019–2020",
    status: "Completed",
  },
];
