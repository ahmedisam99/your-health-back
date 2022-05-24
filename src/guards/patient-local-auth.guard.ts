import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PatientLocalAuthGuard extends AuthGuard('patient-local') {}
