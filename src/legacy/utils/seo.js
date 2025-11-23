export const buildAbsolute = (path) => {
    if (!path) return ""
    if (typeof path === "string" && path.startsWith("http")) return path
    try {
        const { origin } = window.location
        if (typeof path === "string" && path.startsWith("/")) return origin + path
        return origin + "/" + (path || "")
    } catch {
        return String(path || "")
    }
}

const ensureTag = (selector, createTag, createAttrs = {}) => {
    const head = document.head || document.getElementsByTagName("head")[0]
    let el = document.querySelector(selector)
    if (!el) {
        el = document.createElement(createTag)
        Object.entries(createAttrs).forEach(([k, v]) => el.setAttribute(k, v))
        head.appendChild(el)
    }
    return el
}

const setMetaName = (name, content) => {
    if (content == null) return
    const el = ensureTag(`meta[name="${name}"]`, "meta", { name })
    el.setAttribute("content", String(content))
}

const setMetaProp = (prop, content) => {
    if (content == null) return
    const el = ensureTag(`meta[property="${prop}"]`, "meta", { property: prop })
    el.setAttribute("content", String(content))
}

const setCanonical = (href) => {
    const el = ensureTag('link[rel="canonical"]', 'link', { rel: 'canonical' })
    el.setAttribute('href', href)
}

export const setRobots = (value = 'index,follow') => {
    setMetaName('robots', value)
}

export const setSeoTags = ({
    title,
    description,
    image,
    imageAlt,
    url,
    type = 'website',
    siteName = 'ZiyoFlix',
    locale = 'uz_UZ'
} = {}) => {
    if (title) document.title = title
    if (description) setMetaName('description', description)

    const finalUrl = url || (typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : '')
    setCanonical(finalUrl)

    setMetaProp('og:title', title || '')
    setMetaProp('og:description', description || '')
    if (image) setMetaProp('og:image', buildAbsolute(image))
    if (image) setMetaProp('og:image:secure_url', buildAbsolute(image))
    if (imageAlt) setMetaProp('og:image:alt', imageAlt)
    setMetaProp('og:url', finalUrl)
    setMetaProp('og:type', type)
    setMetaProp('og:site_name', siteName)
    setMetaProp('og:locale', locale)

    setMetaName('twitter:card', image ? 'summary_large_image' : 'summary')
    if (title) setMetaName('twitter:title', title)
    if (description) setMetaName('twitter:description', description)
    if (image) setMetaName('twitter:image', buildAbsolute(image))
    if (imageAlt) setMetaName('twitter:image:alt', imageAlt)
}

export const setJsonLd = (json) => {
    if (!json) return
    const head = document.head || document.getElementsByTagName('head')[0]
    let script = document.getElementById('ld-json-dynamic')
    if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'ld-json-dynamic'
        head.appendChild(script)
    }
    script.textContent = JSON.stringify(json)
}

export const setJsonLdById = (id, json) => {
    if (!id || !json) return
    const head = document.head || document.getElementsByTagName('head')[0]
    let script = document.getElementById(id)
    if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = id
        head.appendChild(script)
    }
    script.textContent = JSON.stringify(json)
}

export const removeJsonLd = (id) => {
    if (!id) return
    const script = document.getElementById(id)
    if (script && script.parentNode) {
        script.parentNode.removeChild(script)
    }
}

export const setPreloadImage = (src) => {
    if (!src) return
    const href = buildAbsolute(src)
    const selector = `link[rel="preload"][as="image"][href="${href}"]`
    const link = ensureTag(selector, 'link', { rel: 'preload', as: 'image', href })
    link.setAttribute('importance', 'high')
}
