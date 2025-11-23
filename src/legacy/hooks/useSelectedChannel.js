import { useEffect, useState, useCallback } from "react"

const LOCAL_STORAGE_KEY = "selectedChannel"
const CHANNELS_KEY = "myTeacherChannels"

export function getStoredSelectedChannel() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch (err) {
        console.error("Failed to parse selected channel from storage", err)
        return null
    }
}

export function setStoredSelectedChannel(channel) {
    if (channel === null || channel === undefined) {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        window.dispatchEvent(new CustomEvent("selected-channel:change", { detail: null }))
        return
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(channel))
    window.dispatchEvent(new CustomEvent("selected-channel:change", { detail: channel }))
}

function readChannels() {
    try {
        const raw = localStorage.getItem(CHANNELS_KEY)
        return raw ? JSON.parse(raw) : []
    } catch { return [] }
}
function writeChannels(list) {
    localStorage.setItem(CHANNELS_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent("channels:change", { detail: list }))
}

export function listMyChannels() { return readChannels() }
export function createMyChannel(ch) {
    const list = readChannels()
    const id = ch.id || String(Date.now())
    const newCh = { id, name: ch.name, username: ch.username, description: ch.description || "", avatar: ch.avatar || "", banner: ch.banner || "" }
    writeChannels([newCh, ...list])
    return newCh
}
export function updateMyChannel(id, patch) {
    const list = readChannels()
    const idx = list.findIndex(c => c.id === id)
    if (idx === -1) return null
    const updated = { ...list[idx], ...patch, id }
    list[idx] = updated
    writeChannels(list)
    return updated
}
export function deleteMyChannel(id) {
    const list = readChannels().filter(c => c.id !== id)
    writeChannels(list)
    const sel = getStoredSelectedChannel()
    if (sel?.id === id) setStoredSelectedChannel(null)
}

export default function useSelectedChannel() {
    const [selectedChannel, setSelectedChannel] = useState(() => getStoredSelectedChannel())

    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === LOCAL_STORAGE_KEY) {
                setSelectedChannel(getStoredSelectedChannel())
            }
        }
        const handleCustom = (e) => {
            setSelectedChannel(e.detail || getStoredSelectedChannel())
        }
        window.addEventListener("storage", handleStorage)
        window.addEventListener("selected-channel:change", handleCustom)
        return () => {
            window.removeEventListener("storage", handleStorage)
            window.removeEventListener("selected-channel:change", handleCustom)
        }
    }, [])

    const selectChannel = useCallback((channel) => {
        setStoredSelectedChannel(channel)
    }, [])

    const clearChannel = useCallback(() => {
        setStoredSelectedChannel(null)
    }, [])

    return { selectedChannel, selectChannel, clearChannel }
}
