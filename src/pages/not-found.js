export function notFoundPage() {
  const section = document.createElement("section");
  section.className = "prose";
  section.innerHTML = `
    <p class="eyebrow">404</p>
    <h1>Bu kıyı boş</h1>
    <p>Aradığın sayfa yok. Gölün yüzeyine dön.</p>
    <a class="button" href="#/">Ana sayfa</a>
  `;
  return section;
}
