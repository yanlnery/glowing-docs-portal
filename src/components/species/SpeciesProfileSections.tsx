import { Link } from 'react-router-dom';
import type { Species } from '@/types/species';
import type { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import WhatsAppIcon from '@/components/home/WhatsAppIcon';
import SpeciesWaitlistInvitation from './SpeciesWaitlistInvitation';
import { SpeciesProfileImage } from './SpeciesProfileGallery';
import { speciesPath } from '@/lib/speciesGroups';
import { splitCharacteristic, type SpeciesFaq } from '@/lib/speciesProfile';
import { getProductImageUrl } from '@/utils/productImageUtils';

const price = (value: number) => value === 0 ? 'Sob consulta' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export function SpeciesProfileActions({ products, species, name }: { products: Product[]; species?: Species; name: string }) {
  const whatsapp = `https://wa.me/5521967802174?text=${encodeURIComponent(`Olá! Vi a página da ${name} no site e quero mais informações.`)}`;
  return <section aria-label="Disponibilidade" className="space-y-4">
    {products.length ? <>
      <h2 className="text-xl font-semibold">Disponíveis agora</h2>
      <div className={species ? 'grid gap-4 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
        {products.map(product => <Link key={product.id} to={`/animais/${product.newSlug || product.slug}`} className="min-w-0 overflow-hidden rounded-lg border border-border bg-card hover:border-primary">
          <div className="aspect-[4/3] overflow-hidden bg-muted"><img src={getProductImageUrl(product) || '/placeholder.svg'} alt={product.name} className="h-full w-full object-cover" loading="lazy" /></div>
          <div className="space-y-2 p-4">
            <h3 className="font-semibold break-words">{product.name} {product.meta?.productId && <span className="text-sm font-normal text-muted-foreground">#{product.meta.productId.replace(/^#/, '')}</span>}</h3>
            <p className="text-sm italic text-muted-foreground">{product.speciesName}</p>
            {product.originalPrice && <p className="text-xs text-muted-foreground line-through">De {price(product.originalPrice)}</p>}
            <p className="font-bold text-primary">{price(product.pixPrice ?? product.price)}{product.pixPrice ? ' no PIX' : ''}</p>
            <p className="text-xs text-muted-foreground">{product.pixPrice ? 'ou ' : ''}{price(product.price)} em até 10x s/ juros</p>
          </div>
        </Link>)}
      </div>
    </> : <div className="upcoming-litters space-y-4 rounded-lg p-5 sm:p-6">
      <p className="leading-relaxed">No momento não temos filhotes de {name} disponíveis. Entre na lista e seja avisado quando nascerem.</p>
      <SpeciesWaitlistInvitation speciesId={species?.id} speciesName={species?.commonname} />
    </div>}
    <Button variant="outline" className="min-h-12 h-auto w-full whitespace-normal py-3 sm:w-auto" asChild><a href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />Tirar dúvidas no WhatsApp</a></Button>
  </section>;
}

export function SpeciesFacts({ items }: { items: string[] }) {
  return <dl className="divide-y divide-border border-y border-border">
    {items.filter(Boolean).map((item, index) => {
      const fact = splitCharacteristic(item);
      return <div key={index} className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-3 py-4">
        {fact.label ? <><dt className="font-semibold break-words">{fact.label}</dt><dd className="text-muted-foreground break-words whitespace-pre-line">{fact.value}</dd></> : <dd className="col-span-2 text-muted-foreground break-words">{fact.value}</dd>}
      </div>;
    })}
  </dl>;
}

export function SpeciesFaqSection({ items }: { items: SpeciesFaq[] }) {
  return <section><h2 className="docs-section-title text-2xl font-bold">Perguntas frequentes</h2>
    <Accordion type="single" collapsible>{items.map((item, index) => <AccordionItem key={index} value={`faq-${index}`}>
      <AccordionTrigger className="text-left break-words">{item.question}</AccordionTrigger>
      <AccordionContent className="text-muted-foreground whitespace-pre-line">{item.answer}</AccordionContent>
    </AccordionItem>)}</Accordion>
  </section>;
}

export function SpeciesResponsibility() {
  return <aside className="border-y border-border py-5 text-sm leading-relaxed text-muted-foreground">Responsável técnico: Yan Nery, biólogo — CRBio 143372/02-D. Criadouro comercial de fauna silvestre nativa, CTF IBAMA nº 6654937.</aside>;
}

export function SpeciesProfileCards({ species }: { species: Species[] }) {
  return <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {species.map(item => <Link key={item.id} to={speciesPath(item)} className="min-w-0 overflow-hidden rounded-lg border border-border bg-card hover:border-primary">
      <SpeciesProfileImage species={item} />
      <div className="space-y-1 p-4"><h3 className="font-semibold">{item.commonname}</h3><p className="text-sm italic text-muted-foreground">{item.name}</p></div>
    </Link>)}
  </div>;
}