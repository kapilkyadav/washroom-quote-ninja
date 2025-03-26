
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder and TextDecoder to global scope for JSDOM
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
