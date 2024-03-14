import { Build } from '@stencil/core';

let missingAssetPathWarning = false;

declare global {
  interface Window {
    __CORE_ASSET_PATH__?: string
  }
}

/**
 *
 * Reads the component asset path config from meta tag or a global variable.
 * This is a temporary workaround until these issues have been addressed:
 *
 * https://github.com/ionic-team/stencil/issues/2826/
 * https://github.com/ionic-team/stencil/issues/3470
 * https://github.com/ionic-team/stencil-ds-output-targets/issues/186
 */
export const getAssetPath = (path: string) => {
  const metaCoreAssetPath = document.head.querySelector<HTMLMetaElement>('meta[data-asset-path]')?.dataset.coreAssetPath;

  // Get the asset path from the window object if available
  const windowAssetPath = window.__CORE_ASSET_PATH__;

  // Set the CDN Asset path using the latest version
  const cdnAssetPath = 'https://cdn.jsdelivr.net/npm/@ju-skinner/ideal-icons/dist/ideal-icons/';

  const assetBasePath  = Build.isTesting ? '/dist/pds-icons' : metaCoreAssetPath || windowAssetPath || cdnAssetPath || '/'

  // Display a warning if the assets are fetched from the CDN.
  if ( assetBasePath.startsWith('https://cdn.jsdelivr.net/npm/') && !missingAssetPathWarning ) {
    missingAssetPathWarning = true;
    console.warn(`
      Fetching asssets from jsDelivr CDN.\n\n It's recommended that you bundle Assets with your application and setting the path accordingly.\n\n
    `)
  }

  let assetPath = path;

  if ( path.startsWith ('./') ) {
    assetPath = path.substring(2);
  }

  if ( !assetBasePath.endsWith('/') ) {
    assetPath = '/' + assetPath;
  }

  return assetBasePath + assetPath;
}


export {};
