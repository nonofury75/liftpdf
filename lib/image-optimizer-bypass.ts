export function shouldBypassImageOptimizer(src: string) {
  return src.startsWith("/images/seo/");
}
