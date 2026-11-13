import { MousePointerClick, CreditCard, FileCheck2, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOME_WHATSAPP_URL } from "@/lib/homeConversion";
import WhatsAppIcon from "./WhatsAppIcon";

const steps = [
  { icon: MousePointerClick, title: "Escolha e reserva", text: "Escolha seu animal no site e fale com a gente pelo WhatsApp para reservar." },
  { icon: CreditCard, title: "Pagamento", text: "PIX com desconto ou cartão em até 10x sem juros." },
  { icon: FileCheck2, title: "Documentação", text: "Nota fiscal com número do microchip, certificado de origem e licença de transporte emitidos via Sisfauna, GTA e atestado sanitário." },
  { icon: Plane, title: "Envio", text: "Transporte aéreo via Gollog ou Latam, com caixa de transporte e consulta veterinária prévia. Frete de R$ 250 a R$ 365, conforme a região." },
];

export default function PurchaseStepsSection() {
  return (
    <section className="bg-background py-8 sm:py-16">
      <div className="container px-4 sm:px-6">
        <div className="flex justify-center"><div className="docs-section-title"><h2 className="text-2xl font-bold sm:text-3xl">Como funciona a compra</h2></div></div>
        <ol className="my-4 grid gap-4 sm:my-8 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="min-w-0 border-t border-primary/30 pt-3 sm:pt-5">
              <div className="mb-2 flex items-center gap-2 sm:mb-4 sm:justify-between"><span className="text-xl font-bold text-primary/60 sm:text-3xl">0{index + 1}</span><Icon className="h-5 w-5 shrink-0 text-primary sm:h-6 sm:w-6" aria-hidden="true" /><h3 className="text-base font-bold sm:hidden">{title}</h3></div>
              <h3 className="mb-2 hidden text-lg font-bold sm:block">{title}</h3><p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>
        <div className="text-center"><Button size="lg" className="min-h-12 w-full px-4 sm:w-auto" asChild><a href={HOME_WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Tirar dúvidas no WhatsApp</a></Button></div>
      </div>
    </section>
  );
}