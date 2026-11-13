import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Bell, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SpeciesWaitlistForm } from "./SpeciesWaitlistForm";
import { fetchSpeciesDataFromDb } from "@/services/internal/speciesDb";

interface Props { speciesId?: string; speciesName?: string; className?: string }

export default function SpeciesWaitlistInvitation({ speciesId, speciesName, className }: Props) {
  const [open, setOpen] = useState(false);
  const [chosenId, setChosenId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const { data: species = [], isLoading, isError } = useQuery({
    queryKey: ["home-waitlist-species"], enabled: open || formOpen, staleTime: 60 * 60 * 1000,
    // The same public species table, ordering and RLS as /especies.
    queryFn: async () => { const result = await fetchSpeciesDataFromDb(); if (result.error) throw result.error; return result.data ?? []; },
  });
  const matchedSpecies = species.find(item => item.id === speciesId) ?? species.find(item => speciesName && [item.name, item.commonname].some(name => name.toLocaleLowerCase("pt-BR") === speciesName.toLocaleLowerCase("pt-BR")));
  const selectedSpecies = species.find(item => item.id === chosenId) ?? matchedSpecies;
  const directForm = open && Boolean(matchedSpecies);

  return <>
    <Button size="lg" className={className ?? "min-h-12 whitespace-normal px-4"} onClick={() => setOpen(true)}><Bell />Quero ser avisado</Button>
    <Dialog open={open && !directForm} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg sm:max-w-md">
        <DialogHeader><DialogTitle>Próximas ninhadas</DialogTitle><DialogDescription>Qual espécie você gostaria de acompanhar?</DialogDescription></DialogHeader>
        {isLoading ? <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" aria-label="Carregando espécies" /> : isError || species.length === 0 ?
          <div className="space-y-4"><p className="text-sm text-muted-foreground">Não foi possível carregar as espécies agora.</p><Button variant="outline" asChild><Link to="/especies">Ver espécies que criamos</Link></Button></div> :
          <><label htmlFor="waitlist-species" className="text-sm font-medium">Espécie</label><Select value={chosenId} onValueChange={setChosenId}><SelectTrigger id="waitlist-species" className="min-h-12"><SelectValue placeholder="Selecione uma espécie" /></SelectTrigger><SelectContent>{species.map(item => <SelectItem key={item.id} value={item.id}>{item.commonname}</SelectItem>)}</SelectContent></Select><Button className="min-h-12" disabled={!selectedSpecies} onClick={() => { setOpen(false); setFormOpen(true); }}>Continuar</Button></>}
      </DialogContent>
    </Dialog>
    {selectedSpecies && <SpeciesWaitlistForm key={selectedSpecies.id} species={selectedSpecies} isOpen={directForm || formOpen} onClose={() => { setOpen(false); setFormOpen(false); }} />}
  </>;
}