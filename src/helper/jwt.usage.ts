import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  id: string;
  email: string;
}

export class JwtUsage {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: jwtPayload.id,
          email: jwtPayload.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: jwtPayload.id,
          email: jwtPayload.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    const tokens: Tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return tokens;
  }

  decodeToken(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token) as any;
      if (decodedToken) {
        return decodedToken; // This will contain the payload (claims) of the token
      }
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}
