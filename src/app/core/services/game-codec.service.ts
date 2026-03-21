import { Injectable } from '@angular/core';
import { Game, Round, Answer } from '../models/game.model';

interface CompactAnswer { t: string; p: number; }
interface CompactRound  { q: string; a: CompactAnswer[]; }
interface CompactGame   { n: string; r: CompactRound[]; }

@Injectable({ providedIn: 'root' })
export class GameCodecService {

  async encode(game: Game): Promise<string> {
    const compact: CompactGame = {
      n: game.name,
      r: game.rounds.map(round => ({
        q: round.question,
        a: round.answers.map(ans => ({ t: ans.text, p: ans.points })),
      })),
    };
    const json = JSON.stringify(compact);
    const bytes = new TextEncoder().encode(json);
    const compressed = await this.compress(bytes);
    return this.toBase64Url(compressed);
  }

  async decode(phrase: string): Promise<Game> {
    let bytes: Uint8Array;
    try {
      bytes = this.fromBase64Url(phrase.trim());
    } catch {
      throw new Error('Nieprawidłowy format frazy — błąd dekodowania Base64.');
    }

    let json: string;
    try {
      const decompressed = await this.decompress(bytes);
      json = new TextDecoder().decode(decompressed);
    } catch {
      throw new Error('Nie udało się zdekompresować frazy. Sprawdź, czy skopiowałeś ją w całości.');
    }

    let compact: unknown;
    try {
      compact = JSON.parse(json);
    } catch {
      throw new Error('Dane wewnątrz frazy są uszkodzone (nieprawidłowy JSON).');
    }

    if (!this.isValidCompactGame(compact)) {
      throw new Error('Struktura gry jest nieprawidłowa lub niekompletna.');
    }

    return this.hydrate(compact);
  }

  private async compress(input: Uint8Array): Promise<Uint8Array> {
    const cs = new CompressionStream('deflate-raw');
    const writer = cs.writable.getWriter();
    writer.write(input);
    writer.close();
    return this.collectStream(cs.readable);
  }

  private async decompress(input: Uint8Array): Promise<Uint8Array> {
    const ds = new DecompressionStream('deflate-raw');
    const writer = ds.writable.getWriter();
    writer.write(input);
    writer.close();
    return this.collectStream(ds.readable);
  }

  private async collectStream(readable: ReadableStream<Uint8Array>): Promise<Uint8Array> {
    const chunks: Uint8Array[] = [];
    const reader = readable.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    return result;
  }

  private toBase64Url(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  private fromBase64Url(phrase: string): Uint8Array {
    const padded = phrase
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      + '=='.slice(0, (4 - (phrase.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  private isValidCompactGame(obj: unknown): obj is CompactGame {
    if (typeof obj !== 'object' || obj === null) return false;
    const g = obj as Record<string, unknown>;
    if (typeof g['n'] !== 'string' || !g['n'].trim()) return false;
    if (!Array.isArray(g['r']) || g['r'].length === 0) return false;
    return (g['r'] as unknown[]).every(r => this.isValidCompactRound(r));
  }

  private isValidCompactRound(obj: unknown): obj is CompactRound {
    if (typeof obj !== 'object' || obj === null) return false;
    const r = obj as Record<string, unknown>;
    if (typeof r['q'] !== 'string' || !r['q'].trim()) return false;
    if (!Array.isArray(r['a']) || r['a'].length === 0) return false;
    return (r['a'] as unknown[]).every(a => this.isValidCompactAnswer(a));
  }

  private isValidCompactAnswer(obj: unknown): obj is CompactAnswer {
    if (typeof obj !== 'object' || obj === null) return false;
    const a = obj as Record<string, unknown>;
    return typeof a['t'] === 'string' && a['t'].trim() !== ''
        && typeof a['p'] === 'number' && Number.isFinite(a['p']) && a['p'] >= 0;
  }

  private hydrate(compact: CompactGame): Game {
    return {
      id: crypto.randomUUID(),
      name: compact.n,
      rounds: compact.r.map(r => ({
        id: crypto.randomUUID(),
        question: r.q,
        answers: r.a.map(a => ({
          id: crypto.randomUUID(),
          text: a.t,
          points: a.p,
        } satisfies Answer)),
      } satisfies Round)),
    };
  }
}
