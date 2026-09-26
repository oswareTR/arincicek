const TRACKS = [
  {
    id: "herkes",
    video: "zuh1tZ6TYkg",
    kicker: "01",
    title: "Herkes Kendi Yoluna",
    story:
      "Gelme artık, herkes kendi yoluna. Ateş de yakmıyor, yeller de yıkmıyor. Ayrılık burada bağırmaz; yolu ikiye böler.",
  },
  {
    id: "takma",
    video: "MR9VArwu5T8",
    kicker: "02",
    title: "Takma Kafana",
    story:
      "Günler arkasına bakmadan geçiyor. Hayat bir çark, ne çıkarsa bahtına. Piyano Ümit Gür’den, düzen Kenan Aliev’den.",
  },
  {
    id: "sonbahar",
    video: "P5IWVTTyyWY",
    kicker: "03",
    title: "Her Mevsim Sonbahar",
    story:
      "İçerde, kimsenin bilmediği bir yerde duran bir his. Sen yokken yağmura gerek yok. Piyano ve aranje Ümit Gür’de.",
  },
  {
    id: "dunya",
    video: "U3E9u68raHI",
    kicker: "04",
    title: "Geldik Şu Dünyaya",
    story:
      "Çileye, cefaya, bir garip nevaya. Dost da yok, düşman da; yarını olmayan günlere divane. Görüntü Alican Dağtekin, aranje Kenan Aliyev.",
  },
  {
    id: "olmazlara",
    video: "Ll-mPGQIjQU",
    kicker: "05",
    title: "Olmazlara Meylim Var",
    story:
      "Araf albümünün ilk parçası. Mutlu olmak mümkün, ama burada imkânsız. Sözünden kurgusuna kadar Arin’in elinden çıktı.",
  },
  {
    id: "araf",
    video: "11P_H4RwoKE",
    kicker: "06",
    title: "Araf",
    story:
      "On Ocak, başlangıç günü. Şarkı, karlı bir okul koridorunda kendi adını duyan sekiz yaşındaki çocukla açılıyor. Hem kendine hem dinleyene.",
  },
  {
    id: "yarim",
    video: "oQpl-jVxYA8",
    kicker: "07",
    title: "Yarim Derdin Ver Bana",
    story:
      "Dilim varmaz, eller duymaz. Bir ağıtlık dert sinenin içinde duruyor. Derman olmak için tutulan bir hasret.",
  },
  {
    id: "vahhabiler",
    video: "ohptLy6Vm6k",
    kicker: "08",
    title: "Vahhabiler",
    story:
      "Bir gönül davası, sonra çöl. Gördüğü belki serap; yakan şey çöl değil. Gitarlar Can Altun ve Hasan Can Kaya, çekim Arda Onat.",
  },
  {
    id: "zalim-akustik",
    video: "E43M-v29l_0",
    kicker: "09",
    title: "Zalım",
    story:
      "2020’deki Zalım, Uçhisar’da akustik olarak yeniden. Söz, düzen ve mix Arin’de. Görüntü İlker Photography.",
  },
];

function player(video, title, className = "track-player") {
  return `
    <iframe
      class="${className}"
      src="https://www.youtube-nocookie.com/embed/${video}"
      title="${title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;
}

export function tracksMarkup() {
  const sections = TRACKS.map((track, index) => {
    const flip = index % 2 === 1 ? " is-flip" : "";
    const heading = index === 0 ? `<p class="studio-works-title">Parçalar</p>` : "";
    return `
      <article class="work-section${flip}" id="track-${track.id}">
        <div class="work-copy">
          ${heading}
          <p class="work-kicker">${track.kicker}</p>
          <h2>${track.title}</h2>
          <p class="work-story">${track.story}</p>
        </div>
        <div class="work-frame">
          ${player(track.video, `Arin — ${track.title}`)}
        </div>
      </article>
    `;
  }).join("");

  return `<div class="works">${sections}</div>`;
}

export function featuredPlayer() {
  return player("PD2yznmKaq8", "Arin — Zalım", "studio-player");
}
