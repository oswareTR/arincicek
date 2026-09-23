export function contactPage() {
  const section = document.createElement("section");
  section.className = "prose";
  section.innerHTML = `
    <p class="eyebrow">İletişim</p>
    <h1>Kıyıdan bir not</h1>
    <p>
      Bir şey söylemek istersen buradan yaz. Form hiçbir yere
      gönderilmez; sadece tarayıcıda kalır.
    </p>
    <form class="note-form" novalidate>
      <label>
        Ad
        <input type="text" name="name" autocomplete="name" />
      </label>
      <label>
        Not
        <textarea name="note" rows="4"></textarea>
      </label>
      <button type="submit" class="button">Bırak</button>
      <p class="form-status" hidden></p>
    </form>
  `;

  const form = section.querySelector("form");
  const status = section.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    status.hidden = false;
    status.textContent = name
      ? `Teşekkürler, ${name}. Not kıyıda duruyor.`
      : "Teşekkürler. Not kıyıda duruyor.";
    form.reset();
  });

  return section;
}
