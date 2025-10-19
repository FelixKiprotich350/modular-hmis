import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

export interface InsuranceClaim {
  id: string;
  insuranceId: string;
  billingId: string;
  claimNumber: string;
  amount: number;
  status: 'submitted' | 'approved' | 'denied' | 'pending';
  submittedDate: Date;
  processedDate?: Date;
  denialReason?: string;
}

export interface CreateInsuranceDto {
  policyNumber: string;
  provider: string;
  policyHolder: string;
  coverage?: any;
}

export interface UpdateInsuranceDto {
  provider?: string;
  policyHolder?: string;
  coverage?: any;
}

@Injectable()
export class InsuranceService {
  constructor(private db: PrismaClient) {}

  async createInsurance(data: CreateInsuranceDto): Promise<any> {
    return await this.db.insurance.create({
      data,
      include: {
        billings: true
      }
    });
  }

  async getInsurance(id: string): Promise<any> {
    return await this.db.insurance.findUnique({
      where: { id },
      include: {
        billings: {
          include: {
            patient: {
              include: {
                person: true
              }
            }
          }
        }
      }
    });
  }

  async getInsuranceByPolicyNumber(policyNumber: string): Promise<any> {
    return await this.db.insurance.findUnique({
      where: { policyNumber },
      include: {
        billings: true
      }
    });
  }

  async verifyInsurance(policyNumber: string): Promise<any> {
    const insurance = await this.db.insurance.findUnique({
      where: { policyNumber }
    });

    if (!insurance) {
      return {
        valid: false,
        message: 'Insurance policy not found'
      };
    }

    return {
      valid: true,
      insurance,
      coverage: insurance.coverage,
      message: 'Insurance verified successfully'
    };
  }

  async submitClaim(insuranceId: string, billingId: string, amount: number): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      const insurance = await tx.insurance.findUnique({
        where: { id: insuranceId }
      });

      if (!insurance) {
        throw new Error('Insurance not found');
      }

      const billing = await tx.billing.findUnique({
        where: { id: billingId }
      });

      if (!billing) {
        throw new Error('Billing record not found');
      }

      // Update billing to link with insurance
      await tx.billing.update({
        where: { id: billingId },
        data: {
          insuranceId,
          status: 'insurance_submitted'
        }
      });

      return {
        claimNumber: `CLM-${Date.now()}`,
        insuranceId,
        billingId,
        amount,
        status: 'submitted',
        submittedDate: new Date()
      };
    });
  }

  async processClaim(claimNumber: string, status: 'approved' | 'denied', denialReason?: string): Promise<any> {
    return await this.db.$transaction(async (tx) => {
      // Find billing record associated with claim
      const billing = await tx.billing.findFirst({
        where: {
          // This would need a proper claim tracking table in production
          status: 'insurance_submitted'
        }
      });

      if (!billing) {
        throw new Error('Associated billing record not found');
      }

      let newBillingStatus = 'pending';
      if (status === 'approved') {
        newBillingStatus = 'insurance_approved';
      } else if (status === 'denied') {
        newBillingStatus = 'insurance_denied';
      }

      await tx.billing.update({
        where: { id: billing.id },
        data: {
          status: newBillingStatus
        }
      });

      return {
        claimNumber,
        status,
        processedDate: new Date(),
        denialReason,
        billingUpdated: true
      };
    });
  }

  async getInsuranceCoverage(insuranceId: string, serviceCode: string): Promise<any> {
    const insurance = await this.db.insurance.findUnique({
      where: { id: insuranceId }
    });

    if (!insurance || !insurance.coverage) {
      return {
        covered: false,
        coveragePercentage: 0,
        message: 'No coverage information available'
      };
    }

    // Simplified coverage check - in production this would be more complex
    const coverage = insurance.coverage as any;
    const serviceCoverage = coverage[serviceCode] || coverage['default'];

    return {
      covered: serviceCoverage ? serviceCoverage.covered : false,
      coveragePercentage: serviceCoverage ? serviceCoverage.percentage : 0,
      copay: serviceCoverage ? serviceCoverage.copay : 0,
      deductible: serviceCoverage ? serviceCoverage.deductible : 0
    };
  }

  async generateInsuranceReport(startDate: Date, endDate: Date): Promise<any> {
    const billings = await this.db.billing.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        insuranceId: {
          not: null
        }
      },
      include: {
        insurance: true,
        patient: {
          include: {
            person: true
          }
        }
      }
    });

    const totalClaims = billings.length;
    const totalAmount = billings.reduce((sum, b) => sum + b.amount, 0);
    const approvedClaims = billings.filter(b => b.status === 'insurance_approved').length;
    const deniedClaims = billings.filter(b => b.status === 'insurance_denied').length;
    const pendingClaims = billings.filter(b => b.status === 'insurance_submitted').length;

    const insuranceProviders = billings.reduce((acc, b) => {
      if (b.insurance) {
        acc[b.insurance.provider] = (acc[b.insurance.provider] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      period: { startDate, endDate },
      summary: {
        totalClaims,
        totalAmount,
        approvedClaims,
        deniedClaims,
        pendingClaims,
        approvalRate: totalClaims > 0 ? (approvedClaims / totalClaims * 100).toFixed(2) + '%' : '0%'
      },
      insuranceProviders: Object.entries(insuranceProviders)
        .map(([provider, count]) => ({ provider, count }))
        .sort((a, b) => b.count - a.count),
      claims: billings
    };
  }

  async listInsurances(): Promise<any[]> {
    return await this.db.insurance.findMany({
      include: {
        billings: {
          include: {
            patient: {
              include: {
                person: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async updateInsurance(id: string, data: UpdateInsuranceDto): Promise<any> {
    return await this.db.insurance.update({
      where: { id },
      data
    });
  }

  async deleteInsurance(id: string): Promise<boolean> {
    await this.db.insurance.delete({ where: { id } });
    return true;
  }
}