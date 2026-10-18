import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { renderSeoHead } from '../lib/seo';

export default function RouteMetadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const template = document.createElement('template');
    template.innerHTML = renderSeoHead(pathname);
    document.head.querySelectorAll('[data-seo]').forEach((element) => element.remove());
    document.head.append(template.content);
  }, [pathname]);
  return null;
}
