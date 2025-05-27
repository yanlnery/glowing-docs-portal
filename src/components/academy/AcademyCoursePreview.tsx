
import React from 'react';

const AcademyCoursePreview: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4 sm:px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="docs-section-title">
            <h2 className="text-3xl font-bold">Cursos em Destaque</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-4">
            Explore nossos cursos mais populares e avançados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                <span className="text-lg font-bold">C1</span>
              </div>
              <div>
                <h4 className="font-bold">Cursos de Criação de Répteis</h4>
                <p className="text-sm text-muted-foreground">Aprenda a criar e cuidar de répteis</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Aprenda a criar e cuidar de répteis de forma eficaz com nossos cursos de criação."
            </p>
          </div>

          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                <span className="text-lg font-bold">C2</span>
              </div>
              <div>
                <h4 className="font-bold">Cursos de Manejo de Répteis</h4>
                <p className="text-sm text-muted-foreground">Aprenda a manter e cuidar de répteis</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Aprenda a manter e cuidar de répteis de forma eficaz com nossos cursos de manejo."
            </p>
          </div>

          <div className="docs-card p-6 border rounded-lg">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mr-3">
                <span className="text-lg font-bold">C3</span>
              </div>
              <div>
                <h4 className="font-bold">Cursos de Herpetologia</h4>
                <p className="text-sm text-muted-foreground">Aprenda sobre herpetologia</p>
              </div>
            </div>
            <p className="italic text-muted-foreground">
              "Aprenda sobre herpetologia de forma eficaz com nossos cursos de herpetologia."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyCoursePreview;
