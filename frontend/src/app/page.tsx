import fs from 'fs';
import path from 'path';
import LedgerPage from '@/components/LedgerPage';

export default function Home() {
  const filePath = path.join(process.cwd(), 'public', 'ledger.html');
  const htmlContent = fs.readFileSync(filePath, 'utf8');

  return <LedgerPage initialHtml={htmlContent} />;
}
