// We only need to import the modules necessary for initial render
/* eslint-disable import/no-dynamic-require */
import CoreLayout from '../../layouts/CoreLayout';
import Home from '../Home';
import Expressage from './Expressage';
import ExpressageDetail from './ExpressageDetail';
import Piecein from './Piecein';
import Piecesign from './Piecesign';
import PersonalCenter from './PersonalCenter';
import PickUp from './PickUp';
import EmployeeList from './EmployeeList';
import HomePage from './HomePage';
import NameList from './NameList';
import ProtocolSteps from './ProtocolSteps';
import NewsNote from './NewsNote';
import Wallet from './Wallet';
import SenderTask from './SenderTask';
import DistributionTask from './DistributionTask';
import DistributionDetail from './DistributionDetail';
import RiderDetail from './RiderDetail';
import WalletOut from './WalletOut';
import SenderDetail from './SenderDetail';
import PackageBill from './PackageBill';
import Partner from './Partner';
import ProtocolRenew from './ProtocolRenew';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

const createRoutes = (store) => ({
  path        : '/Manage',
  component   : CoreLayout,
  indexRoute  : Home,
  onEnter: (apts, replace, next) => {
    next();
  },
  onLeave: () => {
  },
  childRoutes : [
    Expressage(store),
    ExpressageDetail(store),
    Piecein(store),
    Piecesign(store),
    PersonalCenter(store),
    PickUp(store),
    HomePage(store),
    EmployeeList(store),
    NameList(store),
    ProtocolSteps(store),
    NewsNote(store),
    Wallet(store),
    DistributionTask(store),
    DistributionDetail(store),
    RiderDetail(store),
    WalletOut(store),
    SenderDetail(store),
    SenderTask(store),
    PackageBill(store),
    Partner(store),
    ProtocolRenew(store),
  ],
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
