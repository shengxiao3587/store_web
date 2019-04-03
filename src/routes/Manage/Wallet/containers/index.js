import { actions } from '../modules';
import { moduleName } from '../index';
import { dict } from '../../../../store/dict';
import View from '../components';
import publicConnect from '../../publicConnect';

const moduleStates = [{
  name: 'dicts',
  value: 'dict',
}];
export default publicConnect({ ...actions, dict }, moduleName, moduleStates, View);
