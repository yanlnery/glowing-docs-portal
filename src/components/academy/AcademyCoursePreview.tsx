import React from 'react';

const AcademyCoursePreview: React.FC = () => {
  return (
    <section className="py-16 bg-background mb-16">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="docs-section-title">
            <h2 className="text-3xl font-bold">Cursos de Herpecultura</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Aprenda sobre herpecultura de forma prática com especialistas do mercado
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900 flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-serpente-600">C1</span>
              </div>
              <div>
                <h4 className="font-bold">Fundamentos da Herpecultura</h4>
                <p className="text-sm text-muted-foreground">Do básico ao avançado</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Aprenda os fundamentos essenciais para iniciar sua jornada na criação de répteis com segurança e conhecimento."
            </p>
          </div>

          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900 flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-serpente-600">C2</span>
              </div>
              <div>
                <h4 className="font-bold">Alimentação e Nutrição</h4>
                <p className="text-sm text-muted-foreground">Saúde e bem-estar animal</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Aprenda sobre dietas adequadas, suplementação e práticas alimentares para manter seus animais saudáveis."
            </p>
          </div>

          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-serpente-100 dark:bg-serpente-900 flex items-center justify-center mr-3">
                <span className="text-lg font-bold text-serpente-600">C3</span>
              </div>
              <div>
                <h4 className="font-bold">Manejo</h4>
                <p className="text-sm text-muted-foreground">Técnicas práticas</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Domine as melhores técnicas de manejo para garantir segurança e conforto na criação dos seus répteis."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyCoursePreview;
