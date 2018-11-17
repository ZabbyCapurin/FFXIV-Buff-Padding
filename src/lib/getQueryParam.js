export default function(parameter) {
    const href = window.location.href;
    const url = new URL(href);
    return url.searchParams.get(parameter);
}