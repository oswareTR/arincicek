export function homePage() {
  const section = document.createElement("section");
  section.className = "hero";
  section.innerHTML = `
    <p class="eyebrow">osware</p>
    <h1>Arıncık</h1>
    <p class="lede">
      Yerel Türkçede <em>küçük göl</em>. Durulmuş bir yüzey,
      sığ bir kıyı, sessiz bir durak.
    </p>
    <div class="actions">
      <a class="button" href="#/about">Yakından bak</a>
      <a class="button ghost" href="#/contact">Yaz</a>
    </div>
  `;
  return section;
}
