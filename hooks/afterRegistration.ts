import { Logger } from '@vue-storefront/core/lib/logger'

// This function will be fired both on server and client side context after registering other parts of the module
declare global {
  interface Window { Tawk: any; }
}

export function afterRegistration({ Vue, config, store, isServer }): any {

  if( !config.tawk || !config.tawk.site_id ) {

    Logger.warn('No tawk config or tawk app_id found.', 'Tawk')();
    return;

  }

  var tawkSiteId = config.tawk.site_id;

  this.onTawkLoaded = (): void => {

    setTimeout(() => {

      window.Tawk = window.Tawk || {};

      // Boot Tawk with your app config.
      window.Tawk("boot", {
        site_id: tawkSiteId
      });

    }, 1);

  }

  if (!isServer) {

    var head = document.head;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `(function(){var w=window;var ic=w.Tawk;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.tawkSettings);} else {var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Tawk=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://embed.tawk.to/${tawkSiteId}/default';s.charset='UTF-8';s.setAttribute('crossorigin','*');var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);} else {w.addEventListener('load',l,false);}}})()`

    script.onload = this.onTawkLoaded();

    head.appendChild(script);

  }

}
