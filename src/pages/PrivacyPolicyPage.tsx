
import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Política de Privacidade
      </h1>
      <div className="max-w-3xl mx-auto prose dark:prose-invert lg:prose-lg">
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          A nossa loja tem o compromisso com a privacidade e a segurança de seus clientes durante todo o processo de navegação e compra pelo site.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Os dados cadastrais dos clientes não são vendidos, trocados ou divulgados para terceiros, exceto quando essas informações forem necessárias para o processo de entrega, cobrança ou participação em promoções solicitadas pelos clientes.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Seus dados pessoais são peça fundamental para que seu pedido chegue em segurança, na sua casa, de acordo com nosso prazo de entrega.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Utilizamos cookies e informações da sua navegação (sessão do browser) com o objetivo de traçar um perfil do público que visita o site e aperfeiçoar sempre nossos serviços, produtos, conteúdos e garantir as melhores ofertas e promoções.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Durante todo esse processo, mantemos suas informações em sigilo absoluto.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Seus dados são registrados de forma automatizada, dispensando manipulação humana.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          Para que esses dados permaneçam intactos, nunca compartilhe sua senha com terceiros, mesmo que sejam amigos ou parentes.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          As alterações sobre nossa política de privacidade serão devidamente informadas neste espaço.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
