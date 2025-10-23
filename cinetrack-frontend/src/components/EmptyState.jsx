import { Button } from "@/components/ui/button";
export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, iconClassName = "h-12 w-12 text-foreground/70", iconBgClassName = "bg-muted" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className={`rounded-full ${iconBgClassName} p-6 mb-6`}>
        <Icon className={iconClassName} />
      </div>
      <h3 className="text-2xl font-display font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}