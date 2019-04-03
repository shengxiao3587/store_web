import { connect } from 'react-redux';
import { actions } from '../modules';
import { moduleName } from '../index';
import View from '../components';
import { dict } from '../../../../store/dict';

const mapDispatchToProps = {
  ...actions,
  dict,
};

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    permission: state.common.permission[state.common.selectedKeys[0]] || {},
    dicts: state.dict,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
