export default function(parameter) {
  const { href } = window.location;
  const url = new URL(href);
  return url.searchParams.get(parameter);
}