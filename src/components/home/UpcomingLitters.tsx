import { Link } from "react-router-dom";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeciesWaitlistInvitation from "@/components/species/SpeciesWaitlistInvitation";
import { cn } from "@/lib/utils";

interface Props { standalone?: boolean; wide?: boolean }

export default function UpcomingLitters({ standalone = false, wide = false }: Props) {
  return (
    <div className={cn("upcoming-litters relative isolate flex h-full min-w-0 max-w-full flex-col overflow-hidden text-center sm:text-left", standalone ? "items-center px-4 py-8 text-center sm:px-0 sm:py-12 sm:text-center" : "rounded-lg border p-4 sm:p-6", wide && "lg:col-span-2 lg:flex-row lg:items-center lg:gap-10 lg:p-8")}>
      <div className={cn("relative min-w-0 max-w-full", wide && "lg:flex-1")}>
        <Sprout className={cn("mx-auto mb-5 h-10 w-10 text-primary", !standalone && "sm:mx-0")} aria-hidden="true" />
        {standalone ? <div className="docs-section-title"><h2 className="text-2xl font-bold sm:text-3xl">Próximas ninhadas</h2></div> : <h3 className="mb-3 text-lg font-bold sm:text-xl">Próximas ninhadas</h3>}
        <p className={cn("mb-6 min-w-0 max-w-lg break-words text-sm leading-relaxed text-muted-foreground sm:text-base", wide && "lg:mb-0")}>Novos filhotes nascendo no fim do ano. Entre na lista e seja avisado primeiro.</p>
      </div>
      <div className={cn("relative mt-auto flex min-w-0 max-w-full gap-3", standalone ? "w-full flex-col sm:w-auto sm:flex-row" : "flex-col", wide && "lg:mt-0 lg:shrink-0")}>
        <SpeciesWaitlistInvitation />
        {standalone && <Button size="lg" variant="outline" className="min-h-12" asChild><Link to="/especies">Ver espécies que criamos</Link></Button>}
      </div>
    </div>
  );
}