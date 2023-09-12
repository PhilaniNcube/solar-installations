import Analytics from 'analytics';
import googleTagManager from '@analytics/google-tag-manager';

const GTM_CONTAINER_ID = "GTM-M2TSCHP3";

const analytics = Analytics({
  app: 'solar-installation', // Call this whatever you like.
  plugins: [
    googleTagManager({
      containerId: GTM_CONTAINER_ID,
      enabled: true,
    }),
  ],
});

export default analytics;
