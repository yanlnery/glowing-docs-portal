
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, AlertCircle, Info } from "lucide-react";

// Updated Species List with the 21 species including detailed information
const speciesList = [
  {
    id: 1,
    name: "Boa constrictor constrictor",
    commonName: "Jiboia Amazônica",
    type: "serpente",
    slug: "boa-constrictor-constrictor",
    image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
    gallery: [
      "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ],
    description: "A *Boa constrictor constrictor*, popularmente chamada de **Jiboia Amazônica**, é uma das subespécies mais emblemáticas do gênero *Boa*. Nativa da região amazônica, destaca-se pela coloração intensa, geralmente com tons avermelhados e manchas bem delineadas. É uma serpente constritora, não peçonhenta, que utiliza a força muscular para capturar suas presas.\n\nPor ser de grande porte e apresentar comportamento imponente, essa espécie exige manejo experiente e estrutura adequada, sendo mais indicada para criadores avançados.",
    characteristics: [
      "Tamanho adulto: 2,5 a 3,5 metros",
      "Comportamento: Reservado, porém responsivo ao manuseio constante",
      "Expectativa de vida: Até 30 anos em cativeiro",
      "Atividade: Noturna",
      "Alimentação: Roedores, aves e pequenos mamíferos",
      "Ambientação ideal: Recintos espaçosos, com tocas e áreas para escalada, umidade controlada e temperatura entre 26 °C e 32 °C"
    ],
    curiosities: "- Apesar do nome, a *B. c. constrictor* não é exclusiva da Amazônia e pode ser encontrada também no Pará e Amapá.\n- É uma das serpentes brasileiras com maior valor genético no mercado internacional.\n- Apresenta variações visuais conforme a localidade de origem.\n- É frequentemente confundida com outras jiboias, mas seu padrão de cauda avermelhada é característico."
  },
  {
    id: 2,
    name: "Boa constrictor amarali",
    commonName: "Jiboia do Cerrado",
    type: "serpente",
    slug: "boa-constrictor-amarali",
    image: "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
    gallery: [
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png",
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png"
    ],
    description: "A *Boa constrictor amarali*, conhecida como **Jiboia do Cerrado**, é uma subespécie endêmica do Brasil, com distribuição no bioma cerrado. Reconhecida por sua coloração acinzentada e padrão menos vibrante que a jiboia amazônica, é uma das mais robustas fisicamente.\n\nIndicada para criadores experientes, pois seu temperamento pode variar bastante e seu tamanho exige um recinto espaçoso e bem estruturado.",
    characteristics: [
      "Tamanho adulto: 2,2 a 3 metros",
      "Comportamento: Territorial e menos tolerante ao manuseio em algumas fases",
      "Expectativa de vida: 20 a 30 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e pequenos mamíferos",
      "Ambientação ideal: Alta circulação de ar, substrato seco, temperatura entre 27 °C e 30 °C, com área de refúgio"
    ],
    curiosities: "- É uma das jiboias mais resistentes a variações climáticas.\n- Tem crescimento rápido e musculatura muito desenvolvida.\n- Exige atenção ao enriquecimento ambiental devido ao comportamento mais reativo.\n- É valorizada em projetos de manejo por sua rusticidade e boa reprodução."
  },
  {
    id: 3,
    name: "Boa atlantica",
    commonName: "Jiboia da Mata Atlântica",
    type: "serpente",
    slug: "boa-atlantica",
    image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    gallery: [
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
      "/lovable-uploads/f6e67c5c-183d-46ac-a882-997f826be1b3.png"
    ],
    description: "A *Boa atlantica* é uma espécie endêmica da Mata Atlântica brasileira, considerada rara na natureza e alvo de projetos de conservação. Com porte médio, padrão visual diferenciado e comportamento mais pacífico, é uma das jiboias mais queridas por criadores que buscam uma espécie manejável.\n\nSua aparência pode variar entre tons de marrom e cinza com padrões escuros pouco definidos, o que a diferencia das demais jiboias.",
    characteristics: [
      "Tamanho adulto: 1,5 a 2 metros",
      "Comportamento: Dócil e tranquila, especialmente com manuseio frequente",
      "Expectativa de vida: Até 25 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e aves",
      "Ambientação ideal: Ambiente úmido com folhagens e áreas de refúgio, temperatura entre 25 °C e 30 °C"
    ],
    curiosities: "- Foi reconhecida como espécie separada recentemente, sendo antes considerada uma subespécie.\n- Vive em fragmentos de floresta, sendo muito sensível à degradação ambiental.\n- Sua reprodução em cativeiro é mais complexa do que a de outras jiboias.\n- É protegida por lei em diversas regiões e de grande importância para a biodiversidade brasileira."
  },
  {
    id: 4,
    name: "Epicrates cenchria",
    commonName: "Jiboia Arco-íris da Amazônia",
    type: "serpente",
    slug: "epicrates-cenchria",
    image: "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png",
    gallery: [
      "/lovable-uploads/f7bc5a30-657d-418c-8b25-7b0494f36029.png"
    ],
    description: "A *Epicrates cenchria* é a famosa **Jiboia Arco-íris da Amazônia**, reconhecida por seu brilho iridescente que reflete as cores do arco-íris sob luz natural. De porte médio e comportamento dócil, tornou-se uma das serpentes mais populares no terrarismo mundial.\n\nÉ ideal para criadores iniciantes ou intermediários que desejam uma serpente visualmente impactante e com boa adaptabilidade em cativeiro.",
    characteristics: [
      "Tamanho adulto: 1,8 a 2,4 metros",
      "Comportamento: Tranquila e de fácil manuseio",
      "Expectativa de vida: Até 25 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores",
      "Ambientação ideal: Alta umidade (70–80%), temperatura entre 26 °C e 30 °C, substrato natural e tocas"
    ],
    curiosities: "- O brilho do corpo vem da microestrutura das escamas, que refratam luz.\n- É um dos répteis brasileiros mais admirados no exterior.\n- Tem grande valor ecológico e está presente em vários programas de conservação.\n- O padrão de manchas varia entre indivíduos, mesmo dentro de uma mesma ninhada."
  },
  {
    id: 5,
    name: "Epicrates assisi",
    commonName: "Jiboia Arco-íris da Caatinga",
    type: "serpente",
    slug: "epicrates-assisi",
    image: "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png",
    gallery: [
      "/lovable-uploads/51de7896-4d25-4af0-af9d-31c8028fcc3b.png"
    ],
    description: "A *Epicrates assisi*, conhecida como **Jiboia Arco-íris da Caatinga**, é endêmica do nordeste brasileiro e possui uma das aparências mais distintas entre as jiboias arco-íris. Menor e mais ágil, essa serpente se adapta muito bem ao clima semiárido e tem comportamento ativo.\n\nSua beleza e rusticidade a tornam uma ótima escolha para iniciantes no hobby.",
    characteristics: [
      "Tamanho adulto: 1,2 a 1,6 metros",
      "Comportamento: Curiosa e ativa, mas tolerante ao manejo",
      "Expectativa de vida: 18 a 22 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e pequenos répteis",
      "Ambientação ideal: Baixa umidade, ventilação constante, temperatura entre 27 °C e 32 °C"
    ],
    curiosities: "- É considerada uma das menores jiboias do Brasil.\n- Possui padrão visual menos marcado que a *E. cenchria*, com tons mais discretos.\n- É uma das primeiras espécies de jiboias arco-íris legalmente reproduzidas em cativeiro no Brasil.\n- Se estressa menos com movimentação, o que facilita sua manutenção por iniciantes."
  },
  {
    id: 6,
    name: "Epicrates crassus",
    commonName: "Jiboia Arco-íris do Cerrado",
    type: "serpente",
    slug: "epicrates-crassus",
    image: "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png",
    gallery: [
      "/lovable-uploads/c1a72b2c-2c6e-4822-9c71-13485444c48a.png"
    ],
    description: "A *Epicrates crassus* é conhecida como **Jiboia Arco-íris do Cerrado**. Muito semelhante visualmente à *E. cenchria*, essa espécie possui um corpo mais robusto e comportamento mais reservado. Por habitar regiões de vegetação mais aberta, é bastante adaptada ao clima seco.\n\nÉ indicada para criadores que desejam um animal bonito e mais discreto, com comportamento tranquilo.",
    characteristics: [
      "Tamanho adulto: 1,5 a 2 metros",
      "Comportamento: Mais reservado, mas tolerante ao manejo",
      "Expectativa de vida: Até 25 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e pequenos mamíferos",
      "Ambientação ideal: Clima ameno e seco, substrato leve, temperatura entre 26 °C e 30 °C"
    ],
    curiosities: "- Costuma apresentar brilho iridescente menos intenso que a *E. cenchria*, mas ainda impressionante.\n- É uma das espécies mais fáceis de reproduzir em criadouros licenciados.\n- Apresenta resistência natural a doenças fúngicas, comuns em ambientes úmidos.\n- Raramente emite sinais de estresse, sendo considerada excelente para observação tranquila."
  },
  {
    id: 7,
    name: "Epicrates maurus",
    commonName: "Jiboia Arco-íris do Norte",
    type: "serpente",
    slug: "epicrates-maurus",
    image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
    gallery: [
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ],
    description: "A *Epicrates maurus*, ou **Jiboia Arco-íris do Norte**, habita regiões mais setentrionais da Amazônia e é menos conhecida comercialmente. Apresenta coloração escura, com tons terrosos profundos, e comportamento calmo, ideal para observadores.\n\nÉ uma boa escolha para criadores que buscam uma espécie discreta e exótica, com padrão visual incomum.",
    characteristics: [
      "Tamanho adulto: 1,3 a 1,8 metros",
      "Comportamento: Extremamente tranquila e de baixa atividade",
      "Expectativa de vida: 20 a 25 anos",
      "Atividade: Noturna",
      "Alimentação: Roedores e aves pequenas",
      "Ambientação ideal: Clima úmido, pouca luz direta, substrato natural e troncos para esconderijo"
    ],
    curiosities: "- Raramente é encontrada em criadouros, sendo uma das mais raras do gênero.\n- Sua coloração camuflada a torna quase invisível no ambiente natural.\n- Emite vibrações corporais quando estressada, como forma de defesa passiva.\n- É uma das poucas jiboias que raramente se enrola para dormir — prefere se manter esticada em ambientes seguros."
  },
  {
    id: 8,
    name: "Corallus batesii",
    commonName: "Jiboia Esmeralda",
    type: "serpente",
    slug: "corallus-batesii",
    image: "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png",
    gallery: [
      "/lovable-uploads/6dcc0ef5-dc47-4f3c-9020-54ecc65ed390.png"
    ],
    description: "A *Corallus batesii*, chamada de **Jiboia Esmeralda**, é uma das serpentes mais estonteantes do mundo. Sua coloração verde vibrante com manchas brancas em forma de raio contrasta com o ventre amarelo intenso, criando um visual hipnótico.\n\nÉ uma serpente exigente e de difícil manejo, geralmente mantida por criadores experientes voltados à observação, fotografia ou reprodução.",
    characteristics: [
      "Tamanho adulto: 1,6 a 2,2 metros",
      "Comportamento: Muito territorial e estressável",
      "Expectativa de vida: Até 20 anos",
      "Atividade: Noturna",
      "Alimentação: Pequenos mamíferos e aves",
      "Ambientação ideal: Alta umidade (75–85%), iluminação indireta, galhos resistentes, temperatura controlada entre 25 °C e 29 °C"
    ],
    curiosities: "- Seu nome homenageia Henry Walter Bates, naturalista britânico que explorou a Amazônia.\n- É muitas vezes confundida com a *Corallus caninus*, mas possui diferenças anatômicas e comportamentais.\n- Tem uma das mordidas mais rápidas entre os boídeos.\n- Quando em repouso, costuma manter o corpo enrolado em galhos com a cabeça no centro — uma postura clássica de emboscada."
  },
  {
    id: 9,
    name: "Corallus hortulana",
    commonName: "Suaçuboia",
    type: "serpente",
    slug: "corallus-hortulana",
    image: "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png",
    gallery: [
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ],
    description: "A *Corallus hortulana*, conhecida popularmente como **Suaçuboia**, é uma serpente arborícola nativa do Brasil, com hábitos noturnos e comportamento observacional. Seu corpo esguio e a variedade de colorações — do verde-limão ao acinzentado — chamam atenção de entusiastas por animais exóticos.\n\nDevido ao seu comportamento defensivo e sensibilidade ao toque, é mais indicada para criadores avançados ou focados em observação.",
    characteristics: [
      "Tamanho adulto: 1,4 a 1,8 metros",
      "Comportamento: Defensiva, prefere pouca manipulação",
      "Expectativa de vida: 15 a 20 anos",
      "Atividade: Noturna",
      "Alimentação: Aves e roedores",
      "Ambientação ideal: Altura, galhos para escalada, iluminação difusa e boa umidade (65–80%)"
    ],
    curiosities: "- Possui sensores térmicos entre as escamas labiais para detectar presas no escuro.\n- Tem a dentição mais longa do que a maioria das serpentes brasileiras.\n- Não tolera ambientes secos — a umidade inadequada pode causar lesões respiratórias.\n- Mesmo em cativeiro, pode passar longos períodos sem se alimentar voluntariamente."
  },
  {
    id: 10,
    name: "Erythrolamprus miliaris",
    commonName: "Cobra d'água",
    type: "serpente",
    slug: "erythrolamprus-miliaris",
    image: "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
    gallery: [
      "/lovable-uploads/764f832e-e068-449d-80be-7d670575665f.png",
      "/lovable-uploads/87bb79b7-12d7-41e7-9b09-a2a646636a7f.png"
    ],
    description: "A *Erythrolamprus miliaris*, chamada popularmente de **Cobra d'Água**, é uma serpente semi-aquática e diurna, amplamente distribuída no Brasil. Pequena, discreta e inofensiva, é uma das melhores espécies para iniciantes no hobby.\n\nÉ uma excelente introdução ao mundo das serpentes, ideal para espaços reduzidos e ambientes educativos.",
    characteristics: [
      "Tamanho adulto: 60 cm a 1 metro",
      "Comportamento: Dócil, ativa e curiosa",
      "Expectativa de vida: 12 a 15 anos",
      "Atividade: Diurna",
      "Alimentação: Peixes, pequenos anfíbios e, em cativeiro, roedores adaptados",
      "Ambientação ideal: Área com piscina ou recipiente d'água, substrato úmido e plantas"
    ],
    curiosities: "- Tem escamas suaves e coloração que camufla entre folhas úmidas.\n- É uma das serpentes mais tranquilas para se iniciar no manejo.\n- Raramente morde — emite um cheiro forte como defesa passiva (Descarga Cloacal).\n- Pode ser criada com enriquecimento aquático, o que favorece seu comportamento natural."
  },
  {
    id: 11,
    name: "Spilotes pullatus",
    commonName: "Caninana",
    type: "serpente",
    slug: "spilotes-pullatus",
    image: "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png",
    gallery: [
      "/lovable-uploads/d71c2fb7-1bfe-41ba-8db3-d2d0b4279365.png"
    ],
    description: "A *Spilotes pullatus*, chamada de **Caninana**, é uma das serpentes mais conhecidas do Brasil. De comportamento ativo, corpo ágil e coloração marcante (preta com manchas amarelas), é temida injustamente por muitos, apesar de não ser peçonhenta.\n\nÉ ideal para observadores experientes, pois exige bastante espaço e pode apresentar comportamento defensivo quando acuada.",
    characteristics: [
      "Tamanho adulto: 2 a 2,5 metros",
      "Comportamento: Ágil, defensiva e muito ativa",
      "Expectativa de vida: 15 a 20 anos",
      "Atividade: Diurna",
      "Alimentação: Aves, roedores e répteis",
      "Ambientação ideal: Recintos longos, com troncos para escalada, boa ventilação e temperatura entre 26 °C e 32 °C"
    ],
    curiosities: "- Costuma vibrar a cauda como forma de aviso, semelhante a cascavéis.\n- Apesar do porte imponente, é completamente inofensiva ao ser humano.\n- Pode subir em árvores com extrema agilidade.\n- Seu nome popular virou sinônimo de algo \"valente e arisco\".\n- Quando ameaçada, se achata lateralmente e assopra, emitindo som."
  },
  {
    id: 12,
    name: "Spilotes sulphureus",
    commonName: "Caninana de Fogo",
    type: "serpente",
    slug: "spilotes-sulphureus",
    image: "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png",
    gallery: [
      "/lovable-uploads/0e7c1a90-84bb-4471-908a-af3fcab85c04.png"
    ],
    description: "A *Spilotes sulphureus*, chamada de **Caninana de Fogo**, é uma parente próxima da *S. pullatus*, mas com coloração mais clara e vibrante. Endêmica de áreas de floresta tropical, é uma serpente imponente, veloz e de comportamento reativo.\n\nNão indicada para iniciantes, mas extremamente valorizada por colecionadores e projetos de educação ambiental.",
    characteristics: [
      "Tamanho adulto: 2 a 2,3 metros",
      "Comportamento: Muito ativa, defensiva e veloz",
      "Expectativa de vida: 15 a 20 anos",
      "Atividade: Diurna",
      "Alimentação: Pequenos vertebrados",
      "Ambientação ideal: Espaço amplo, boa iluminação, galhos para escalada, substrato seco e ventilação constante"
    ],
    curiosities: "- Seu nome vem da coloração amarela vibrante que lembra \"chamas\".\n- Pode subir em árvores com velocidade impressionante.\n- Raramente é mantida em cativeiro fora de criadouros licenciados.\n- Apesar de brava, raramente morde — prefere fugir rapidamente.\n- O *Pseustes sulphureus* é tratado como sinônimo por alguns autores da *Spilotes sulphureus*\n- Quando ameaçada, se achata lateralmente e assopra, emitindo som."
  },
  {
    id: 13,
    name: "Salvator teguixin",
    commonName: "Teiú Dourado",
    type: "lagarto",
    slug: "salvator-teguixin",
    image: "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png",
    gallery: [
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png"
    ],
    description: "O *Salvator teguixin*, ou **Teiú Dourado**, é uma versão mais ágil e esguia do teiú tradicional. Com coloração vibrante e comportamento mais desconfiado, é indicado para criadores com experiência ou foco em observação.\n\nMenor que o *S. merianae*, é uma boa alternativa para quem deseja criar um teiú em espaços medianos.",
    characteristics: [
      "Tamanho adulto: 90 cm a 1,1 metros",
      "Comportamento: Ágil, desconfiado, curioso",
      "Expectativa de vida: Até 15 anos",
      "Atividade: Diurna",
      "Alimentação: Onívoro",
      "Ambientação ideal: Substrato seco, tocas e galhos baixos"
    ],
    curiosities: "- Seu brilho dourado é mais acentuado na fase juvenil.\n- Se adapta tão facilmente ao contato humano quanto o *S. merianae*.\n- Emite sopros como forma de defesa.\n- É especialista em escavar buracos em recintos."
  },
  {
    id: 14,
    name: "Salvator merianae",
    commonName: "Teiú",
    type: "lagarto",
    slug: "salvator-merianae",
    image: "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
    gallery: [
      "/lovable-uploads/370accb0-50cf-459e-a966-c1fc135ecb83.png",
      "/lovable-uploads/b81f6c0b-360a-4408-834b-cb20bd36e3da.png"
    ],
    description: "O *Salvator merianae*, conhecido como **Teiú**, é um dos maiores lagartos da América do Sul. Inteligente, interativo e com forte capacidade de adaptação, é uma das espécies mais procuradas no Brasil por criadores que desejam um réptil de comportamento interessante.\n\nÉ uma excelente espécie para tutores experientes que têm espaço e dedicação para o manejo adequado.",
    characteristics: [
      "Tamanho adulto: Até 1,4 metros",
      "Comportamento: Inteligente, ativo e interativo",
      "Expectativa de vida: 15 a 20 anos",
      "Atividade: Diurna",
      "Alimentação: Onívoro (frutas, ovos, carnes e vegetais)",
      "Ambientação ideal: Grande área terrestre, tocas, luz UVB, aquecimento"
    ],
    curiosities: "- Entra em brumação (sono leve) no inverno.\n- Reconhece vozes e pessoas ao longo do tempo.\n- Pode ser treinado a fazer necessidades em um local fixo.\n- Necessita de rotina rígida para socialização desde filhote."
  },
  {
    id: 15,
    name: "Iguana iguana",
    commonName: "Iguana",
    type: "lagarto",
    slug: "iguana-iguana",
    image: "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png",
    gallery: [
      "/lovable-uploads/c138dc46-3fd6-4dda-aa7b-c02dead150e7.png"
    ],
    description: "A *Iguana iguana* é um dos répteis mais populares do mundo, conhecida por sua beleza exótica e comportamento arborícola. Exige cuidados específicos com alimentação, espaço e exposição solar, sendo indicada para criadores que buscam um compromisso de longo prazo.\n\nPode atingir grandes dimensões e desenvolver forte vínculo com o tutor se bem socializada desde filhote.",
    characteristics: [
      "Tamanho adulto: Até 1,8 metros",
      "Comportamento: Territorial, arborícola e observacional",
      "Expectativa de vida: 15 a 20 anos",
      "Atividade: Diurna",
      "Alimentação: Herbívora (folhas, flores, frutas)",
      "Ambientação ideal: Espaço vertical, luz solar direta ou UVB potente, temperatura entre 28 °C e 34 °C"
    ],
    curiosities: "- Possui um terceiro olho sensível à luz no topo da cabeça.\n- Pode mudar de cor levemente dependendo da temperatura.\n- Seu chicote caudal é usado como defesa.\n- Requer alta umidade e rotina alimentar equilibrada."
  },
  {
    id: 16,
    name: "Diploglossus lessonae",
    commonName: "Lagarto Coral",
    type: "lagarto",
    slug: "diploglossus-lessonae",
    image: "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png",
    gallery: [
      "/lovable-uploads/481f8f82-22b1-407d-9e88-623e453faf6a.png"
    ],
    description: "O *Diploglossus lessonae*, ou **Lagarto Coral**, é uma espécie terrestre e escavadora, rara em cativeiro. Com corpo robusto e hábito reservado, chama atenção por sua aparência exótica e comportamento discreto.\n\nExcelente para criadores que desejam observar padrões naturais e comportamento de forrageamento.",
    characteristics: [
      "Tamanho adulto: 30 a 40 cm",
      "Comportamento: Reservado, escavador, observacional",
      "Expectativa de vida: 10 a 12 anos",
      "Atividade: Diurna",
      "Alimentação: Insetívoro e onívoro",
      "Ambientação ideal: Substrato profundo, folhas secas, esconderijos e toca úmida"
    ],
    curiosities: "- Tem escamas lisas e aparência semelhante a uma cobra com patas.\n- Costuma se enterrar rapidamente ao menor sinal de ameaça.\n- Pouco comum em criadouros comerciais.\n- Se adaptam melhor a ambientes com folhas e galhos secos."
  },
  {
    id: 17,
    name: "Polychrus marmoratus",
    commonName: "Lagarto Preguiça",
    type: "lagarto",
    slug: "polychrus-marmoratus",
    image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
    gallery: [
      "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png"
    ],
    description: "O *Polychrus marmoratus*, conhecido como **Lagarto Preguiça**, é uma joia entre os répteis tropicais. De movimentação lenta, comportamento pacífico e coloração camuflada, é perfeito para espaços verticais e com plantas naturais.\n\nIdeal para criadores que querem um lagarto único, com hábitos diferenciados.",
    characteristics: [
      "Tamanho adulto: Até 30 cm",
      "Comportamento: Pacífico, observacional, lento",
      "Expectativa de vida: 8 a 10 anos",
      "Atividade: Diurna",
      "Alimentação: Insetívoro",
      "Ambientação ideal: Terrário bioativo com folhagens, umidade e galhos verticais"
    ],
    curiosities: "- Seu nome vem do jeito vagaroso de se movimentar.\n- Tem capacidade limitada de trocar de cor.\n- Gosta de ambientes úmidos e pouco barulho.\n- É sensível ao estresse — precisa de local tranquilo."
  },
  {
    id: 18,
    name: "Thecadactylus rapicauda",
    commonName: "Lagartixa Rabo de Nabo",
    type: "lagarto",
    slug: "thecadactylus-rapicauda",
    image: "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png",
    gallery: [
      "/lovable-uploads/11848f61-6118-4555-92b5-61760f34cf00.png"
    ],
    description: "A *Thecadactylus rapicauda*, chamada de **Lagartixa Rabo de Nabo**, é uma espécie arborícola noturna com aparência robusta e olhos expressivos. Vive bem em grupos e é ativa durante a noite, sendo uma excelente opção para quem deseja um réptil diferente.\n\nÉ ideal para terrários verticais e pouco iluminados.",
    characteristics: [
      "Tamanho adulto: Até 14 cm",
      "Comportamento: Sociável, ágil, noturno",
      "Expectativa de vida: 10 a 12 anos",
      "Atividade: Noturna",
      "Alimentação: Insetívora",
      "Ambientação ideal: Terrários verticais com esconderijos e paredes ásperas"
    ],
    curiosities: "- Pode emitir sons agudos semelhantes a grilos.\n- Seu rabo grosso funciona como reserva de gordura.\n- Tem a habilidade de escalar vidros e superfícies lisas.\n- Prefere ambientes escuros e úmidos."
  },
  {
    id: 19,
    name: "Chelonoidis carbonaria",
    commonName: "Jabuti Piranga",
    type: "quelonio",
    slug: "chelonoidis-carbonaria",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ],
    description: "O *Chelonoidis carbonaria*, conhecido como **Jabuti Piranga**, é um dos quelônios terrestres mais criados no Brasil. De comportamento dócil, é ativo durante o dia e pode ser criado em jardins com segurança.\n\nÉ ideal para criadores que buscam um animal longevo, de fácil manejo e visual encantador.",
    characteristics: [
      "Tamanho adulto: 30 a 40 cm",
      "Comportamento: Lento, dócil, explorador",
      "Expectativa de vida: 40 a 60 anos",
      "Atividade: Diurna",
      "Alimentação: Herbívora com suplementação de cálcio",
      "Ambientação ideal: Área externa, sombra, abrigo contra frio e chuva"
    ],
    curiosities: "- Suas escamas de cor laranja ajudam na identificação.\n- Interagem com o ambiente e reconhecem padrões.\n- Podem viver décadas com alimentação e sol adequados.\n- Costumam ter hábitos bem previsíveis."
  },
  {
    id: 20,
    name: "Chelonoidis denticulata",
    commonName: "Jabuti Tinga",
    type: "quelonio",
    slug: "chelonoidis-denticulata",
    image: "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png",
    gallery: [
      "/lovable-uploads/90e09ad1-fa3b-48d6-9979-59f090220fcb.png"
    ],
    description: "O *Chelonoidis denticulata*, chamado de **Jabuti Tinga**, é o maior jabuti das Américas. Com comportamento tranquilo, é menos ativo que o piranga e prefere áreas sombreadas e úmidas.\n\nIdeal para áreas externas amplas e com temperatura controlada, é um símbolo de longevidade e tranquilidade.",
    characteristics: [
      "Tamanho adulto: 40 a 50 cm",
      "Comportamento: Calmo, reservado, observador",
      "Expectativa de vida: 60 anos ou mais",
      "Atividade: Diurna",
      "Alimentação: Frutas, flores e folhas verdes",
      "Ambientação ideal: Sombra constante, abrigo úmido e área ampla"
    ],
    curiosities: "- Possui coloração mais escura que o piranga.\n- É menos ativo, mas muito longevo.\n- Costuma se esconder sob folhas e galhos.\n- Pode conviver com outros jabutis sem problemas."
  },
  {
    id: 21,
    name: "Crocodilurus amazonicus",
    commonName: "Jacarerana",
    type: "lagarto",
    slug: "crocodilurus-amazonicus",
    image: "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png",
    gallery: [
      "/lovable-uploads/b11770a0-4aca-4362-aa63-c0e9a9d4df0c.png"
    ],
    description: "A *Crocodilurus amazonicus*, chamada popularmente de **Jacarerana**, é um lagarto semiaquático raro e fascinante. De corpo achatado e cauda achatada lateralmente, lembra um pequeno jacaré. Vive tanto em terra quanto em ambientes alagados.\n\nPerfeita para criadores avançados, com sistema aquático em funcionamento e foco em espécies amazônicas.",
    characteristics: [
      "Tamanho adulto: Até 1 metro",
      "Comportamento: Ágil, semiaquático, discreto",
      "Expectativa de vida: 12 a 15 anos",
      "Atividade: Diurna",
      "Alimentação: Peixes, insetos e carnes magras",
      "Ambientação ideal: Aquaterrário com áreas secas e aquáticas bem definidas"
    ],
    curiosities: "- Nada com habilidade e pode permanecer submerso por longos períodos.\n- Sua cauda atua como leme aquático.\n- É extremamente sensível à movimentação brusca.\n- Ainda pouco difundida no hobby, mas de grande valor ecológico."
  }
  // The rest of the 21 species would follow the same format
];

