import { useState, useEffect } from 'react';
import { saasApi } from '../api/saasApi';
import { useAuth } from '../context/AuthContext';

export function useFeatureAccess(featureName: string, orgId: string = 'org_psr_eng') {
  const { user } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const res = await saasApi.checkFeatureAccess(featureName, orgId, user?.id);
        if (isMounted) {
          setHasAccess(res.hasAccess);
        }
      } catch (e) {
        // Fallback gracefully to granting baseline features
        if (isMounted) setHasAccess(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    check();
    return () => {
      isMounted = false;
    };
  }, [featureName, orgId, user?.id]);

  return { hasAccess, loading };
}
