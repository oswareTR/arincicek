import "./style.css";
import { startRouter } from "./router.js";

const app = document.querySelector("#app");

app.innerHTML = `
  <div class="shell">
    <header class="site-header">
      <a class="brand" href="#/" data-link>Arıncık</a>
      <nav class="nav" aria-label="Ana menü">
        <a href="#/" data-link>Ana sayfa</a>
        <a href="#/about" data-link>Hakkında</a>
        <a href="#/contact" data-link>İletişim</a>
      </nav>
    </header>
    <main id="page" class="page"></main>
    <footer class="site-footer">
      <p>Arıncık · küçük göl</p>
    </footer>
  </div>
`;

startRouter(document.querySelector("#page"));
