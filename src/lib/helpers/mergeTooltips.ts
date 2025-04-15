type TooltipCard = {
  title: string;
  tooltipInfo?: string;
};

export function mergeTooltips<T extends TooltipCard>(
  cards: T[],
  explanations: Record<string, string> = {}
): T[] {
  return cards.map((card) => {
    const matchedKey = Object.keys(explanations).find(
      (key) => key.toLowerCase() === card.title.toLowerCase()
    );

    return {
      ...card,
      tooltipInfo:
        (matchedKey && explanations[matchedKey]) ||
        card.tooltipInfo ||
        "Loading explanation...",
    };
  });
}
