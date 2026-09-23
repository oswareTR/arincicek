import "./style.css";
import { mountVineFrame } from "./vines.js";

const app = document.querySelector("#app");
app.innerHTML = `<main class="home"></main>`;
mountVineFrame(app);
