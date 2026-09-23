export function aboutPage() {
  const section = document.createElement("section");
  section.className = "prose";
  section.innerHTML = `
    <p class="eyebrow">Hakkında</p>
    <h1>Küçük, durgun, kendi halinde</h1>
    <p>
      Arıncık bir göl adı kadar bir yer duygusu: geniş değil,
      gösterişli değil; kenarında durunca yeten bir su.
    </p>
    <p>
      Bu site Vite ve vanilla JavaScript ile kurulmuş statik
      bir SPA. Sayfalar tarayıcıda değişir, sunucuda değil.
    </p>
  `;
  return section;
}
