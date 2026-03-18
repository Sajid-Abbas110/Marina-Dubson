import prisma from './prisma'

export interface SystemPolicyMap {
  [key: string]: string
}

const DEFAULT_POLICIES: Record<
  string,
  { value: string; label?: string; description?: string }
> = {
  cancellation_policy_text: {
    value:
      'Cancellations must be made before 3:00 PM on the previous business day. Late cancellations incur the minimum booking fee noted per proceeding.',
    label: 'Cancellation Policy',
    description: 'Text displayed to clients regarding cancellation rules.'
  },
  financial_responsibility_private: {
    value: '30',
    label: 'Client Financial Responsibility Days',
    description: 'Default net days for private clients.'
  },
  financial_responsibility_agency: {
    value: '45',
    label: 'Agency Financial Responsibility Days',
    description: 'Default net days for agency clients.'
  },
  payment_terms_choice: {
    value: '30',
    label: 'Payment Terms Selection',
    description: 'Primary payment term (30, 45, or CUSTOM).'
  },
  payment_terms_custom: {
    value: '',
    label: 'Custom Payment Terms',
    description: 'Free-text override when CUSTOM is selected.'
  },
  payment_terms_description: {
    value: 'Payment is due within 30 days of invoice issuance.',
    label: 'Payment Terms Description',
    description: 'Supporting copy shown to clients.'
  },
  late_payment_interest_enabled: {
    value: 'false',
    label: 'Late Payment Interest Enabled',
    description: 'Toggle for automatic monthly late interest.'
  },
  late_payment_interest_rate: {
    value: '1.5',
    label: 'Late Payment Interest Rate',
    description: 'Monthly interest rate (%) applied when enabled.'
  },
  marketplace_show_claim_counts: {
    value: 'true',
    label: 'Marketplace Claim Count Visibility',
    description: 'When disabled, reporters cannot see pending/accepted claim totals.'
  }
}

const VALID_POLICY_KEYS = new Set(Object.keys(DEFAULT_POLICIES))

export async function ensurePolicyDefaults() {
  for (const key of Object.keys(DEFAULT_POLICIES)) {
    const { value, label, description } = DEFAULT_POLICIES[key]
    await prisma.systemPolicy.upsert({
      where: { key },
      update: {},
      create: {
        key,
        value,
        label,
        description
      }
    })
  }
}

export async function getAllSystemPolicies(): Promise<SystemPolicyMap> {
  await ensurePolicyDefaults()
  const stored = await prisma.systemPolicy.findMany({ orderBy: { key: 'asc' } })
  return stored.reduce<SystemPolicyMap>((acc, policy) => {
    acc[policy.key] = policy.value
    return acc
  }, {})
}

export async function updateSystemPolicies(
  updates: Record<string, string>
): Promise<SystemPolicyMap> {
  const sanitized: Record<string, string> = {}
  Object.entries(updates).forEach(([key, value]) => {
    if (VALID_POLICY_KEYS.has(key)) {
      sanitized[key] = value
    }
  })

  if (!Object.keys(sanitized).length) {
    throw new Error('No valid policy updates provided')
  }

  for (const [key, value] of Object.entries(sanitized)) {
    const defaults = DEFAULT_POLICIES[key]
    await prisma.systemPolicy.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        label: defaults?.label,
        description: defaults?.description
      }
    })
  }

  return getAllSystemPolicies()
}

export function isValidPolicyKey(key: string) {
  return VALID_POLICY_KEYS.has(key)
}
