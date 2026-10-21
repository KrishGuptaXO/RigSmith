import { useEffect, useState } from "react";
import { adminFetch } from "../../pages/Admin/adminApi";

export const inputClass =
    "w-full rounded-lg border border-[#3A2F5B] bg-[#1A1325] px-3 py-2 text-white placeholder:text-[#888CA3] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";

// Debounce so typing in a search box doesn't fire one request per keystroke.
export function useDebounced(value, delay = 300) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}

// GETs an admin endpoint whenever path/params change. Ignores out-of-order responses.
// `loading` is only true for the first load, so tables don't flash while filtering.
export function useAdminData(path, params) {
    const [state, setState] = useState({ data: null, loading: true, error: "" });
    const [tick, setTick] = useState(0);
    const key = JSON.stringify(params || {});

    useEffect(() => {
        let cancelled = false;
        adminFetch(path, { params: JSON.parse(key) })
            .then((data) => { if (!cancelled) setState({ data, loading: false, error: "" }); })
            .catch((e) => { if (!cancelled) setState((s) => ({ ...s, loading: false, error: e.message })); });
        return () => { cancelled = true; };
    }, [path, key, tick]);

    return { ...state, reload: () => setTick((t) => t + 1) };
}