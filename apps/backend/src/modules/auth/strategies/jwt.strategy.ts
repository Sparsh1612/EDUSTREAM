import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ITokenPayload } from '../../../types/user.types';

/**
 * JWT Strategy
 * Validates JWT tokens using Passport.js
 * Extracts token from Authorization header: "Bearer <token>"
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  /**
   * Validate JWT payload
   * Called after token is successfully verified
   */
  async validate(payload: ITokenPayload) {
    return this.authService.validateUser(payload);
  }
}
