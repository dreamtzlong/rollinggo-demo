/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chat } from './components/Chat';
import { LanguageProvider } from './lib/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full h-full sm:w-[400px] sm:h-[850px] sm:max-h-screen sm:rounded-[40px] sm:border-[8px] sm:border-gray-900 overflow-hidden bg-white shadow-2xl relative">
          <Chat />
        </div>
      </div>
    </LanguageProvider>
  );
}
