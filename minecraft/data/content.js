import portfolio from "./portfolio.json";
const images = import.meta.glob("../assets/textures/*.png", {
  eager: true,
  query: "?url",
  import: "default",
});
export function preview(project, theme = "light") {
  return images[
    `../assets/textures/${theme === "dark" ? project.imageDark : project.imageLight}`
  ];
}
export default portfolio;
