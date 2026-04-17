export async function fetchFile(link) { // fetching with 3 retries
    for (var i = 0; i < 3; i++) {
        try {
            const res = await fetch(link,  { cache: "no-store" })
            if (!res.ok) throw new Error(`Download failed: ${res.status}`)
            if (!res.body) { throw new Error("CC-CEDICT is no longer availiable for download from that link.") }
            return res
        } catch (e) {
            if (i === 2) throw e
            await new Promise(r => setTimeout(r, 500))
        }
    }
}
