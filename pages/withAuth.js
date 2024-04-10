// withAuth.js

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext';

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    const { authenticated } = useAuth();

    useEffect(() => {
      if (!authenticated) {
        router.push('/index.html'); // Redirect to the login page if not authenticated
      }
    }, [authenticated]);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
