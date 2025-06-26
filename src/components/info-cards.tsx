import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

import { Badge } from "./ui/badge";

type InfoCardProps = {
  title: string;
  value: string;
  description: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  footerText?: string;
  footerIcon?: LucideIcon;
};

export function InfoCard({
  title,
  value,
  description,
  badgeText,
  badgeIcon: BadgeIcon,
  footerText,
  footerIcon: FooterIcon,
}: InfoCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        {badgeText && BadgeIcon && (
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <BadgeIcon className="size-3" />
              {badgeText}
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        {footerText && (
          <div className="line-clamp-1 flex gap-2 font-medium">
            {footerText}
            {FooterIcon && <FooterIcon className="size-4" />}
          </div>
        )}
        <div className="text-muted-foreground">{description}</div>
      </CardFooter>
    </Card>
  );
}
