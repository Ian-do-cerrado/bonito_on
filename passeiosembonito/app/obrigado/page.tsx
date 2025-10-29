import React from 'react';

export default function ObrigadoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">Obrigado!</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">Sua mensagem foi enviada com sucesso. Em breve entraremos em contato.</p>
        <a href="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
}