import { InfoCard } from "@/components/info-cards"

interface CardData {
  title: string
  value: string
  description?: string
  badgeText?: string
  badgeIcon?: React.ComponentType<any>
  footerText?: string
  footerIcon?: React.ComponentType<any>
}

interface InfoCardsGroupProps {
  cards: CardData[]
}

export function InfoCardsGroup({ cards }: InfoCardsGroupProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <InfoCard
          key={i}
          title={card.title}
          value={card.value}
          description={card.description}
          badgeText={card.badgeText}
          badgeIcon={card.badgeIcon}
          footerText={card.footerText}
          footerIcon={card.footerIcon}
        />
      ))}
    </div>
  )
}
