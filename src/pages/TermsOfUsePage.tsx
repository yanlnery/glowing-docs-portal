
import React from 'react';

const TermsOfUsePage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Termos de Uso
      </h1>
      <div className="max-w-3xl mx-auto prose dark:prose-invert lg:prose-lg">
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Ao acessar o site da Pet Serpentes & Companhia LTDA, o usuário concorda com os termos e condições estabelecidos a seguir. Recomendamos a leitura atenta antes de qualquer interação ou compra.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">1. Finalidade do Site</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Este site tem como objetivo apresentar informações sobre o nosso criadouro, oferecer conteúdo educacional, divulgar espécies disponíveis para venda legalizada e facilitar o contato entre criador e comprador.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">2. Compra e Responsabilidade Legal</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Todos os animais disponibilizados no site são legalizados conforme a legislação vigente e só serão vendidos mediante a microchipagem, emissão de Nota Fiscal, Certificado de Origem, Licença de Transporte, Atestado de Saúde (Interestadual) e Guia de Transporte Animal.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          O comprador deve estar ciente das responsabilidades legais ao adquirir um animal silvestre.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">3. Cadastro do Usuário</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Ao se cadastrar no site, o usuário se compromete a fornecer informações verídicas e atualizadas. O uso indevido de dados pode levar ao cancelamento do cadastro e eventual denúncia às autoridades competentes.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">4. Propriedade Intelectual</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Todas as imagens, textos, logotipos e conteúdos presentes neste site são de propriedade da Pet Serpentes & Companhia LTDA e não podem ser utilizados ou reproduzidos sem autorização expressa.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">5. Limitação de Responsabilidade</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          A Pet Serpentes & Companhia não se responsabiliza por problemas técnicos externos à sua plataforma (como quedas de conexão ou falhas de terceiros), nem por mau uso dos animais por parte do comprador.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">6. Alterações nos Termos</h2>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Reservamo-nos o direito de modificar estes termos a qualquer momento. Quaisquer alterações serão publicadas neste espaço, com data de atualização.
        </p>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
