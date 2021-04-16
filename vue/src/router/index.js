import Vue from 'vue'
import VueRouter from 'vue-router'
import Farming from '../pages/farming'
import About from '../pages/about'
import BSC from '../pages/BSC'
import Airdrop from '../pages/airdrop'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'farming',
        component: Farming,
        meta: {
          title: 'Bribe',
          metaTags: [
            {
              name: 'description',
              content: 'Stake your FEI and Earn Bribe'
            },
            {
              property: 'og:description',
              content: 'Stake your FEI and Earn Bribe'
            }
          ]
        }
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {
          title: 'About Bribe',
          metaTags: [
            {
              name: 'description',
              content: 'Bribe is a cross-chain liquidity farming protocal for algorithmic stablecoins'
            },
            {
              property: 'og:description',
              content: 'Bribe is a cross-chain liquidity farming protocal for algorithmic stablecoins'
            }
          ]
        }
    },
    {
        path: '/airdrop',
        name: 'airdrop',
        component: Airdrop,
        meta: {
          title: 'Bribe Genesis Airdrop',
          metaTags: [
            {
              name: 'description',
              content: 'Claim Bribe Airdrop'
            },
            {
              property: 'og:description',
              content: 'Claim Bribe Airdrop'
            }
          ]
        }
    },
    {
        path: '/bsc',
        name: 'bsc',
        component: BSC,
        meta: {
          title: 'BRIBE on BSC',
          metaTags: [
            {
              name: 'description',
              content: 'BRIBE on BSC | Upcoming'
            },
            {
              property: 'og:description',
              content: 'BRIBE on BSC | Upcoming'
            }
          ]
        }
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  // const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router