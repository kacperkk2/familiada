import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

interface ShortUrlResponse  { shorturl: string; }
interface ExpandUrlResponse { url: string; }

@Injectable({ providedIn: 'root' })
export class UrlShortenerService {
  private httpClient = inject(HttpClient);

  getShortUrl(longUrl: string): Observable<ShortUrlResponse | null> {
    const encodedUrl = encodeURIComponent(longUrl);
    return this.httpClient
      .get<ShortUrlResponse>('https://is.gd/create.php?format=json&url=' + encodedUrl)
      .pipe(
        timeout(3000),
        catchError(() => of(null)),
      );
  }

  expandUrl(code: string): Observable<ExpandUrlResponse | null> {
    return this.httpClient
      .get<ExpandUrlResponse>('https://is.gd/forward.php?format=json&shorturl=' + code)
      .pipe(
        timeout(3000),
        catchError(() => of(null)),
      );
  }
}
