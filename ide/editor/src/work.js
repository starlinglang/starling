/* global Worker, alert */

const worker = new Worker('src/worker.js', { type: 'module' })

document.getElementById('verify').onclick = async () => {
  const snippet = document.querySelector('pre').innerText

  alert(
    "If you're verifying a proof which imports set.mm, this might take some time."
  )
  if (snippet.includes('set.mm')) {
    const url =
      'https://raw.githubusercontent.com/metamath/set.mm/develop/set.mm'
    const res = await fetch(url, {})
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = res.headers.get('content-type') || ''
    const data = contentType.includes('application/json')
      ? await res.json()
      : await res.text()
    worker.postMessage([data, snippet])
  } else {
    worker.postMessage(snippet)
  }
}

worker.onmessage = (e) => {
  if (e.data) {
    alert(`${e.data}`)
  }
}
