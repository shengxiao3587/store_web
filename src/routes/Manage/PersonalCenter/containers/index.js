import { actions } from '../modules';
import { moduleName } from '../index';
import View from '../components';
import { dict } from '../../../../store/dict';
import publicConnect from '../../publicConnect';

const moduleStates = [{
  name: 'dicts',
  value: 'dict',
}];
export default publicConnect({ dict, ...actions }, moduleName, moduleStates, View);
