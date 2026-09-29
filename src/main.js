import './style.css'

document.querySelector('#app').innerHTML = `
  <main class="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-slate-100">
    <section class="max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-xl">
      <p class="text-sm font-medium uppercase tracking-widest text-sky-400">Vite + Tailwind</p>
      <h1 class="mt-3 text-3xl font-bold underline decoration-sky-400">Hello world</h1>
      <p class="mt-4 text-slate-300">
        Vanilla JavaScript starter. This page is styled with Tailwind utility classes.
      </p>
    </section>
  </main>
`