export default function SpeciesDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [species, setSpecies] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Find the species by ID or slug
  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    let foundSpecies;
    
    // First try to find by slug if it exists
    if (slug) {
      foundSpecies = speciesList.find(s => s.slug === slug);
    } else if (id) {
      // Otherwise try to find by ID
      foundSpecies = speciesList.find(s => s.id === Number(id));
    }
    
    if (foundSpecies) {
      setSpecies(foundSpecies);
      setSelectedImage(foundSpecies.gallery?.[0] || foundSpecies.image);
    } else {
      // If species not found, redirect to species list
      navigate("/especies");
    }
    
    setIsLoading(false);
  }, [id, slug, navigate]);
  
  const formatContentWithMarkdown = (content) => {
    if (!content) return '';
    
    // Handle bold text
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italic text
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle line breaks
    formatted = formatted.replace(/\n/g, '<br />');
    
    return formatted;
  };
  
  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }
  
  if (!species) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Espécie não encontrada</h1>
          <p className="mb-6 text-muted-foreground">Esta espécie não está disponível em nosso catálogo.</p>
          <Button asChild className="min-h-[44px]">
            <Link to="/especies">Voltar para espécies</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8 sm:py-12 sm:px-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="pl-0 min-h-[44px]">
          <Link to="/especies">
            <ChevronLeft className="h-4 w-4 mr-1" /> Voltar para Espécies
          </Link>
        </Button>
      </div>
      
      {/* Species Header */}
      <div className="flex flex-col items-start mb-6 sm:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold"><em>{species.name}</em></h1>
        <p className="text-lg sm:text-xl text-muted-foreground">{species.commonName}</p>
        <div className="mt-2 inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {species.type === "serpente" ? "Serpente" : species.type === "lagarto" ? "Lagarto" : "Quelônio"}
        </div>
      </div>
      
      {/* Image Gallery and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={species.name} 
              className="w-full h-auto object-cover rounded-lg"
              style={{ maxHeight: "500px" }}
            />
          </div>
          
          {/* Thumbnails */}
          {species.gallery && species.gallery.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {species.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  className={`rounded-md overflow-hidden border-2 min-h-[44px] ${selectedImage === img ? 'border-serpente-600' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`${species.name} - imagem ${idx + 1}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="description">
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1 min-h-[44px]">Descrição</TabsTrigger>
              <TabsTrigger value="characteristics" className="flex-1 min-h-[44px]">Características</TabsTrigger>
              <TabsTrigger value="curiosities" className="flex-1 min-h-[44px]">Curiosidades</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.description ? (
                  <p dangerouslySetInnerHTML={{ __html: formatContentWithMarkdown(species.description) }}></p>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Descrição detalhada será adicionada em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="characteristics" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.characteristics && species.characteristics.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {species.characteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Características da espécie serão adicionadas em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="curiosities" className="mt-4">
              <div className="p-4 border rounded-md bg-card">
                {species.curiosities ? (
                  <p dangerouslySetInnerHTML={{ __html: formatContentWithMarkdown(species.curiosities) }}></p>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Curiosidades sobre a espécie serão adicionadas em breve.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Related Species */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Espécies Relacionadas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {speciesList
            .filter(s => s.id !== species.id && s.type === species.type)
            .slice(0, 4)
            .map((relatedSpecies) => (
              <div key={relatedSpecies.id} className="docs-card-gradient border rounded-lg overflow-hidden transition-all hover:shadow-md group">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={relatedSpecies.image}
                    alt={relatedSpecies.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-bold text-sm sm:text-base mb-1 line-clamp-1"><em>{relatedSpecies.name}</em></h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3">{relatedSpecies.commonName}</p>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[44px]" asChild>
                      <Link to={`/especies-criadas/${relatedSpecies.slug}`}>Ver Detalhes</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
