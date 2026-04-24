import { BannerTextElement } from '../../types';

export function generateHtml(
  backgroundImage: string,
  textElements: BannerTextElement[]
): string {
  const textSpans = textElements
    .map((el) => {
      const weightClass = el.fontWeight === 'bold' ? 'font-bold' : 'font-normal';
      return `  <span class="absolute ${weightClass}" style="top: ${el.y}%; left: ${el.x}%; font-size: ${el.fontSize}px; color: ${el.color}">${el.content}</span>`;
    })
    .join('\n');

  return `<div class="relative inline-block">
  <img src="${backgroundImage}" class="w-full h-auto block" />
${textSpans}
</div>`;
}
