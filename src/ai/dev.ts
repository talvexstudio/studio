import { config } from 'dotenv';
config();

import '@/ai/flows/generate-classification-rules.ts';
import '@/ai/flows/suggest-transaction-categories.ts';
import '@/ai/flows/import-rules-from-prompt.ts';